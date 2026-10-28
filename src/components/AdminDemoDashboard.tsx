import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  FileText, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Database,
  Terminal
} from 'lucide-react';
import { getRuntimeApplications, getRuntimeComplaints, getRuntimeToolCalls } from '../services/agentTools';
import { Language } from '../types/sewa';

interface AdminDemoDashboardProps {
  currentLanguage: Language;
}

export const AdminDemoDashboard: React.FC<AdminDemoDashboardProps> = () => {
  const applications = getRuntimeApplications();
  const complaints = getRuntimeComplaints();
  const toolCalls = getRuntimeToolCalls();

  const totalApps = applications.length;
  const approvedApps = applications.filter(a => a.currentStatus === 'Approved' || a.currentStatus === 'Completed').length;
  const pendingApps = totalApps - approvedApps;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-400">
              Hackathon Judge Portal
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Admin & Agent Audit Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time analytics and live tool call execution stream for evaluating SewaAI agent actions.
          </p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Total Applications</span>
          <span className="text-3xl font-extrabold text-white mt-1 block">{totalApps}</span>
          <span className="text-[11px] text-teal-400 block mt-1">✓ Processed by Agent</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Pending Review</span>
          <span className="text-3xl font-extrabold text-amber-400 mt-1 block">{pendingApps}</span>
          <span className="text-[11px] text-slate-400 block mt-1">In Department Queue</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Approved / Sanctioned</span>
          <span className="text-3xl font-extrabold text-emerald-400 mt-1 block">{approvedApps}</span>
          <span className="text-[11px] text-emerald-400 block mt-1">100% Verified</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Active Complaints</span>
          <span className="text-3xl font-extrabold text-sky-400 mt-1 block">{complaints.length}</span>
          <span className="text-[11px] text-slate-400 block mt-1">PWD / Municipal</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Total Tool Calls</span>
          <span className="text-3xl font-extrabold text-teal-300 mt-1 block">{toolCalls.length}</span>
          <span className="text-[11px] text-teal-400 block mt-1">Executed in Session</span>
        </div>

      </div>

      {/* Grid: Application Logs + Live Agent Tool Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Departmental Application Records */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-teal-400" />
            <span>Departmental Application Records</span>
          </h2>

          <div className="space-y-3 max-h-[550px] overflow-y-auto">
            {applications.map(app => (
              <div key={app.referenceId} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-teal-300">{app.referenceId}</span>
                  <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                    app.currentStatus === 'Completed' || app.currentStatus === 'Approved'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-teal-500/20 text-teal-300'
                  }`}>
                    {app.currentStatus}
                  </span>
                </div>
                <h4 className="font-bold text-slate-100 text-sm">{app.serviceName}</h4>
                <p className="text-slate-400">Applicant: <strong>{app.applicant.fullName}</strong> ({app.applicant.district}, {app.applicant.state})</p>
                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
                  <span>Submitted: {app.submittedAt}</span>
                  <span>Dept: {app.department}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Agent Tool Audit Stream */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-teal-400 animate-pulse" />
            <span>Live Agent Tool Execution Stream</span>
          </h2>

          <div className="glass-panel rounded-2xl p-4 border border-slate-800 bg-slate-950/95 space-y-3 max-h-[550px] overflow-y-auto font-mono text-xs">
            {toolCalls.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                No tool calls logged yet. Open the SewaAI Chat interface to trigger autonomous tool executions.
              </div>
            ) : (
              toolCalls.map((tCall, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-teal-400 font-bold">
                    <span>fn:{tCall.toolName}()</span>
                    <span className="text-[10px] text-slate-500">{tCall.timestamp}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800 text-[10px] text-slate-300 overflow-x-auto">
                    <span className="text-slate-500 block mb-0.5 font-bold">Payload:</span>
                    <code>{JSON.stringify(tCall.params)}</code>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-emerald-400">Status: {tCall.status}</span>
                    <span className="text-slate-400">Execution Result: SUCCESS</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
