import { mockGovServices, mockGovOffices, mockInitialApplications, mockInitialComplaints } from '../data/mockData';
import { GovService, EligibilityAssessment, UserProfileData, ApplicationRecord, ComplaintRecord, GovOffice, AgentToolCall } from '../types/sewa';

// Store in-memory runtime records (allows dynamically adding applications during session)
let runtimeApplications: ApplicationRecord[] = [...mockInitialApplications];
let runtimeComplaints: ComplaintRecord[] = [...mockInitialComplaints];
let runtimeToolCalls: AgentToolCall[] = [];

export function getRuntimeApplications(): ApplicationRecord[] {
  return runtimeApplications;
}

export function getRuntimeComplaints(): ComplaintRecord[] {
  return runtimeComplaints;
}

export function getRuntimeToolCalls(): AgentToolCall[] {
  return runtimeToolCalls;
}

export function recordToolCall(toolCall: AgentToolCall) {
  runtimeToolCalls.unshift(toolCall);
  if (runtimeToolCalls.length > 50) {
    runtimeToolCalls = runtimeToolCalls.slice(0, 50);
  }
}

/**
 * Tool 1: findService
 */
export function toolFindService(query?: string, category?: string): GovService[] {
  let results = [...mockGovServices];
  
  if (category) {
    results = results.filter(s => s.category === category || category === 'all');
  }
  
  if (query && query.trim() !== '') {
    const q = query.toLowerCase();
    results = results.filter(s => 
      s.name.toLowerCase().includes(q) || 
      (s.nameMl && s.nameMl.includes(q)) || 
      (s.nameHi && s.nameHi.includes(q)) || 
      s.description.toLowerCase().includes(q) ||
      s.targetAudience.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q)
    );
  }
  
  return results;
}

/**
 * Tool 2: checkEligibility
 */
