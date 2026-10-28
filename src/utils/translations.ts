import { Language } from '../types/sewa';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    appName: "SewaAI",
    appTagline: "Your Government Services Assistant",
    heroTitle: "SewaAI — Your Government Services Assistant",
    heroSubtitle: "Understand. Check. Apply. Track.",
    heroDescription: "An AI agent that helps citizens access government services by understanding their needs, checking eligibility, guiding applications, and tracking progress.",
    talkToSewaAI: "Talk to SewaAI",
    exploreServices: "Explore Services",
    navServices: "Services Directory",
    navApplications: "My Applications",
    navComplaints: "Grievances",
    navOffices: "Govt Offices",
    navDashboard: "Citizen Dashboard",
    navAdmin: "Judge Demo Admin",
    
    // Identity
    agentName: "SewaAI",
    agentRole: "Government Services Assistant",
    agentStatus: "Online & Ready",
    
    // Quick Action Buttons
    quickCheckEligibility: "Check Eligibility",
    quickFindService: "Find a Service",
    quickApplyService: "Apply for a Service",
    quickTrackApplication: "Track Application",
    quickRequiredDocs: "Required Documents",
    quickFindOffice: "Find Govt Office",
    
    // Categories
    catEducation: "Education",
    catHealthcare: "Healthcare",
    catScholarships: "Scholarships",
    catCertificates: "Certificates & ID",
    catPensions: "Pensions & Social Welfare",
    catEmployment: "Employment & Skill",
    catWelfare: "Citizen Welfare",
    catComplaints: "Public Grievances",
    catUtilities: "Public Utilities",
    catLocalGov: "Local Panchayath / Municipality",
    
    // Eligibility
    eligible: "Potentially Eligible",
    needsInfo: "Needs More Information",
    notEligible: "Currently Not Eligible",
    disclaimerNotice: "Prototype eligibility assessment — verify with the official department.",
    
    // App Steps
    step1Personal: "1. Personal Details",
    step2Eligibility: "2. Eligibility",
    step3Documents: "3. Documents",
    step4Form: "4. Application Form",
    step5Review: "5. Review",
    step6Submit: "6. Submit",
    step7Tracking: "7. Tracking",
    
    // Actions
    submitApp: "Submit Application",
    reviewApp: "Review Your Application",
    trackStatus: "Track Status",
    viewDetails: "View Details",
    uploadDoc: "Upload Document",
    missingDoc: "Missing",
    uploadedDoc: "Uploaded",
    optionalDoc: "Optional",
    
    // Dashboard
    greeting: "Good afternoon 👋",
    dashboardSub: "Welcome to your public services portal",
    activeApps: "Active Applications",
    recentComplaints: "Recent Complaints",
    pendingDocs: "Pending Documents",
    notifications: "Notifications",
    agentToolsLog: "Agent Tool Execution Log",
    
    // Language
    selectLang: "Language / ഭാഷ",
  },
  ml: {
    appName: "സേവAI (SewaAI)",
    appTagline: "നിങ്ങളുടെ സർക്കാർ സേവന അസിസ്റ്റന്റ്",
    heroTitle: "സേവAI — നിങ്ങളുടെ സർക്കാർ സേവന അസിസ്റ്റന്റ്",
    heroSubtitle: "മനസ്സിലാക്കൂ. പരിശോധിക്കൂ. അപേക്ഷിക്കൂ. ട്രാക്ക് ചെയ്യൂ.",
    heroDescription: "പൗരന്മാർക്ക് സർക്കാർ സേവനങ്ങൾ എളുപ്പത്തിൽ ലഭ്യമാക്കാൻ സഹായിക്കുന്ന ഒരു വിപ്ലവാത്മക AI ഏജന്റ്.",
    talkToSewaAI: "സേവAI-യോട് സംസാരിക്കൂ",
    exploreServices: "സേവനങ്ങൾ കാണുക",
    navServices: "സേവനങ്ങളുടെ പട്ടിക",
    navApplications: "എന്റെ അപേക്ഷകൾ",
    navComplaints: "പരാതികൾ",
    navOffices: "സർക്കാർ ഓഫീസുകൾ",
    navDashboard: "സിറ്റിസൺ ഡാഷ്‌ബോർഡ്",
    navAdmin: "അഡ്മിൻ ഡെമോ",
    
    // Identity
    agentName: "സേവAI",
    agentRole: "സർക്കാർ സേവന അസിസ്റ്റന്റ്",
    agentStatus: "ഓൺലൈൻ ലഭ്യമാണ്",
    
    // Quick Action Buttons
    quickCheckEligibility: "യോജ്യത പരിശോധിക്കുക",
    quickFindService: "സേവനം കണ്ടെത്തുക",
    quickApplyService: "അപേക്ഷ നൽകുക",
    quickTrackApplication: "സ്റ്റാറ്റസ് ട്രാക്ക് ചെയ്യുക",
    quickRequiredDocs: "ആവശ്യമായ രേഖകൾ",
    quickFindOffice: "ഓഫീസ് കണ്ടെത്തുക",
    
    // Categories
    catEducation: "വിദ്യാഭ്യാസം",
    catHealthcare: "ആരോഗ്യം",
    catScholarships: "സ്കോളർഷിപ്പുകൾ",
    catCertificates: "സർട്ടിഫിക്കറ്റുകൾ",
    catPensions: "പെൻഷനുകൾ",
    catEmployment: "തൊഴിൽ & വൈദഗ്ധ്യം",
    catWelfare: "ക്ഷേമ പദ്ധതികൾ",
    catComplaints: "പരാതി പരിഹാരം",
    catUtilities: "പൊതുസേവനങ്ങൾ",
    catLocalGov: "തദ്ദേശ സ്വയംഭരണം",
    
    // Eligibility
    eligible: "അർഹതപ്പെടാൻ സാധ്യതയുണ്ട്",
    needsInfo: "കൂടുതൽ വിവരങ്ങൾ ആവശ്യമാണ്",
    notEligible: "നിലവിൽ അർഹതയില്ല",
    disclaimerNotice: "ഡെമോ പ്രോട്ടോടൈപ്പ് പരിശോധന — ഔദ്യോഗിക വകുപ്പുമായി ഉറപ്പ് വരുത്തുക.",
    
    // App Steps
    step1Personal: "1. വ്യക്തിഗത വിവരങ്ങൾ",
    step2Eligibility: "2. അർഹത",
    step3Documents: "3. രേഖകൾ",
    step4Form: "4. അപേക്ഷ ഫോം",
    step5Review: "5. പുനഃപരിശോധന",
    step6Submit: "6. സമർപ്പിക്കുക",
    step7Tracking: "7. ട്രാക്കിംഗ്",
    
    // Actions
    submitApp: "അപേക്ഷ സമർപ്പിക്കുക",
    reviewApp: "അപേക്ഷ പരിശോധിക്കുക",
    trackStatus: "സ്റ്റാറ്റസ് അറിയുക",
    viewDetails: "വിശദാംശങ്ങൾ കാണുക",
    uploadDoc: "രേഖ അപ്‌ലോഡ് ചെയ്യുക",
    missingDoc: "ലഭ്യമല്ല",
    uploadedDoc: "അപ്‌ലോഡ് ചെയ്തു",
    optionalDoc: "ഓപ്ഷണൽ",
    
    // Dashboard
    greeting: "നമസ്കാരം 👋",
    dashboardSub: "നിങ്ങളുടെ പൊതുസേവന പോർട്ടലിലേക്ക് സ്വാഗതം",
    activeApps: "സജീവ അപേക്ഷകൾ",
    recentComplaints: "സമീപകാല പരാതികൾ",
    pendingDocs: "പെൻഡിംഗ് രേഖകൾ",
    notifications: "അറിയിപ്പുകൾ",
    agentToolsLog: "AI ഏജന്റ് ടൂൾ ലോഗ്",
    
    // Language
    selectLang: "Language / ഭാഷ",
  },
  hi: {
    appName: "सेवाAI (SewaAI)",
    appTagline: "आपका सरकारी सेवा सहायक",
    heroTitle: "सेवाAI — आपका सरकारी सेवा सहायक",
    heroSubtitle: "समझें। जांचें। आवेदन करें। ट्रैक करें।",
    heroDescription: "एक AI एजेंट जो नागरिकों की जरूरतों को समझकर, पात्रता जांचकर, आवेदन में मदद करके और प्रगति को ट्रैक करके सरकारी सेवाओं तक पहुंचने में मदद करता है।",
    talkToSewaAI: "सेवाAI से बात करें",
    exploreServices: "सेवाएं देखें",
    navServices: "सेवा निर्देशिका",
    navApplications: "मेरे आवेदन",
    navComplaints: "शिकायतें",
    navOffices: "सरकारी कार्यालय",
    navDashboard: "नागरिक डैशबोर्ड",
    navAdmin: "एडमिन डेमो",
    
    // Identity
    agentName: "सेवाAI",
    agentRole: "सरकारी सेवा सहायक",
    agentStatus: "ऑनलाइन उपलब्ध",
    
    // Quick Action Buttons
    quickCheckEligibility: "पात्रता जांचें",
    quickFindService: "सेवा खोजें",
    quickApplyService: "आवेदन करें",
    quickTrackApplication: "आवेदन ट्रैक करें",
    quickRequiredDocs: "आवश्यक दस्तावेज",
    quickFindOffice: "कार्यालय खोजें",
    
    // Categories
    catEducation: "शिक्षा",
    catHealthcare: "स्वास्थ्य",
    catScholarships: "छात्रवृत्ति",
    catCertificates: "प्रमाणपत्र",
    catPensions: "पेंशन और कल्याण",
    catEmployment: "रोजगार और कौशल",
    catWelfare: "नागरिक कल्याण",
    catComplaints: "जन शिकायतें",
    catUtilities: "सार्वजनिक सुविधाएं",
    catLocalGov: "स्थानीय निकाय",
    
    // Eligibility
    eligible: "संभावित रूप से पात्र",
    needsInfo: "अधिक जानकारी की आवश्यकता है",
    notEligible: "वर्तमान में पात्र नहीं",
    disclaimerNotice: "प्रारूप मूल्यांकन — संबंधित विभाग से पुष्टि करें।",
    
    // App Steps
    step1Personal: "1. व्यक्तिगत विवरण",
    step2Eligibility: "2. पात्रता",
    step3Documents: "3. दस्तावेज",
    step4Form: "4. आवेदन पत्र",
    step5Review: "5. समीक्षा",
    step6Submit: "6. जमा करें",
    step7Tracking: "7. ट्रैकिंग",
    
    // Actions
    submitApp: "आवेदन जमा करें",
    reviewApp: "आवेदन की समीक्षा करें",
    trackStatus: "स्थिति देखें",
    viewDetails: "विवरण देखें",
    uploadDoc: "दस्तावेज अपलोड करें",
    missingDoc: "अनुपलब्ध",
    uploadedDoc: "अपलोड किया गया",
    optionalDoc: "वैकल्पिक",
    
    // Dashboard
    greeting: "नमस्ते 👋",
    dashboardSub: "आपके सार्वजनिक सेवा पोर्टल में आपका स्वागत है",
    activeApps: "सक्रिय आवेदन",
    recentComplaints: "हाल की शिकायतें",
    pendingDocs: "बकाया दस्तावेज",
    notifications: "सूचनाएं",
    agentToolsLog: "AI एजेंट टूल लॉग",
    
    // Language
    selectLang: "Language / भाषा",
  }
};
