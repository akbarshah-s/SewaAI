import React, { useState } from 'react';
import { 
  FileCheck, 
  CheckCircle2, 
  Upload, 
  AlertCircle, 
  Eye, 
  Lock, 
  FileText, 
  Sparkles,
  Bot
} from 'lucide-react';
import { Language } from '../types/sewa';
import { translations } from '../utils/translations';

interface DocumentAssistantProps {
  currentLanguage: Language;
  onTalkToAgent: () => void;
}

export const DocumentAssistant: React.FC<DocumentAssistantProps> = ({
  currentLanguage,
  onTalkToAgent,
}) => {
  const t = translations[currentLanguage];

  const [docs, setDocs] = useState([
    { id: '1', name: 'Aadhaar Card / ID Proof', category: 'Identity Proof', status: 'uploaded', filename: 'Aadhaar_Ananya_KL.pdf', required: true },
    { id: '2', name: 'Income Certificate (Revenue Dept)', category: 'Income Proof', status: 'uploaded', filename: 'Income_Cert_2026_ERNAKULAM.pdf', required: true },
    { id: '3', name: 'College Student ID / Bonafide', category: 'Academic Proof', status: 'uploaded', filename: 'College_ID_Bonafide.jpg', required: true },
    { id: '4', name: 'Bank Passbook Copy (Aadhaar Seeded)', category: 'Bank Proof', status: 'uploaded', filename: 'Bank_Passbook_SBI.pdf', required: true },
    { id: '5', name: 'Community / Caste Certificate', category: 'Category Proof', status: 'missing', filename: '', required: false },
  ]);

  const toggleUpload = (id: string) => {
    setDocs(prev => prev.map(d => {
      if (d.id === id) {
        const isNowUploaded = d.status === 'missing';
        return {
          ...d,
          status: isNowUploaded ? 'uploaded' : 'missing',
          filename: isNowUploaded ? `${d.name.split(' ')[0]}_Demo_Doc.pdf` : ''
        };
      }
      return d;
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Document Management</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white mt-1">Citizen Document Assistant</h1>
        <p className="text-sm text-slate-400 mt-1">
          Keep required verified documents ready for automatic submission by SewaAI.
        </p>
      </div>

      {/* Safety Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-300">
        <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong>Privacy & Prototype Safety Notice:</strong> Do not upload real sensitive personal documents or financial records. Use mock/sample document files for testing this hackathon prototype.
        </div>
      </div>

      {/* Documents List */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 bg-slate-900/90 space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="text-xs font-bold text-slate-300 uppercase">Document Checklist ({docs.filter(d => d.status === 'uploaded').length}/{docs.length} Ready)</span>
          <button
            onClick={onTalkToAgent}
            className="flex items-center gap-1.5 text-xs font-bold text-teal-400 hover:text-teal-300"
          >
            <Bot className="w-4 h-4" />
            <span>Ask SewaAI for missing docs</span>
          </button>
        </div>

        <div className="space-y-3">
          {docs.map(doc => (
            <div
              key={doc.id}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <FileText className={`w-6 h-6 shrink-0 mt-0.5 ${doc.status === 'uploaded' ? 'text-teal-400' : 'text-slate-500'}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-100">{doc.name}</h3>
                    {doc.required ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">Required</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">Optional</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{doc.category} • {doc.filename || 'No document uploaded'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => toggleUpload(doc.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    doc.status === 'uploaded'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-teal-500 text-slate-950 hover:bg-teal-400'
                  }`}
                >
                  {doc.status === 'uploaded' ? '✓ Uploaded (Click to Toggle)' : 'Upload Mock File'}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
