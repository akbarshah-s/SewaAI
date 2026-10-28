import { GoogleGenerativeAI } from '@google/generative-ai';
import { Language, ChatMessage, AgentToolCall, UserProfileData } from '../types/sewa';
import { 
  toolFindService, 
  toolCheckEligibility, 
  toolGetRequiredDocuments, 
  toolGenerateApplication, 
  toolSubmitApplication, 
  toolSubmitComplaint, 
  toolTrackApplication, 
  toolFindGovernmentOffice,
  recordToolCall
} from './agentTools';

// Initialize Gemini API client if environment key is provided, or fallback to local agentic tool execution loop
const GEMINI_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

async function answerGeneralQuestion(
  userText: string,
  context: AgentContext,
  chatHistory: ChatMessage[]
): Promise<string> {
  if (!genAI) {
    return `I can help with government services such as scholarships, pensions, certificates, healthcare schemes, complaints, application tracking, and nearby offices. I could not match that question to a service yet. Please include the service name or ask about eligibility, required documents, application status, or how to apply.`;
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const history = chatHistory.slice(-6).map(message => `${message.sender}: ${message.text}`).join('\n');
  const prompt = `You are SewaAI, a concise Indian government-services assistant for Kerala citizens.
Answer the citizen's question directly and honestly. Use only the supported service areas: scholarships, pensions, certificates, healthcare schemes, complaints, application tracking, and government offices. Do not invent application status, eligibility rules, fees, deadlines, or official links. If the question needs official confirmation, say so and provide the next practical step. Reply in ${context.language === 'ml' ? 'Malayalam' : context.language === 'hi' ? 'Hindi' : 'English'}.

Citizen profile: ${JSON.stringify(context.userProfile)}
Recent conversation:
${history || 'No previous messages'}

Citizen question: ${userText}`;

  const result = await model.generateContent(prompt);
  const generatedText = result.response.text().trim();
  return generatedText || 'I could not generate an answer for that question. Please ask about a government service, eligibility, documents, status, complaint, or office.';
}

export interface AgentContext {
  userProfile: UserProfileData;
  activeServiceId?: string;
  language: Language;
  sessionStep?: 'initial' | 'service_selected' | 'eligibility_checked' | 'docs_review' | 'app_drafted' | 'submitted';
}

/**
 * Main SewaAI Agent Execution Engine
 */
export async function processSewaAgentMessage(
  userText: string,
  context: AgentContext,
  chatHistory: ChatMessage[]
): Promise<ChatMessage> {
  const messageId = `msg-${Date.now()}`;
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const executedTools: AgentToolCall[] = [];

  const lowerInput = userText.toLowerCase().trim();
  const lang = context.language;

  // 1. Detect Intent & Execute Tools
  let responseText = '';
  let widget: ChatMessage['widget'] = undefined;

  // Pattern A: Track application or complaint status
  if (lowerInput.includes('track') || lowerInput.includes('status') || lowerInput.includes('swa-') || lowerInput.includes('cmp-')) {
    const match = userText.match(/(SWA|CMP)-2026-\d+/i) || userText.match(/\d{5,}/);
    const targetRef = match ? match[0].toUpperCase() : 'SWA-2026-102431';

    const toolCall: AgentToolCall = {
      id: `tool-${Date.now()}`,
      toolName: 'trackApplication',
      params: { referenceId: targetRef },
      output: null,
      timestamp: new Date().toLocaleTimeString(),
      status: 'executing'
    };

    const trackResult = toolTrackApplication(targetRef);
    toolCall.output = trackResult;
    toolCall.status = 'completed';
    executedTools.push(toolCall);
    recordToolCall(toolCall);

    if (trackResult.found && trackResult.record) {
      const rec = trackResult.record;
      if (lang === 'ml') {
        responseText = `അപേക്ഷ ${rec.referenceId} (${rec.serviceName}) നിലവിലെ സ്റ്റാറ്റസ്: **${rec.currentStatus}**. ഈ ഘട്ടം താലൂക്ക്/വകുപ്പ് ഓഫീസിൽ അവലോകനത്തിലാണ്. സാങ്ഷൻ പൂർത്തിയാകുമ്പോൾ അപ്‌ഡേറ്റ് ലഭിക്കും.`;
      } else if (lang === 'hi') {
        responseText = `आवेदन ${rec.referenceId} (${rec.serviceName}) की वर्तमान स्थिति: **${rec.currentStatus}** है। संबंधित विभाग द्वारा समीक्षा जारी है।`;
      } else {
        responseText = `Application **${rec.referenceId}** for *${rec.serviceName}* is currently: **${rec.currentStatus}**. It is under verification by the ${rec.department}. Estimated completion by ${rec.estimatedCompletion}.`;
      }
      widget = {
        type: 'application_confirmation',
        payload: rec
      };
    } else if (trackResult.found && trackResult.complaintRecord) {
      const cmp = trackResult.complaintRecord;
      if (lang === 'ml') {
        responseText = `പരാതി തീയതി ${cmp.submittedAt} (ID: **${cmp.complaintId}**) നിലവിലെ അവസ്ഥ: **${cmp.status}**. അസൈൻ ചെയ്ത ഉദ്യോഗസ്ഥൻ: ${cmp.assignedOfficer || 'PWD Nodal Officer'}.`;
      } else {
        responseText = `Grievance **${cmp.complaintId}** (${cmp.category}) status is **${cmp.status}**. Assigned to: ${cmp.assignedOfficer || 'Nodal Officer'}.`;
      }
      widget = {
        type: 'complaint_confirmation',
        payload: cmp
      };
    } else {
      if (lang === 'ml') {
        responseText = `ക്ഷമിക്കണം, ${targetRef} എന്ന റഫറൻസ് നമ്പർ കണ്ടെത്താൻ കഴിഞ്ഞില്ല. സജീവമായ രണ്ട് മാതൃകാ അപേക്ഷകൾ: **SWA-2026-102431** അല്ലെങ്കിൽ **CMP-2026-30192** പരിശോധിച്ച് നോക്കൂ.`;
      } else {
        responseText = `I could not find application or grievance reference **${targetRef}**. Try tracking existing sample record **SWA-2026-102431** or complaint **CMP-2026-30192**.`;
      }
    }
  }

  // Pattern B: Apply for a scholarship / pension / service request
  else if (
    lowerInput.includes('scholarship') ||
    lowerInput.includes('pension') ||
    lowerInput.includes('certificate') ||
    lowerInput.includes('health') ||
    lowerInput.includes('medical') ||
    lowerInput.includes('hospital') ||
    lowerInput.includes('ayushman') ||
    lowerInput.includes('karunya') ||
    lowerInput.includes('employment') ||
    lowerInput.includes('job') ||
    lowerInput.includes('business') ||
    lowerInput.includes('apply') ||
    lowerInput.includes('eligible')
  ) {
    let serviceCategory = 'all';
    if (lowerInput.includes('scholarship')) serviceCategory = 'scholarships';
    if (lowerInput.includes('pension')) serviceCategory = 'pensions';
    if (lowerInput.includes('certificate') || lowerInput.includes('income')) serviceCategory = 'certificates';
    if (lowerInput.includes('health') || lowerInput.includes('medical') || lowerInput.includes('hospital') || lowerInput.includes('ayushman') || lowerInput.includes('karunya')) serviceCategory = 'healthcare';
    if (lowerInput.includes('employment') || lowerInput.includes('job') || lowerInput.includes('business')) serviceCategory = 'employment';

    // Tool Call: findService
    const findToolCall: AgentToolCall = {
      id: `tool-${Date.now()}-1`,
      toolName: 'findService',
      params: { query: userText, category: serviceCategory },
      output: null,
      timestamp: new Date().toLocaleTimeString(),
      status: 'executing'
    };

    const matchingServices = toolFindService(userText, serviceCategory);
    findToolCall.output = matchingServices;
    findToolCall.status = 'completed';
    executedTools.push(findToolCall);
    recordToolCall(findToolCall);

    const selectedService = matchingServices[0]
      || toolFindService('', serviceCategory)[0]
      || toolFindService('scholarship')[0];
    context.activeServiceId = selectedService.id;

    // Tool Call: checkEligibility
    const eligToolCall: AgentToolCall = {
      id: `tool-${Date.now()}-2`,
      toolName: 'checkEligibility',
      params: { serviceId: selectedService.id, userProfile: context.userProfile },
      output: null,
      timestamp: new Date().toLocaleTimeString(),
      status: 'executing'
    };

    const eligResult = toolCheckEligibility(selectedService.id, context.userProfile);
    eligToolCall.output = eligResult;
    eligToolCall.status = 'completed';
    executedTools.push(eligToolCall);
    recordToolCall(eligToolCall);

    // Tool Call: getRequiredDocuments
    const docToolCall: AgentToolCall = {
      id: `tool-${Date.now()}-3`,
      toolName: 'getRequiredDocuments',
      params: { serviceId: selectedService.id },
      output: selectedService.requiredDocuments,
      timestamp: new Date().toLocaleTimeString(),
      status: 'completed'
    };
    executedTools.push(docToolCall);
    recordToolCall(docToolCall);

    if (lang === 'ml') {
      responseText = `തീർച്ചയായും! **${selectedService.nameMl || selectedService.name}** സേവനത്തിന് ഞാൻ നിങ്ങളെ സഹായിക്കാം. \n\nനിങ്ങളുടെ വിവരങ്ങൾ പരിശോധിച്ച് യോജ്യതയും ആവശ്യമായ രേഖകളും താഴെ നൽകിയിരിക്കുന്നു:`;
    } else if (lang === 'hi') {
      responseText = `मैं **${selectedService.nameHi || selectedService.name}** योजना के लिए आवेदन करने में आपकी सहायता कर सकता हूँ। आपकी पात्रता और आवश्यक दस्तावेजों का विवरण नीचे दिया गया है:`;
    } else {
      responseText = `I can help you apply for **${selectedService.name}**. I have checked the eligibility guidelines and identified the required documents for your session:`;
    }

    widget = {
      type: 'eligibility_result',
      payload: eligResult
    };
  }

  // Pattern C: Report complaint / grievance
  else if (lowerInput.includes('pothole') || lowerInput.includes('street-light') || lowerInput.includes('streetlight') || lowerInput.includes('report') || lowerInput.includes('complaint') || lowerInput.includes('water')) {
    const toolCall: AgentToolCall = {
      id: `tool-${Date.now()}`,
      toolName: 'submitComplaint',
      params: { category: 'Public Infrastructure & Potholes', location: 'Civic Area', description: userText },
      output: null,
      timestamp: new Date().toLocaleTimeString(),
      status: 'executing'
    };

    const complaintRecord = toolSubmitComplaint(
      'Infrastructure & Potholes',
      'Civil Station Road Junction',
      userText,
      context.userProfile.fullName || 'Citizen User',
      context.userProfile.contactNumber || '+91 9876543210'
    );

    toolCall.output = complaintRecord;
    toolCall.status = 'completed';
    executedTools.push(toolCall);
    recordToolCall(toolCall);

    if (lang === 'ml') {
      responseText = `നിങ്ങളുടെ പരാതി വിജയകരമായി രജിസ്റ്റർ ചെയ്തു! പരാതി നമ്പർ: **${complaintRecord.complaintId}**. ഇത് പൊതുമരാമത്ത് (PWD) വകുപ്പിലേക്ക് കൈമാറി.`;
    } else if (lang === 'hi') {
      responseText = `आपकी शिकायत सफलतापूर्वक दर्ज कर ली गई है! शिकायत आईडी: **${complaintRecord.complaintId}**। इसे संबंधित लोक निर्माण विभाग को भेज दिया गया है।`;
    } else {
      responseText = `I have logged your public grievance with Reference Complaint ID: **${complaintRecord.complaintId}**. It has been dispatched to the local PWD Department.`;
    }

    widget = {
      type: 'complaint_confirmation',
      payload: complaintRecord
    };
  }

  // Pattern D: Find Government Office
  else if (lowerInput.includes('office') || lowerInput.includes('nearest') || lowerInput.includes('where') || lowerInput.includes('tahsildar') || lowerInput.includes('collectorate')) {
    const toolCall: AgentToolCall = {
      id: `tool-${Date.now()}`,
      toolName: 'findGovernmentOffice',
      params: { query: userText, district: context.userProfile.district || 'Ernakulam' },
      output: null,
      timestamp: new Date().toLocaleTimeString(),
      status: 'executing'
    };

    const offices = toolFindGovernmentOffice(userText, context.userProfile.district);
    toolCall.output = offices;
    toolCall.status = 'completed';
    executedTools.push(toolCall);
    recordToolCall(toolCall);

    if (lang === 'ml') {
      responseText = `നിങ്ങളുടെ പ്രദേശത്തുള്ള പ്രധാന സർക്കാർ ഓഫീസുകൾ താഴെ ചേർക്കുന്നു:`;
    } else {
      responseText = `Here are the nearby government offices and collectorate counters for your query:`;
    }

    widget = {
      type: 'office_cards',
      payload: offices
    };
  }

  // Fallback E: General inquiry / Greetings
  else {
    const findToolCall: AgentToolCall = {
      id: `tool-${Date.now()}`,
      toolName: 'findService',
      params: { query: 'popular' },
      output: toolFindService(''),
      timestamp: new Date().toLocaleTimeString(),
      status: 'completed'
    };
    executedTools.push(findToolCall);
    recordToolCall(findToolCall);

    responseText = await answerGeneralQuestion(userText, context, chatHistory);

    widget = {
      type: 'service_suggestions',
      payload: toolFindService('')
    };
  }

  return {
    id: messageId,
    sender: 'sewa_agent',
    text: responseText,
    timestamp,
    toolCallsExecuted: executedTools,
    widget,
    language: lang
  };
}
