import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  GraduationCap, 
  HeartHandshake, 
  FileText, 
  Briefcase, 
  Cross, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Building2, 
  X,
  ExternalLink,
  Bot
} from 'lucide-react';
import { GovService, GovServiceCategory, Language } from '../types/sewa';
import { mockGovServices } from '../data/mockData';
import { translations } from '../utils/translations';

interface ServicesDirectoryProps {
  currentLanguage: Language;
  onApplyWithAgent: (serviceId: string) => void;
}

export const ServicesDirectory: React.FC<ServicesDirectoryProps> = ({
  currentLanguage,
  onApplyWithAgent,
}) => {
  const t = translations[currentLanguage];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalService, setActiveModalService] = useState<GovService | null>(null);

  const categories: { id: string; label: string; icon: any }[] = [
    { id: 'all', label: 'All Services', icon: Building2 },
    { id: 'scholarships', label: t.catScholarships, icon: GraduationCap },
    { id: 'pensions', label: t.catPensions, icon: HeartHandshake },
    { id: 'certificates', label: t.catCertificates, icon: FileText },
    { id: 'healthcare', label: t.catHealthcare, icon: Cross },
    { id: 'employment', label: t.catEmployment, icon: Briefcase },
    { id: 'complaints', label: t.catComplaints, icon: AlertTriangle },
  ];

  const filteredServices = mockGovServices.filter((service) => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesQuery = 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.nameMl && service.nameMl.includes(searchQuery)) ||
      (service.nameHi && service.nameHi.includes(searchQuery)) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Government Services Directory</h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse official schemes, eligibility rules, and required documents. Let SewaAI handle your submission automatically.
          </p>
        </div>
      </div>

      {/* Search Bar & Category Chips */}
      <div className="space-y-4">
        <div className="relative max-w-2xl">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by service name, department, or keyword (e.g. scholarship, pension, income)..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500/60 shadow-lg"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="glass-card glass-card-hover rounded-2xl p-6 border border-slate-800 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-400 px-2.5 py-1 rounded bg-teal-500/10 border border-teal-500/20">
                  {service.category}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {service.processingTime}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white leading-snug">
                {currentLanguage === 'ml' && service.nameMl ? service.nameMl : (currentLanguage === 'hi' && service.nameHi ? service.nameHi : service.name)}
              </h3>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {currentLanguage === 'ml' && service.descriptionMl ? service.descriptionMl : (currentLanguage === 'hi' && service.descriptionHi ? service.descriptionHi : service.description)}
              </p>

              <div className="pt-2 text-xs text-slate-300 space-y-1.5 border-t border-slate-800/80">
                <p><strong>Department:</strong> <span className="text-slate-400">{service.department}</span></p>
                <p><strong>Target Audience:</strong> <span className="text-slate-400">{service.targetAudience}</span></p>
              </div>
            </div>

            <div className="pt-6 flex items-center gap-2">
              <button
                onClick={() => setActiveModalService(service)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all text-center"
              >
                View Details
              </button>

              <button
                onClick={() => onApplyWithAgent(service.id)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-gov-600 hover:from-teal-400 hover:to-gov-500 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Bot className="w-4 h-4" />
                <span>Apply with SewaAI</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detail View */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-2xl p-6 sm:p-8 max-w-2xl w-full border border-slate-800 bg-slate-900 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  {activeModalService.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                  {activeModalService.name}
                </h2>
              </div>
              <button
                onClick={() => setActiveModalService(null)}
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              <p className="text-slate-300 leading-relaxed">
                {activeModalService.description}
              </p>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <p><strong>Department:</strong> {activeModalService.department}</p>
                <p><strong>Target Audience:</strong> {activeModalService.targetAudience}</p>
                <p><strong>Processing Time:</strong> {activeModalService.processingTime}</p>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm mb-2">Required Documents Checklist</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeModalService.requiredDocuments.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 p-2 rounded bg-slate-800/60 border border-slate-700/50">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3 border-t border-slate-800">
              <button
                onClick={() => setActiveModalService(null)}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const sId = activeModalService.id;
                  setActiveModalService(null);
                  onApplyWithAgent(sId);
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-gov-600 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2"
              >
                <Bot className="w-4 h-4" />
                <span>Start Agent Guided Application</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
