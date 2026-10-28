export type Language = 'en' | 'ml' | 'hi';

export type GovServiceCategory = 
  | 'education' 
  | 'healthcare' 
  | 'scholarships' 
  | 'certificates' 
  | 'pensions' 
  | 'employment' 
  | 'welfare' 
  | 'complaints' 
  | 'utilities' 
  | 'local_gov';

export interface GovService {
  id: string;
  name: string;
  nameMl?: string;
  nameHi?: string;
  category: GovServiceCategory;
  department: string;
  description: string;
  descriptionMl?: string;
  descriptionHi?: string;
  targetAudience: string;
  eligibilityCriteria: {
    maxIncome?: number;
    minAge?: number;
    maxAge?: number;
    studentOnly?: boolean;
    courseRequirement?: string[];
    allowedCategories?: string[];
    residenceState?: string[];
    otherConditions?: string[];
  };
  requiredDocuments: string[];
  processingTime: string;
  officialPortalUrl?: string;
  iconName: string;
  isPopular?: boolean;
}

export type EligibilityStatus = 'eligible' | 'needs_info' | 'not_eligible';

export interface EligibilityAssessment {
  serviceId: string;
  serviceName: string;
  status: EligibilityStatus;
  confidenceScore: number;
  reasons: string[];
  reasonsMl?: string[];
  reasonsHi?: string[];
  missingInfoFields?: string[];
  requiredDocs: string[];
  assessedAt: string;
  isDemoNotice: string;
}

export type ApplicationStatus = 
  | 'Created' 
  | 'Documents Submitted' 
  | 'Under Review' 
  | 'Department Verification' 
  | 'Approved' 
  | 'Completed' 
  | 'Rejected';

export interface StatusTimelineEvent {
  status: ApplicationStatus;
  timestamp: string;
  note: string;
  completed: boolean;
}

export interface UserProfileData {
  fullName: string;
  age?: number;
  gender?: string;
  state: string;
  district?: string;
  pincode?: string;
  isStudent?: boolean;
  courseName?: string;
  institution?: string;
  annualIncome?: number;
  category?: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  disabilityStatus?: boolean;
  employmentStatus?: string;
  contactNumber?: string;
  email?: string;
  uploadedDocs: Record<string, boolean>; // docName -> isUploaded
}

export interface ApplicationRecord {
  referenceId: string; // e.g. SWA-2026-102431
  serviceId: string;
  serviceName: string;
  category: GovServiceCategory;
  department: string;
  applicant: UserProfileData;
  submittedAt: string;
  currentStatus: ApplicationStatus;
  timeline: StatusTimelineEvent[];
  documentsAttached: string[];
  estimatedCompletion: string;
  notes?: string;
}

export type ComplaintStatus = 'Complaint Registered' | 'Assigned' | 'Under Investigation' | 'Resolved';

export interface ComplaintRecord {
  complaintId: string; // e.g. CMP-2026-98124
  category: string; // Infrastructure, Water, Electricity, Sanitation
  location: string;
  district: string;
  description: string;
  submittedAt: string;
  contactName: string;
  contactPhone: string;
  status: ComplaintStatus;
  assignedOfficer?: string;
  timeline: { status: ComplaintStatus; timestamp: string; note: string }[];
  photoUrl?: string;
}

export interface GovOffice {
  id: string;
  name: string;
  nameMl?: string;
  department: string;
  district: string;
  address: string;
  contactNumber: string;
  email: string;
  workingHours: string;
  latitude: number;
  longitude: number;
  servicesProvided: string[];
}

export interface AgentToolCall {
  id: string;
  toolName: 
    | 'findService' 
    | 'checkEligibility' 
    | 'getRequiredDocuments' 
    | 'collectUserDetails' 
    | 'generateApplication' 
    | 'submitApplication' 
    | 'generateReferenceId' 
    | 'trackApplication' 
    | 'findGovernmentOffice' 
    | 'sendReminder'
    | 'submitComplaint';
  params: Record<string, any>;
  output: any;
  timestamp: string;
  status: 'executing' | 'completed' | 'failed';
}

export interface ChatWidgetData {
  type: 'service_suggestions' | 'eligibility_result' | 'document_checklist' | 'application_draft' | 'application_confirmation' | 'complaint_confirmation' | 'office_cards';
  payload: any;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'sewa_agent';
  text: string;
  timestamp: string;
  toolCallsExecuted?: AgentToolCall[];
  widget?: ChatWidgetData;
  language?: Language;
}

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'application_update' | 'document_reminder' | 'complaint_update' | 'general';
  referenceId?: string;
}

export interface AdminStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  activeComplaints: number;
  avgProcessingDays: number;
  toolCallCount: number;
}
