import React from 'react';
import { 
  Sparkles, 
  MessageSquareCode, 
  Search, 
  CheckCircle2, 
  FileCheck, 
  ArrowRight, 
  ShieldAlert, 
  Building2, 
  GraduationCap, 
  HeartHandshake, 
  FileText, 
  AlertTriangle, 
  Bot, 
  Cpu, 
  Database, 
  Zap, 
  Send
} from 'lucide-react';
import { Language } from '../types/sewa';
import { translations } from '../utils/translations';

interface LandingPageProps {
  onOpenChat: () => void;
  onExploreServices: () => void;
  onTrackApp: () => void;
  currentLanguage: Language;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenChat,
  onExploreServices,
  onTrackApp,
  currentLanguage,
}) => {
  const t = translations[currentLanguage];

  return (
    <div className="space-y-16 pb-20">
      
      {/* Prototype / Hackathon Top Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-gov-950 border-b border-teal-500/30 px-4 py-2 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs text-teal-300 font-medium">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Agentic AI Hackathon Prototype:</strong> SewaAI demonstrates autonomous government service workflows. All API submissions and eligibility assessments are simulated for demo purposes.
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Glow background accent */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-gov-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="text-center space-y-6 relative z-10">
          
          {/* AI Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-teal-500/30 text-teal-300 text-xs font-semibold shadow-lg shadow-teal-500/10">
            <Sparkles className="w-4 h-4 text-teal-400 animate-spin" />
            <span>Autonomous Government Services Agentic Assistant</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            SewaAI
            <span className="block text-2xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-teal-300 via-teal-400 to-gov-400 bg-clip-text text-transparent mt-2">
              Your Government Services Assistant
            </span>
          </h1>

          {/* Slogan */}
          <div className="text-xl sm:text-2xl font-bold text-slate-200 tracking-wide">
            <span className="text-teal-400">Understand.</span>{' '}
            <span className="text-gov-300">Check.</span>{' '}
            <span className="text-emerald-400">Apply.</span>{' '}
            <span className="text-sky-300">Track.</span>
          </div>

          {/* Supporting Description */}
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            {t.heroDescription}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onOpenChat}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-extrabold text-base bg-gradient-to-r from-teal-500 via-teal-600 to-gov-600 hover:from-teal-400 hover:to-gov-500 text-white shadow-xl shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
            >
              <MessageSquareCode className="w-5 h-5" />
              <span>{t.talkToSewaAI}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onExploreServices}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white transition-all duration-300"
            >
              <Search className="w-5 h-5 text-teal-400" />
              <span>{t.exploreServices}</span>
            </button>
          </div>

          {/* Quick Prompts Pills */}
          <div className="pt-6 max-w-4xl mx-auto">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Try asking SewaAI:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              {[
                "I want to apply for a student scholarship",
                "Am I eligible for an old-age pension?",
                "I need an Income Certificate",
                "Report a broken streetlight",
                "Check status of SWA-2026-102431"
              ].map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={onOpenChat}
                  className="px-3.5 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-teal-300 transition-all text-left flex items-center gap-2"
                >
                  <Bot className="w-3.5 h-3.5 text-teal-400" />
                  <span>"{prompt}"</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Visual Agentic Architecture & Flowchart */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-2xl p-6 sm:p-10 border border-slate-800 bg-slate-900/80">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">
              Hackathon Agentic Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              How SewaAI Autonomous Workflows Operate
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Unlike static chatbots, SewaAI uses autonomous reasoning tool calls to handle end-to-end citizen service delivery.
            </p>
          </div>

          {/* Step flowchart */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              {
                step: '01',
                title: 'Goal Intent',
                desc: 'Understands citizen request in plain language or Malayalam/Hindi',
                icon: MessageSquareCode,
                color: 'from-blue-500 to-teal-500'
              },
              {
                step: '02',
                title: 'Eligibility Test',
                desc: 'Evaluates income, age, course & socio-economic rules',
                icon: Cpu,
                color: 'from-teal-500 to-emerald-500'
              },
              {
                step: '03',
                title: 'Doc Verification',
                desc: 'Checks Aadhaar, Income Cert & Bank passbook requirements',
                icon: FileCheck,
                color: 'from-emerald-500 to-cyan-500'
              },
              {
                step: '04',
                title: 'Dept Submission',
                desc: 'Generates ref ID SWA-2026-XXXXXX & submits application',
                icon: Send,
                color: 'from-cyan-500 to-sky-500'
              },
              {
                step: '05',
                title: 'Live Tracking',
                desc: 'Provides real-time departmental review updates & alerts',
                icon: Zap,
                color: 'from-sky-500 to-indigo-500'
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="glass-card rounded-xl p-5 border border-slate-800 relative group hover:border-teal-500/40 transition-all">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-tr ${item.color} p-0.5 mb-3`}>
                    <div className="w-full h-full bg-slate-900 rounded-[7px] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-teal-300" />
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold text-teal-400 tracking-wider">STEP {item.step}</span>
                  <h3 className="text-base font-bold text-white mt-1">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-snug">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Public Services Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white">Popular Government Services</h2>
            <p className="text-sm text-slate-400">Directly accessible via SewaAI assistant</p>
          </div>
          <button 
            onClick={onExploreServices}
            className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1.5"
          >
            <span>View All 10+ Services</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="glass-card glass-card-hover rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-teal-400" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 px-2 py-0.5 rounded bg-teal-500/10">
                Education & Scholarships
              </span>
              <h3 className="text-lg font-bold text-white mt-2">Post-Matric Scholarship Scheme</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Financial assistance for Class 11, 12, Diploma, UG, and PG students from eligible family income backgrounds.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Max Income: ₹2.5L / year</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Proc. Time: 15 - 30 Working Days</span>
                </div>
              </div>
            </div>
            <button
              onClick={onOpenChat}
              className="mt-6 w-full py-2.5 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/40 text-teal-300 text-xs font-bold transition-all text-center flex items-center justify-center gap-2"
            >
              <span>Apply with SewaAI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2 */}
          <div className="glass-card glass-card-hover rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gov-500/10 border border-gov-500/30 flex items-center justify-center mb-4">
                <HeartHandshake className="w-6 h-6 text-gov-400" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gov-400 px-2 py-0.5 rounded bg-gov-500/10">
                Pensions & Welfare
              </span>
              <h3 className="text-lg font-bold text-white mt-2">Indira Gandhi Old Age Pension</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Monthly social security pension for senior citizens aged 60 and above belonging to BPL households.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Min Age: 60 Years</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Direct Benefit Transfer to Bank</span>
                </div>
              </div>
            </div>
            <button
              onClick={onOpenChat}
              className="mt-6 w-full py-2.5 rounded-lg bg-gov-500/15 hover:bg-gov-500/25 border border-gov-500/40 text-gov-300 text-xs font-bold transition-all text-center flex items-center justify-center gap-2"
            >
              <span>Check Eligibility</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3 */}
          <div className="glass-card glass-card-hover rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">
                Certificates
              </span>
              <h3 className="text-lg font-bold text-white mt-2">Income & Assets Certificate</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Official Revenue Department certificate certifying annual family income from all sources.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Issued by Village Officer</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Fast Processing: 3 - 7 Days</span>
                </div>
              </div>
            </div>
            <button
              onClick={onOpenChat}
              className="mt-6 w-full py-2.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all text-center flex items-center justify-center gap-2"
            >
              <span>Request Certificate</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
