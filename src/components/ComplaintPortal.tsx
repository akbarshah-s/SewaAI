import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  MapPin, 
  Camera, 
  Clock, 
  ArrowRight,
  ShieldAlert,
  Bot
} from 'lucide-react';
import { getRuntimeComplaints, toolSubmitComplaint } from '../services/agentTools';
import { ComplaintRecord, Language } from '../types/sewa';
import { translations } from '../utils/translations';
import confetti from 'canvas-confetti';

interface ComplaintPortalProps {
  currentLanguage: Language;
  onTalkToAgent: () => void;
}

export const ComplaintPortal: React.FC<ComplaintPortalProps> = ({
  currentLanguage,
  onTalkToAgent,
}) => {
  const t = translations[currentLanguage];
  const complaints = getRuntimeComplaints();

  const [category, setCategory] = useState('Infrastructure & Road Potholes');
  const [location, setLocation] = useState('Kakkanad Civil Station Junction, Ernakulam');
  const [description, setDescription] = useState('Hazardous road pothole causing heavy traffic slowdown and safety risk.');
  const [contactName, setContactName] = useState('Rahul Menon');
  const [contactPhone, setContactPhone] = useState('+91 9745112233');

  const [submittedComplaint, setSubmittedComplaint] = useState<ComplaintRecord | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record = toolSubmitComplaint(category, location, description, contactName, contactPhone);
    setSubmittedComplaint(record);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Grievance Redressal</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white mt-1">Public Grievance & Complaint Redressal</h1>
        <p className="text-sm text-slate-400 mt-1">
          Report broken infrastructure, streetlights, or sanitation issues. SewaAI routes your complaint directly to the local department officer.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Container */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 bg-slate-900/90 space-y-5">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>File a New Grievance Ticket</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Grievance Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100"
              >
                <option value="Infrastructure & Road Potholes">Infrastructure & Road Potholes</option>
                <option value="Streetlight Repair">Streetlight Repair & Electrical Fault</option>
                <option value="Municipal Water Supply">Municipal Water Supply Line Leakage</option>
                <option value="Waste & Sanitation">Garbage Collection & Sanitation</option>
                <option value="Public Transit & Roads">Public Bus Stop Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Location Details</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Description of Problem</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Your Name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-gov-600 hover:from-amber-400 hover:to-gov-500 text-white font-extrabold text-sm shadow-lg flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Register Complaint Ticket</span>
            </button>
          </form>

        </div>

        {/* Complaints Tracking List */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-xs font-bold text-slate-400 uppercase block">Registered Grievance Tickets</span>
          
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {complaints.map(c => (
              <div key={c.complaintId} className="p-4 rounded-xl glass-card border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400">{c.complaintId}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                    {c.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white leading-snug">{c.category}</h4>
                <p className="text-xs text-slate-400 leading-tight">{c.location}</p>
                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Assigned to: {c.assignedOfficer || 'PWD Nodal Officer'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
