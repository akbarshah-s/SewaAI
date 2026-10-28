import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  FileText, 
  Cpu, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink, 
  ArrowRight, 
  ShieldAlert, 
  Upload, 
  MapPin, 
  Building2,
  RefreshCw,
  Search,
  BookOpen,
  HeartHandshake,
  Mic,
  MicOff
} from 'lucide-react';
import { ChatMessage, UserProfileData, Language, ApplicationRecord, ComplaintRecord } from '../types/sewa';
import { processSewaAgentMessage, AgentContext } from '../services/geminiAgent';
import { toolSubmitApplication, getRuntimeApplications } from '../services/agentTools';
import { translations } from '../utils/translations';
import confetti from 'canvas-confetti';

interface SpeechRecognitionResultEventLike {
  results: ArrayLike<ArrayLike<{ transcript: string; isFinal?: boolean }>>;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionResultEventLike) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onnomatch: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

interface AgentChatProps {
  currentLanguage: Language;
  onNavigateToTab: (tab: string, refId?: string) => void;
}

export const AgentChat: React.FC<AgentChatProps> = ({
  currentLanguage,
  onNavigateToTab,
}) => {
  const t = translations[currentLanguage];

  const [userProfile, setUserProfile] = useState<UserProfileData>({
    fullName: 'Ananya Ramesh',
    age: 20,
    gender: 'Female',
    state: 'Kerala',
    district: 'Ernakulam',
    pincode: '682030',
    isStudent: true,
    courseName: 'B.Tech Computer Science',
    institution: 'Government Engineering College',
    annualIncome: 180000,
    category: 'OBC',
    contactNumber: '+91 9876543210',
    email: 'ananya.r@example.com',
    uploadedDocs: {
      'Aadhaar Card / ID Proof': true,
      'Income Certificate': true,
      'Student ID / Bonafide Certificate': true,
      'Bank Account Passbook': true
    }
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'sewa_agent',
      text: currentLanguage === 'ml' 
        ? `നമസ്കാരം! ഞാൻ **സേവAI** — നിങ്ങളുടെ സർക്കാർ സേവന അസിസ്റ്റന്റ്. \n\nഏത് പദ്ധതിക്കാണ് നിങ്ങൾ അപേക്ഷിക്കാൻ ആഗ്രഹിക്കുന്നത്? അല്ലെങ്കിൽ യോജ്യതയും ആനുകൂല്യങ്ങളും പരിശോധിച്ച് നൽകണോ?` 
        : currentLanguage === 'hi'
        ? `नमस्ते! मैं **सेवाAI** — आपका सरकारी सेवा सहायक हूँ।\n\nमैं छात्रवृत्ति, पेंशन, आय प्रमाणपत्र और लोक शिकायतों के समाधान में आपकी सहायता कर सकता हूँ।`
        : `Hello Ananya! I am **SewaAI**, your personal Government Services Assistant.\n\nTell me what you need, like: *"I want to apply for a student scholarship"*, *"Am I eligible for old age pension?"*, or *"Check the status of SWA-2026-102431"*!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      toolCallsExecuted: [
        {
          id: 'init-tool-1',
          toolName: 'findService',
          params: { query: 'initial greeting' },
          output: 'Agent session initialized for Ananya Ramesh (Ernakulam, Kerala)',
          timestamp: new Date().toLocaleTimeString(),
          status: 'completed'
        }
      ]
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showToolLogPanel, setShowToolLogPanel] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  useEffect(() => () => {
    recognitionRef.current?.stop();
  }, []);

  const toggleVoiceInput = async () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const SpeechRecognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError('Voice input is not supported in this browser. Try Chrome or Edge.');
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setVoiceError('This browser cannot access a microphone. Try Chrome or Edge over localhost.');
      return;
    }

    let microphoneStream: MediaStream;
    try {
      setVoiceError('Requesting microphone permission...');
      microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphoneStream.getTracks().forEach(track => track.stop());
    } catch {
      setVoiceError('Microphone access was blocked. Allow microphone permission for localhost, then try again.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = currentLanguage === 'ml' ? 'ml-IN' : currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      setIsListening(true);
      setVoiceError(null);
    };
    recognition.onresult = (event) => {
      const finalResults = Array.from(event.results).filter(result => result[0]?.isFinal);
      const transcript = finalResults
        .map(result => result[0]?.transcript || '')
        .join(' ')
        .trim();
      if (transcript) setInputText(previousText => {
        const separator = previousText && !previousText.endsWith(' ') ? ' ' : '';
        return `${previousText}${separator}${transcript}`;
      });
      setVoiceError(null);
    };
    recognition.onerror = (event) => {
      setIsListening(false);
      const errorMessage = event.error === 'not-allowed' || event.error === 'service-not-allowed'
        ? 'Microphone access was blocked. Allow microphone permission for localhost, then try again.'
        : event.error === 'no-speech'
        ? 'No speech was detected. Speak after the microphone button turns red, then try again.'
        : 'Voice input stopped unexpectedly. Check your microphone and try again.';
      setVoiceError(errorMessage);
    };
    recognition.onnomatch = () => {
      setIsListening(false);
      setVoiceError('I could not understand that. Please speak clearly and try again.');
    };
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };
    recognitionRef.current = recognition;
    setVoiceError(null);
    try {
      recognition.start();
    } catch {
      setIsListening(false);
      recognitionRef.current = null;
      setVoiceError('Voice input could not start. Please click the microphone and try again.');
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isProcessing) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsProcessing(true);

    const context: AgentContext = {
      userProfile,
      language: currentLanguage
    };

    try {
      const agentResponse = await processSewaAgentMessage(query, context, messages);
      setMessages(prev => [...prev, agentResponse]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: `msg-error-${Date.now()}`,
        sender: 'sewa_agent',
        text: currentLanguage === 'ml'
          ? 'ക്ഷമിക്കണം, ഇപ്പോൾ മറുപടി തയ്യാറാക്കാൻ കഴിഞ്ഞില്ല. കുറച്ച് കഴിഞ്ഞ് വീണ്ടും ശ്രമിക്കൂ.'
          : currentLanguage === 'hi'
          ? 'क्षमा करें, अभी उत्तर तैयार नहीं हो सका। कृपया थोड़ी देर बाद फिर प्रयास करें।'
          : 'Sorry, I could not prepare an answer right now. Please try again in a moment.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickSubmitApplication = (serviceId: string, serviceName: string) => {
    const draftApp: Partial<ApplicationRecord> = {
      serviceId,
      serviceName,
      applicant: userProfile,
      documentsAttached: Object.keys(userProfile.uploadedDocs).filter(k => userProfile.uploadedDocs[k])
    };

    const record = toolSubmitApplication(draftApp);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    const confirmMsg: ChatMessage = {
      id: `msg-submit-${Date.now()}`,
      sender: 'sewa_agent',
      text: currentLanguage === 'ml'
        ? `അഭിനന്ദനങ്ങൾ! നിങ്ങളുടെ അപേക്ഷ വിജയകരമായി സമർപ്പിച്ചു. അപേക്ഷാ റഫറൻസ് നമ്പർ: **${record.referenceId}**.`
        : `Congratulations! Your application for **${serviceName}** has been generated & submitted. Your Reference ID is **${record.referenceId}**.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      widget: {
        type: 'application_confirmation',
        payload: record
      }
    };

    setMessages(prev => [...prev, confirmMsg]);
  };

  const copyToClipboard = (idText: string) => {
    navigator.clipboard.writeText(idText);
    setCopiedId(idText);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPills = [
    { label: t.quickCheckEligibility, action: 'Check my eligibility for Post-Matric Scholarship' },
    { label: t.quickFindService, action: 'Find pension services for senior citizens' },
    { label: t.quickApplyService, action: 'I want to apply for student scholarship' },
    { label: t.quickTrackApplication, action: 'Track application SWA-2026-102431' },
    { label: t.quickRequiredDocs, action: 'What documents do I need for Income Certificate?' },
    { label: t.quickFindOffice, action: 'Find nearest government collectorate office' },
  ];

  // Collect all tool calls executed across conversation for the Hackathon Judge Panel
  const allExecutedTools = messages.flatMap(m => m.toolCallsExecuted || []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Agent Identity & Status Header */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-500 to-gov-600 p-0.5 shadow-md shadow-teal-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Bot className="w-7 h-7 text-teal-400" />
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">{t.agentName}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {t.agentStatus}
              </span>
            </div>
            <p className="text-xs text-slate-400">{t.agentRole} • Session: Ananya Ramesh (Ernakulam, KL)</p>
          </div>
        </div>

        {/* Hackathon Tool Matrix Toggle Button */}
        <button
          onClick={() => setShowToolLogPanel(!showToolLogPanel)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
            showToolLogPanel 
              ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-sm' 
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
          }`}
        >
          <Cpu className="w-4 h-4 text-teal-400" />
          <span>{showToolLogPanel ? 'Hide Agent Tools Matrix' : 'Show Agent Tools Matrix (Judge Demo)'}</span>
        </button>
      </div>

      {/* Main Grid: Chat Stream + Agent Tools Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Chat Section */}
        <div className={`space-y-4 transition-all ${showToolLogPanel ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
          
          {/* Quick Action Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {quickPills.map((pill, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(pill.action)}
                className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 text-slate-300 hover:text-teal-300 text-xs font-medium transition-all"
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Chat Messages Container */}
          <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-800 bg-slate-900/80 min-h-[500px] max-h-[650px] overflow-y-auto space-y-6">
            {messages.map((msg) => {
              const isAgent = msg.sender === 'sewa_agent';
              const widget = msg.widget;
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 sm:gap-4 ${isAgent ? 'justify-start' : 'justify-end'}`}
                >
                  {isAgent && (
                    <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5 text-teal-400" />
                    </div>
                  )}

                  <div className={`space-y-3 max-w-[85%] sm:max-w-[75%]`}>
                    
                    {/* Bubble Content */}
                    <div
                      className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        isAgent
                          ? 'bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-tl-none shadow-md'
                          : 'bg-gradient-to-r from-teal-600 to-gov-600 text-white rounded-tr-none shadow-lg'
                      }`}
                    >
                      <div className="whitespace-pre-line font-normal">
                        {msg.text}
                      </div>

                      {/* Tool Calls execution badge inside message */}
                      {msg.toolCallsExecuted && msg.toolCallsExecuted.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-700/60 flex flex-wrap gap-1.5">
                          {msg.toolCallsExecuted.map(tCall => (
                            <span
                              key={tCall.id}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/80 border border-teal-500/30 text-[11px] font-mono text-teal-300"
                            >
                              <Terminal className="w-3 h-3 text-teal-400" />
                              <span>fn:{tCall.toolName}()</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Interactive Widgets */}
                    {widget && (
                      <div className="mt-2">
                        
                        {/* Widget 1: Eligibility Assessment */}
                        {widget.type === 'eligibility_result' && (
                          <div className="glass-card rounded-xl p-4 border border-teal-500/30 bg-slate-900/90 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-300">Eligibility Assessment</span>
                              <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 ${
                                widget.payload.status === 'eligible' 
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              }`}>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{widget.payload.status === 'eligible' ? t.eligible : t.needsInfo}</span>
                              </span>
                            </div>

                            <div className="space-y-1 text-xs text-slate-300">
                              {widget.payload.reasons.map((r: string, idx: number) => (
                                <p key={idx} className="leading-snug">{r}</p>
                              ))}
                            </div>

                            {/* Required Docs Checklist Preview */}
                            <div className="pt-2 border-t border-slate-800">
                              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                Required Documents ({widget.payload.requiredDocs.length})
                              </span>
                              <div className="space-y-1 text-xs">
                                {widget.payload.requiredDocs.slice(0, 3).map((d: string, i: number) => (
                                  <div key={i} className="flex items-center gap-2 text-slate-300">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                                    <span>{d}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="pt-2 flex items-center gap-2">
                              <button
                                onClick={() => handleQuickSubmitApplication(widget.payload.serviceId, widget.payload.serviceName)}
                                className="w-full py-2 rounded-lg bg-gradient-to-r from-teal-500 to-gov-600 text-white text-xs font-bold shadow-md hover:from-teal-400 hover:to-gov-500 transition-all text-center"
                              >
                                Submit Application Now (Instant)
                              </button>
                            </div>

                            <p className="text-[10px] text-amber-400/90 italic text-center">
                              {widget.payload.isDemoNotice}
                            </p>
                          </div>
                        )}

                        {/* Widget 2: Application Confirmation */}
                        {widget.type === 'application_confirmation' && (
                          <div className="glass-card rounded-xl p-4 border border-emerald-500/40 bg-slate-900/95 space-y-3 shadow-xl">
                            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Application Successfully Processed</span>
                            </div>

                            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Reference ID</span>
                                <span className="text-lg font-mono font-extrabold text-teal-300">
                                  {widget.payload.referenceId}
                                </span>
                              </div>
                              <button
                                onClick={() => copyToClipboard(widget.payload.referenceId)}
                                className="p-2 rounded bg-slate-800 text-slate-300 hover:text-white"
                                title="Copy Reference ID"
                              >
                                {copiedId === widget.payload.referenceId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>

                            <div className="text-xs text-slate-300 space-y-1">
                              <p><strong>Service:</strong> {widget.payload.serviceName}</p>
                              <p><strong>Applicant:</strong> {widget.payload.applicant.fullName}</p>
                              <p><strong>Status:</strong> <span className="text-teal-400 font-bold">{widget.payload.currentStatus}</span></p>
                            </div>

                            <button
                              onClick={() => onNavigateToTab('applications', widget.payload.referenceId)}
                              className="w-full py-2 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-teal-300 text-xs font-bold flex items-center justify-center gap-2"
                            >
                              <span>View Full Timeline & Tracking</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {/* Widget 3: Complaint Confirmation */}
                        {widget.type === 'complaint_confirmation' && (
                          <div className="glass-card rounded-xl p-4 border border-amber-500/40 bg-slate-900/95 space-y-3">
                            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                              <AlertCircle className="w-4 h-4" />
                              <span>Grievance Ticket Created</span>
                            </div>
                            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] text-slate-400 uppercase block">Complaint ID</span>
                                <span className="text-base font-mono font-bold text-amber-300">
                                  {widget.payload.complaintId}
                                </span>
                              </div>
                              <button
                                onClick={() => copyToClipboard(widget.payload.complaintId)}
                                className="p-2 rounded bg-slate-800 text-slate-300"
                              >
                                {copiedId === widget.payload.complaintId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                            <button
                              onClick={() => onNavigateToTab('complaints')}
                              className="w-full py-2 rounded bg-slate-800 text-slate-200 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5"
                            >
                              <span>View Grievance Status</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                      </div>
                    )}

                    <span className="text-[10px] text-slate-500 block px-1">
                      {msg.timestamp}
                    </span>
                  </div>

                  {!isAgent && (
                    <div className="w-9 h-9 rounded-xl bg-gov-600/30 border border-gov-500/40 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-gov-300" />
                    </div>
                  )}
                </div>
              );
            })}

            {isProcessing && (
              <div className="flex items-center gap-3 text-slate-400 text-xs py-2">
                <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center animate-spin">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                </div>
                <span className="font-mono animate-pulse">SewaAI agent evaluating tools & checking government rules...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="glass-panel rounded-xl p-3 border border-slate-800 bg-slate-900/90">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={currentLanguage === 'ml' ? "സേവAI-യോട് എന്തും ചോദിക്കൂ (ഉദാ: സ്കോളർഷിപ്പ് അപേക്ഷ)..." : "Ask SewaAI anything (e.g. scholarship application, pension eligibility, track status)..."}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500/60"
              />
              <button
                type="button"
                onClick={toggleVoiceInput}
                disabled={isProcessing}
                title={isListening ? 'Stop voice input' : 'Speak your question'}
                aria-label={isListening ? 'Stop voice input' : 'Speak your question'}
                className={`p-3 rounded-xl border transition-all disabled:opacity-50 ${
                  isListening
                    ? 'bg-red-500/20 text-red-300 border-red-500/50 animate-pulse'
                    : 'bg-slate-800 text-teal-300 border-slate-700 hover:bg-teal-500/10 hover:border-teal-500/50'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <button
                type="submit"
                disabled={!inputText.trim() || isProcessing}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-gov-600 hover:from-teal-400 hover:to-gov-500 text-white font-bold text-sm shadow-md disabled:opacity-50 transition-all flex items-center gap-2"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
            {voiceError && <p className="mt-2 text-xs text-amber-300">{voiceError}</p>}
          </div>

        </div>

        {/* Hackathon Judge Agent Execution Matrix Visualizer Side-Panel */}
        {showToolLogPanel && (
          <div className="lg:col-span-4 glass-panel rounded-2xl p-4 border border-slate-800 bg-slate-950/95 space-y-4 max-h-[720px] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-teal-400 animate-pulse" />
                <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                  Agent Tools Execution Matrix
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-teal-500/10 text-teal-300 border border-teal-500/30">
                {allExecutedTools.length} calls
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-snug">
              Live visualization for Hackathon Judges showing how SewaAI agent decides, plans parameters, and invokes background functions.
            </p>

            <div className="space-y-2.5">
              {allExecutedTools.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-500 font-mono">
                  No tool calls executed yet. Type a request to trigger agent functions.
                </div>
              ) : (
                allExecutedTools.map((tCall, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 font-mono text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-teal-400 font-bold">fn:{tCall.toolName}()</span>
                      <span className="text-[10px] text-slate-500">{tCall.timestamp}</span>
                    </div>
                    
                    <div className="bg-slate-950 p-2 rounded border border-slate-800 text-[10px] text-slate-300 overflow-x-auto">
                      <span className="text-slate-500 font-bold block mb-0.5">Parameters:</span>
                      <code>{JSON.stringify(tCall.params)}</code>
                    </div>

                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Status: <span className="text-emerald-400">{tCall.status}</span></span>
                      <span className="text-teal-400/80">Result: OK</span>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
