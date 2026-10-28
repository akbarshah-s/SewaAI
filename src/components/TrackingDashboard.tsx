import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ShieldCheck, 
  AlertCircle, 
  Building2, 
  ExternalLink,
  Bot
} from 'lucide-react';
import { getRuntimeApplications, toolTrackApplication } from '../services/agentTools';
import { ApplicationRecord, Language } from '../types/sewa';
import { translations } from '../utils/translations';

interface TrackingDashboardProps {
  currentLanguage: Language;
  initialRefId?: string;
  onTalkToAgent: () => void;
}

export const TrackingDashboard: React.FC<TrackingDashboardProps> = ({
  currentLanguage,
  initialRefId,
  onTalkToAgent,
}) => {
  const t = translations[currentLanguage];
  const applications = getRuntimeApplications();

  const [searchRef, setSearchRef] = useState(initialRefId || 'SWA-2026-102431');
  const [selectedRecord, setSelectedRecord] = useState<ApplicationRecord>(
    applications.find(a => a.referenceId === (initialRefId || 'SWA-2026-102431')) || applications[0]
  );

  const handleSearch = () => {
    const res = toolTrackApplication(searchRef);
    if (res.found && res.record) {
      setSelectedRecord(res.record);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Live Status Tracker</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white mt-1">Application Status & Tracking</h1>
        <p className="text-sm text-slate-400 mt-1">
          Look up your reference ID (e.g. SWA-2026-102431) to view real-time department verification steps.
        </p>
      </div>

      {/* Lookup Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 bg-slate-900/90 max-w-xl">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchRef}
              onChange={(e) => setSearchRef(e.target.value)}
              placeholder="Enter Reference ID (e.g. SWA-2026-102431)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 uppercase font-mono font-bold"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm shadow-md transition-all"
          >
            Track
          </button>
        </div>
      </div>

      {/* Active Records List + Detail Timeline View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Records List */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase block mb-2">My Applications</span>
          {applications.map(app => (
            <div
              key={app.referenceId}
              onClick={() => { setSelectedRecord(app); setSearchRef(app.referenceId); }}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedRecord.referenceId === app.referenceId
                  ? 'bg-teal-500/15 border-teal-500/40 shadow-lg'
                  : 'bg-slate-900/70 border-slate-800 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-teal-300">{app.referenceId}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                  app.currentStatus === 'Completed' || app.currentStatus === 'Approved'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-teal-500/20 text-teal-300'
                }`}>
                  {app.currentStatus}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-2 leading-snug">{app.serviceName}</h4>
              <span className="text-[11px] text-slate-400 block mt-1">Submitted: {app.submittedAt}</span>
            </div>
          ))}
        </div>

        {/* Right Side: Timeline Visualizer */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 bg-slate-900/90 space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
            <div>
              <span className="text-xs font-mono font-bold text-teal-400 block">{selectedRecord.referenceId}</span>
              <h2 className="text-xl font-extrabold text-white mt-0.5">{selectedRecord.serviceName}</h2>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Department</span>
              <span className="text-xs font-bold text-slate-200">{selectedRecord.department}</span>
            </div>
          </div>

          {/* Status Timeline */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Official Status Timeline</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
              {selectedRecord.timeline.map((item, idx) => (
                <div key={idx} className="relative flex items-start gap-4 pl-8">
                  
                  {/* Status Circle Icon */}
                  <div className={`absolute left-0 top-0.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    item.completed
                      ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20 shadow-md'
                      : item.status === selectedRecord.currentStatus
                      ? 'bg-teal-500 text-slate-950 ring-4 ring-teal-500/20 animate-pulse'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}>
                    {item.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-bold ${item.completed ? 'text-slate-100' : 'text-slate-400'}`}>
                        {item.status}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono">({item.timestamp})</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-snug">{item.note}</p>
                  </div>

                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Have questions about this status?</span>
            <button
              onClick={onTalkToAgent}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 text-teal-300 font-bold text-xs"
            >
              <Bot className="w-4 h-4" />
              <span>Ask SewaAI Assistant</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
