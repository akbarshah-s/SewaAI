import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Upload, 
  FileText, 
  User, 
  Award, 
  Copy, 
  Check, 
  ExternalLink,
  Bot
} from 'lucide-react';
import { mockGovServices } from '../data/mockData';
import { toolSubmitApplication } from '../services/agentTools';
import { ApplicationRecord, UserProfileData, Language } from '../types/sewa';
import { translations } from '../utils/translations';
import confetti from 'canvas-confetti';

interface ApplicationWizardProps {
  currentLanguage: Language;
  initialServiceId?: string;
  onNavigateToTracking: (refId: string) => void;
}

export const ApplicationWizard: React.FC<ApplicationWizardProps> = ({
  currentLanguage,
  initialServiceId,
  onNavigateToTracking,
}) => {
  const t = translations[currentLanguage];
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState(initialServiceId || mockGovServices[0].id);

  const [profile, setProfile] = useState<UserProfileData>({
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

  const [submittedRecord, setSubmittedRecord] = useState<ApplicationRecord | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedService = mockGovServices.find(s => s.id === selectedServiceId) || mockGovServices[0];

  const steps = [
    { num: 1, title: 'Personal Details' },
    { num: 2, title: 'Eligibility' },
    { num: 3, title: 'Documents' },
    { num: 4, title: 'Application Form' },
    { num: 5, title: 'Review' },
    { num: 6, title: 'Submit' },
    { num: 7, title: 'Tracking' }
  ];

  const handleSubmit = () => {
    const draftApp: Partial<ApplicationRecord> = {
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      category: selectedService.category,
      department: selectedService.department,
      applicant: profile,
      documentsAttached: Object.keys(profile.uploadedDocs).filter(k => profile.uploadedDocs[k])
    };

    const record = toolSubmitApplication(draftApp);
    setSubmittedRecord(record);
    setCurrentStep(7);

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">7-Step Application Stepper</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white mt-1">Multi-Step Service Application Assistant</h1>
        <p className="text-sm text-slate-400 mt-1">
          SewaAI populates and verifies your form step-by-step before generating an official reference ID.
        </p>
      </div>

      {/* Progress Bar / Stepper */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-800 bg-slate-900/90 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[600px]">
          {steps.map((step, idx) => (
            <React.Fragment key={step.num}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-xs transition-all ${
                    currentStep > step.num
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : currentStep === step.num
                      ? 'bg-teal-500 text-slate-950 ring-4 ring-teal-500/20 font-black shadow-lg scale-110'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {currentStep > step.num ? <CheckCircle2 className="w-5 h-5" /> : step.num}
                </div>
                <span className={`text-[11px] font-semibold whitespace-nowrap ${currentStep === step.num ? 'text-teal-300' : 'text-slate-400'}`}>
                  {step.title}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${currentStep > step.num ? 'bg-emerald-500' : 'bg-slate-800'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Container Content */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 bg-slate-900/90 space-y-6">
        
        {/* Step 1: Personal Details */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-extrabold text-white">Step 1: Personal & Service Selection</h2>
            
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Target Government Service</label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100"
              >
                {mockGovServices.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.department})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={profile.contactNumber}
                  onChange={(e) => setProfile({ ...profile, contactNumber: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Age</label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">State</label>
                <input
                  type="text"
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">District</label>
                <input
                  type="text"
                  value={profile.district}
                  onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Eligibility Check */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <h2 className="text-xl font-extrabold text-white">Step 2: Eligibility Verification</h2>
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Eligibility Engine Assessment: Potentially Eligible</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                SewaAI confirmed family income (₹{profile.annualIncome?.toLocaleString('en-IN')}) is within the allowable limit. Category ({profile.category}) matches department rules.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
              <p><strong>Selected Scheme:</strong> {selectedService.name}</p>
              <p><strong>Department:</strong> {selectedService.department}</p>
              <p><strong>Estimated Processing Time:</strong> {selectedService.processingTime}</p>
            </div>
          </div>
        )}

        {/* Step 3: Documents Upload Checklist */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <h2 className="text-xl font-extrabold text-white">Step 3: Required Documents Verification</h2>
            <p className="text-xs text-slate-400">
              Mark available demo documents to attach to your application.
            </p>

            <div className="space-y-3">
              {selectedService.requiredDocuments.map((doc, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                    <span className="text-sm font-semibold text-slate-200">{doc}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Uploaded (Demo)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Application Form */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <h2 className="text-xl font-extrabold text-white">Step 4: SewaAI Auto-Populated Application Form</h2>
            
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs text-slate-300">
              <div className="grid grid-cols-2 gap-2">
                <p><strong>Course / Stream:</strong> {profile.courseName}</p>
                <p><strong>Institution:</strong> {profile.institution}</p>
                <p><strong>Family Annual Income:</strong> ₹{profile.annualIncome?.toLocaleString('en-IN')}</p>
                <p><strong>Socio-Economic Category:</strong> {profile.category}</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {currentStep === 5 && (
          <div className="space-y-5">
            <h2 className="text-xl font-extrabold text-white">Step 5: Review Your Application</h2>
            
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
              <p><strong>Applicant Name:</strong> {profile.fullName}</p>
              <p><strong>Service:</strong> {selectedService.name}</p>
              <p><strong>Department:</strong> {selectedService.department}</p>
              <p><strong>District / State:</strong> {profile.district}, {profile.state}</p>
              <p><strong>Attached Documents:</strong> {selectedService.requiredDocuments.join(', ')}</p>
            </div>
          </div>
        )}

        {/* Step 6: Submit */}
        {currentStep === 6 && (
          <div className="space-y-5 text-center py-4">
            <h2 className="text-2xl font-extrabold text-white">Step 6: Ready for Simulated Department Submission</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              SewaAI will simulate direct API submission to the {selectedService.department} and issue your official Reference ID.
            </p>

            <button
              onClick={handleSubmit}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 via-teal-600 to-gov-600 text-white font-black text-base shadow-xl hover:shadow-teal-500/40 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              Submit Application to Department
            </button>
          </div>
        )}

        {/* Step 7: Confirmation & Reference ID */}
        {currentStep === 7 && submittedRecord && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-white">Application Submitted Successfully!</h2>
              <p className="text-xs text-slate-400 mt-1">Your file is now active in the government departmental queue.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-teal-500/40 max-w-md mx-auto space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase block">Application Reference ID</span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-mono font-extrabold text-teal-300">
                  {submittedRecord.referenceId}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(submittedRecord.referenceId);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => onNavigateToTracking(submittedRecord.referenceId)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-500 text-slate-950 font-extrabold text-xs shadow-lg flex items-center justify-center gap-2"
              >
                <span>Track Status Timeline</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Stepper Navigation Buttons */}
        {currentStep < 6 && (
          <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            <button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold disabled:opacity-40"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={() => setCurrentStep(prev => Math.min(6, prev + 1))}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs shadow-md hover:bg-teal-400"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
