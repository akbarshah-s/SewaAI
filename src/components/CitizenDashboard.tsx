import React from 'react';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Bell, 
  Bot, 
  ArrowRight, 
  User, 
  Sparkles,
  FileCheck
} from 'lucide-react';
import { getRuntimeApplications, getRuntimeComplaints } from '../services/agentTools';
import { mockNotifications } from '../data/mockData';
import { Language } from '../types/sewa';
import { translations } from '../utils/translations';

interface CitizenDashboardProps {
  currentLanguage: Language;
  onNavigateToTab: (tab: string, refId?: string) => void;
  onOpenChat: () => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  currentLanguage,
  onNavigateToTab,
  onOpenChat,
}) => {
  const t = translations[currentLanguage];
  const applications = getRuntimeApplications();
  const complaints = getRuntimeComplaints();

  const activeAppsCount = applications.filter(a => a.currentStatus !== 'Completed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-gov-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-xs font-semibold border border-teal-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Citizen Public Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">{t.greeting}, Ananya Ramesh 👋</h1>
          <p className="text-sm text-slate-300">
            You currently have <strong className="text-teal-400">{activeAppsCount} applications</strong> being processed by government departments.
          </p>
        </div>

        <button
          onClick={onOpenChat}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-gov-600 hover:from-teal-400 hover:to-gov-500 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transform hover:-translate-y-0.5 transition-all"
        >
          <Bot className="w-5 h-5" />
          <span>Talk to SewaAI Assistant</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">{t.activeApps}</span>
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white">{applications.length}</span>
            <span className="text-xs text-slate-400 block mt-0.5">{activeAppsCount} under review</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">{t.recentComplaints}</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white">{complaints.length}</span>
            <span className="text-xs text-slate-400 block mt-0.5">PWD / Municipal Tickets</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">{t.pendingDocs}</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white">4 / 5</span>
            <span className="text-xs text-emerald-400 block mt-0.5">Documents Verified</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Alert Notifications</span>
            <div className="w-9 h-9 rounded-xl bg-gov-500/10 border border-gov-500/30 flex items-center justify-center">
              <Bell className="w-5 h-5 text-gov-400" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white">{mockNotifications.length}</span>
            <span className="text-xs text-slate-400 block mt-0.5">Recent Updates</span>
          </div>
        </div>

      </div>

      {/* Grid: Active Applications + Notification Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Active Applications Section */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-white">Active Applications</h2>
            <button
              onClick={() => onNavigateToTab('applications')}
              className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1"
            >
              <span>View All Timeline Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.referenceId} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-teal-300">{app.referenceId}</span>
                  <span className={`px-2.5 py-1 rounded text-xs font-extrabold ${
                    app.currentStatus === 'Completed' || app.currentStatus === 'Approved'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  }`}>
                    {app.currentStatus}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">{app.serviceName}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{app.department} • Submitted: {app.submittedAt}</p>
                </div>

                {/* Progress bar visual */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>Progress Stage</span>
                    <span className="text-teal-400 font-bold">
                      {app.currentStatus === 'Completed' ? '100%' : app.currentStatus === 'Approved' ? '80%' : '50%'}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-gov-500 transition-all duration-500"
                      style={{
                        width: app.currentStatus === 'Completed' ? '100%' : app.currentStatus === 'Approved' ? '80%' : '50%'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Notification Feed */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-xl font-extrabold text-white">Live Notification Feed</h2>
          
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 bg-slate-900/80 space-y-3">
            {mockNotifications.map(n => (
              <div key={n.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{n.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{n.timestamp}</span>
                </div>
                <p className="text-xs text-slate-400 leading-snug">{n.message}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