export function toolCheckEligibility(serviceId: string, userProfile: Partial<UserProfileData>): EligibilityAssessment {
  const service = mockGovServices.find(s => s.id === serviceId) || mockGovServices[0];
  const crit = service.eligibilityCriteria;
  const reasons: string[] = [];
  const reasonsMl: string[] = [];
  const reasonsHi: string[] = [];
  const missingFields: string[] = [];
  
  let score = 100;
  let status: 'eligible' | 'needs_info' | 'not_eligible' = 'eligible';

  // 1. Income Check
  if (crit.maxIncome !== undefined) {
    if (userProfile.annualIncome === undefined) {
      missingFields.push('Annual Family Income');
      status = 'needs_info';
      reasons.push(`Annual income requirement is below ₹${crit.maxIncome.toLocaleString('en-IN')}/year. Please specify your family income.`);
      reasonsMl.push(`കുടുംബ വാർഷിക വരുമാനം ₹${crit.maxIncome.toLocaleString('en-IN')}-ൽ താഴെയായിരിക്കണം.`);
      reasonsHi.push(`वार्षिक पारिवारिक आय ₹${crit.maxIncome.toLocaleString('en-IN')} से कम होनी चाहिए।`);
    } else if (userProfile.annualIncome > crit.maxIncome) {
      status = 'not_eligible';
      score -= 50;
      reasons.push(`Your family income (₹${userProfile.annualIncome.toLocaleString('en-IN')}) exceeds the ceiling of ₹${crit.maxIncome.toLocaleString('en-IN')}.`);
      reasonsMl.push(`വാർഷിക വരുമാനം നിർദ്ദിഷ്ട പരിധിയേക്കാൾ കൂടുതലാണ്.`);
      reasonsHi.push(`आपकी पारिवारिक आय निर्धारित सीमा से अधिक है।`);
    } else {
      reasons.push(`✓ Annual income ₹${userProfile.annualIncome.toLocaleString('en-IN')} is within the eligible limit of ₹${crit.maxIncome.toLocaleString('en-IN')}.`);
      reasonsMl.push(`✓ വാർഷിക വരുമാനം നിർദ്ദിഷ്ട പരിധിക്കുള്ളിലാണ്.`);
      reasonsHi.push(`✓ वार्षिक आय निर्धारित सीमा के भीतर है।`);
    }
  }

  // 2. Student Status Check
  if (crit.studentOnly) {
    if (userProfile.isStudent === undefined) {
      missingFields.push('Student Status & Course');
      if (status !== 'not_eligible') status = 'needs_info';
      reasons.push(`This service requires active student status.`);
      reasonsMl.push(`ഈ സേവനത്തിന് നിലവിൽ പഠിക്കുന്ന വിദ്യാർത്ഥിയായിരിക്കണം.`);
      reasonsHi.push(`यह सेवा वर्तमान में अध्ययनरत छात्रों के लिए है।`);
    } else if (!userProfile.isStudent) {
      status = 'not_eligible';
      score -= 50;
      reasons.push(`Service is reserved strictly for active students.`);
      reasonsMl.push(`വിദ്യാർത്ഥികൾക്ക് മാത്രമുള്ള പദ്ധതിയാണിത്.`);
      reasonsHi.push(`यह सेवा केवल छात्रों के लिए आरक्षित है।`);
    } else {
      reasons.push(`✓ Verified as an active student.`);
      reasonsMl.push(`✓ നിലവിലെ വിദ്യാർത്ഥിയാണെന്ന് സ്ഥിരീകരിച്ചു.`);
      reasonsHi.push(`✓ सक्रिय छात्र के रूप में सत्यापित।`);
    }
  }

  // 3. Age Check
  if (crit.minAge !== undefined) {
    if (userProfile.age === undefined) {
      missingFields.push('Age / Date of Birth');
      if (status !== 'not_eligible') status = 'needs_info';
      reasons.push(`Minimum age required is ${crit.minAge} years.`);
      reasonsMl.push(`കുറഞ്ഞ പ്രായം ${crit.minAge} വയസ്സ് ആയിരിക്കണം.`);
      reasonsHi.push(`न्यूनतम आयु ${crit.minAge} वर्ष होनी चाहिए।`);
    } else if (userProfile.age < crit.minAge) {
      status = 'not_eligible';
      score -= 50;
      reasons.push(`Your age (${userProfile.age}) is below the required minimum of ${crit.minAge} years.`);
      reasonsMl.push(`നിങ്ങളുടെ പ്രായം ആവശ്യമുള്ള കുറഞ്ഞ പ്രായത്തേക്കാൾ കുറവാണ്.`);
      reasonsHi.push(`आपकी आयु आवश्यक न्यूनतम आयु से कम है।`);
    } else {
      reasons.push(`✓ Age (${userProfile.age} yrs) satisfies minimum criteria of ${crit.minAge} yrs.`);
      reasonsMl.push(`✓ പ്രായം അർഹതാ മാനദണ്ഡത്തിന് അനുയോജ്യമാണ്.`);
      reasonsHi.push(`✓ आयु मानदंड को पूरा करती है।`);
    }
  }

  // 4. Category Check
  if (crit.allowedCategories && crit.allowedCategories.length > 0) {
    if (userProfile.category) {
      if (crit.allowedCategories.includes(userProfile.category) || crit.allowedCategories.includes('General')) {
        reasons.push(`✓ Socio-economic Category (${userProfile.category}) is eligible.`);
        reasonsMl.push(`✓ വിഭാഗം (${userProfile.category}) അർഹമാണ്.`);
        reasonsHi.push(`✓ वर्ग (${userProfile.category}) पात्र है।`);
      } else {
        status = 'not_eligible';
        reasons.push(`Category (${userProfile.category}) is not listed under eligible groups (${crit.allowedCategories.join(', ')}).`);
        reasonsMl.push(`നിങ്ങളുടെ വിഭാഗം ഈ പദ്ധതിക്ക് കീഴിൽ അർഹമല്ല.`);
        reasonsHi.push(`आपका वर्ग इस योजना के लिए पात्र नहीं है।`);
      }
    }
  }

  if (status === 'eligible' && reasons.length === 0) {
    reasons.push(`✓ Meets general eligibility guidelines.`);
    reasonsMl.push(`✓ പൊതുവായ അർഹതാ മാനദണ്ഡങ്ങൾ പാലിക്കുന്നു.`);
    reasonsHi.push(`✓ सामान्य पात्रता मानदंडों को पूरा करता है।`);
  }

  return {
    serviceId: service.id,
    serviceName: service.name,
    status,
    confidenceScore: status === 'eligible' ? 95 : (status === 'needs_info' ? 60 : 10),
    reasons,
    reasonsMl,
    reasonsHi,
    missingInfoFields: missingFields,
    requiredDocs: service.requiredDocuments,
    assessedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isDemoNotice: 'Prototype eligibility assessment — verify with official department.'
  };
}

/**
 * Tool 3: getRequiredDocuments
 */
export function toolGetRequiredDocuments(serviceId: string): string[] {
  const service = mockGovServices.find(s => s.id === serviceId);
  return service ? service.requiredDocuments : ['Aadhaar Card', 'Income Certificate', 'Bank Passbook'];
}

/**
 * Tool 4: generateApplication
 */
