import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  ArrowRight, 
  ShieldAlert, 
  UserCheck, 
  Building2, 
  Bot 
} from 'lucide-react';
import { mockGovServices } from '../data/mockData';
import { toolCheckEligibility } from '../services/agentTools';
import { EligibilityAssessment, Language } from '../types/sewa';
import { translations } from '../utils/translations';

interface EligibilityCheckerProps {
  currentLanguage: Language;
  onApplyWithAgent: (serviceId: string) => void;
}

export const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({
  currentLanguage,
  onApplyWithAgent,
}) => {
  const t = translations[currentLanguage];
  const [selectedServiceId, setSelectedServiceId] = useState(mockGovServices[0].id);

  // Form Inputs
  const [age, setAge] = useState(20);
  const [isStudent, setIsStudent] = useState(true);
  const [annualIncome, setAnnualIncome] = useState(180000);
  const [category, setCategory] = useState<'General' | 'OBC' | 'SC' | 'ST' | 'EWS'>('OBC');
  const [assessment, setAssessment] = useState<EligibilityAssessment | null>(null);

  const handleEvaluate = () => {
    const result = toolCheckEligibility(selectedServiceId, {
      age,
      isStudent,
      annualIncome,
      category,
      state: 'Kerala'
    });
    setAssessment(result);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Rule-Based AI Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white mt-1">Check Government Service Eligibility</h1>
        <p className="text-sm text-slate-400 mt-1">
          Select a government scheme and input your socio-economic criteria to test eligibility instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Input Form */}
        <div className="md:col-span-6 glass-panel rounded-2xl p-6 border border-slate-800 bg-slate-900/90 space-y-5">
          
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Select Government Scheme</label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
            >
              {mockGovServices.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.department})</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-300 uppercase">Age (Years)</label>
              <span className="text-xs font-mono font-bold text-teal-400">{age} years</span>
            </div>
            <input
              type="range"
              min="15"
              max="90"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full accent-teal-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-300 uppercase">Annual Family Income (₹)</label>
              <span className="text-xs font-mono font-bold text-teal-400">₹{annualIncome.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="20000"
              max="1000000"
              step="10000"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(Number(e.target.value))}
              className="w-full accent-teal-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Socio-Economic Category</label>
            <div className="grid grid-cols-3 gap-2">
              {(['General', 'OBC', 'SC', 'ST', 'EWS'] as const).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    category === cat
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="studentCheck"
              checked={isStudent}
              onChange={(e) => setIsStudent(e.target.checked)}
              className="w-4 h-4 rounded accent-teal-500"
            />
            <label htmlFor="studentCheck" className="text-xs text-slate-300 font-medium">
              Currently enrolled as an active student
            </label>
          </div>

          <button
            onClick={handleEvaluate}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-gov-600 hover:from-teal-400 hover:to-gov-500 text-white font-extrabold text-sm shadow-lg flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Run Eligibility Engine</span>
          </button>
        </div>

        {/* Results Panel */}
        <div className="md:col-span-6 space-y-4">
          {!assessment ? (
            <div className="glass-panel rounded-2xl p-8 border border-slate-800 bg-slate-900/50 text-center flex flex-col items-center justify-center min-h-[360px]">
              <UserCheck className="w-12 h-12 text-slate-600 mb-3" />
              <p className="text-sm font-semibold text-slate-300">Run the assessment to view status report</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                SewaAI checks official income limits, age rules, and socio-economic category criteria.
              </p>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 bg-slate-900/90 space-y-4 shadow-xl">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase">Assessment Result</span>
                <span className="text-[10px] text-slate-500 font-mono">Timestamp: {assessment.assessedAt}</span>
              </div>

              {/* Status Badge */}
              <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                assessment.status === 'eligible'
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                  : assessment.status === 'needs_info'
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                  : 'bg-rose-500/10 border-rose-500/40 text-rose-400'
              }`}>
                {assessment.status === 'eligible' && <CheckCircle2 className="w-6 h-6 shrink-0" />}
                {assessment.status === 'needs_info' && <AlertTriangle className="w-6 h-6 shrink-0" />}
                {assessment.status === 'not_eligible' && <XCircle className="w-6 h-6 shrink-0" />}
                
                <div>
                  <span className="text-base font-extrabold block">
                    {assessment.status === 'eligible' ? t.eligible : (assessment.status === 'needs_info' ? t.needsInfo : t.notEligible)}
                  </span>
                  <span className="text-xs opacity-90">
                    Confidence Score: {assessment.confidenceScore}%
                  </span>
                </div>
              </div>

              {/* Reasons */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-300">Criteria Evaluation Breakdown</h4>
                <div className="space-y-1.5 text-xs text-slate-300">
                  {assessment.reasons.map((reason, idx) => (
                    <div key={idx} className="p-2 rounded bg-slate-950/80 border border-slate-800">
                      {reason}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              {assessment.status === 'eligible' && (
                <button
                  onClick={() => onApplyWithAgent(assessment.serviceId)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-gov-600 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  <Bot className="w-4 h-4" />
                  <span>Proceed to Guided Application</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {/* Mandatory Disclaimer */}
              <p className="text-[10px] text-amber-400/90 italic text-center pt-2">
                ⚠️ {assessment.isDemoNotice}
              </p>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