export function toolGenerateApplication(serviceId: string, userProfile: UserProfileData): Partial<ApplicationRecord> {
  const service = mockGovServices.find(s => s.id === serviceId) || mockGovServices[0];
  
  return {
    serviceId: service.id,
    serviceName: service.name,
    category: service.category,
    department: service.department,
    applicant: userProfile,
    submittedAt: new Date().toLocaleString(),
    currentStatus: 'Created',
    timeline: [
      {
        status: 'Created',
        timestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
        note: 'Draft Application created via SewaAI Assistant',
        completed: true
      }
    ],
    documentsAttached: Object.keys(userProfile.uploadedDocs).filter(k => userProfile.uploadedDocs[k]),
    estimatedCompletion: '15 - 30 Working Days'
  };
}

/**
 * Tool 5: submitApplication
 */
export function toolSubmitApplication(draftApp: Partial<ApplicationRecord>): ApplicationRecord {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const refId = `SWA-2026-${randomNum}`;
  const now = new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  
  const fullRecord: ApplicationRecord = {
    referenceId: refId,
    serviceId: draftApp.serviceId || 'scholarship-postmatric',
    serviceName: draftApp.serviceName || 'Government Service Application',
    category: draftApp.category || 'scholarships',
    department: draftApp.department || 'Government Department',
    applicant: draftApp.applicant || {
      fullName: 'Citizen Applicant',
      state: 'Kerala',
      uploadedDocs: {}
    },
    submittedAt: now,
    currentStatus: 'Created',
    timeline: [
      { status: 'Created', timestamp: now, note: 'Application submitted via SewaAI Agent', completed: true },
      { status: 'Documents Submitted', timestamp: now, note: 'E-Verification of uploaded documents completed', completed: true },
      { status: 'Under Review', timestamp: 'In Progress', note: 'Queued for Department Verification', completed: false },
      { status: 'Department Verification', timestamp: 'Pending', note: 'Awaiting desk officer review', completed: false },
      { status: 'Approved', timestamp: 'Pending', note: 'Final Approval', completed: false },
      { status: 'Completed', timestamp: 'Pending', note: 'Service / Benefit Disbursement', completed: false }
    ],
    documentsAttached: draftApp.documentsAttached || ['Aadhaar_Proof.pdf'],
    estimatedCompletion: '15 - 20 Working Days',
    notes: 'Submitted via SewaAI Hackathon AI Agent'
  };

  runtimeApplications.unshift(fullRecord);
  return fullRecord;
}

/**
 * Tool 6: submitComplaint
 */
export function toolSubmitComplaint(category: string, location: string, description: string, contactName: string, contactPhone: string, district = 'Ernakulam'): ComplaintRecord {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const cmpId = `CMP-2026-${randomNum}`;
  const now = new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

  const record: ComplaintRecord = {
    complaintId: cmpId,
    category,
    location,
    district,
    description,
    submittedAt: now,
    contactName,
    contactPhone,
    status: 'Complaint Registered',
    assignedOfficer: 'District Nodal Officer / PWD Engineer',
    timeline: [
      { status: 'Complaint Registered', timestamp: now, note: 'Grievance registered via SewaAI Agent' },
      { status: 'Assigned', timestamp: 'In Progress', note: 'Assigned to Ward Nodal Officer' },
      { status: 'Under Investigation', timestamp: 'Pending', note: 'Site inspection & work order' },
      { status: 'Resolved', timestamp: 'Pending', note: 'Resolution completion report' }
    ]
  };

  runtimeComplaints.unshift(record);
  return record;
}

/**
 * Tool 7: trackApplication
 */
export function toolTrackApplication(referenceId: string): { found: boolean; record?: ApplicationRecord; complaintRecord?: ComplaintRecord } {
  const cleanId = referenceId.trim().toUpperCase();
  
  if (cleanId.startsWith('CMP')) {
    const complaint = runtimeComplaints.find(c => c.complaintId.toUpperCase() === cleanId);
    if (complaint) return { found: true, complaintRecord: complaint };
  }
  
  const app = runtimeApplications.find(a => a.referenceId.toUpperCase() === cleanId);
  if (app) return { found: true, record: app };

  // Fallback match by partial number or name
  const partial = runtimeApplications.find(a => a.referenceId.includes(cleanId) || a.applicant.fullName.toUpperCase().includes(cleanId));
  if (partial) return { found: true, record: partial };

  return { found: false };
}

/**
 * Tool 8: findGovernmentOffice
 */
export function toolFindGovernmentOffice(department?: string, district?: string): GovOffice[] {
  let results = [...mockGovOffices];
  if (district) {
    results = results.filter(o => o.district.toLowerCase() === district.toLowerCase());
  }
  if (department) {
    results = results.filter(o => o.department.toLowerCase().includes(department.toLowerCase()) || o.servicesProvided.some(s => s.toLowerCase().includes(department.toLowerCase())));
  }
  return results.length > 0 ? results : mockGovOffices;
}
