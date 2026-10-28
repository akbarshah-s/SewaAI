import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Phone, 
  Mail, 
  Clock, 
  Building2, 
  Navigation,
  ExternalLink,
  Bot
} from 'lucide-react';
import { mockGovOffices } from '../data/mockData';
import { GovOffice, Language } from '../types/sewa';
import { translations } from '../utils/translations';

interface OfficeFinderProps {
  currentLanguage: Language;
  onTalkToAgent: () => void;
}

export const OfficeFinder: React.FC<OfficeFinderProps> = ({
  currentLanguage,
  onTalkToAgent,
}) => {
  const t = translations[currentLanguage];
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const districts = ['all', 'Ernakulam', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur'];

  const filteredOffices = mockGovOffices.filter(o => {
    const matchesDistrict = selectedDistrict === 'all' || o.district.toLowerCase() === selectedDistrict.toLowerCase();
    const matchesQuery = o.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         o.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         o.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDistrict && matchesQuery;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Map Locator</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white mt-1">Government Office Locator</h1>
        <p className="text-sm text-slate-400 mt-1">
          Locate nearest Revenue Offices, Collectorate counters, and Panchayath centers across Kerala.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by office name, department, or location..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {districts.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDistrict(d)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedDistrict === d
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              {d === 'all' ? 'All Districts' : d}
            </button>
          ))}
        </div>
      </div>

      {/* Grid View: Interactive Map Simulator + Office Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Mock Map Container */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-slate-800 bg-slate-950 flex flex-col justify-between min-h-[400px] relative overflow-hidden">
          
          {/* Map Grid Pattern background */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
          
          <div className="relative z-10">
            <span className="text-xs font-mono font-bold text-teal-400 uppercase">Interactive Kerala District Map</span>
            <h3 className="text-lg font-bold text-white mt-1">Geo-Location Pins</h3>
            <p className="text-xs text-slate-400 mt-1">Simulated map pins pointing to major District Collectorate centers.</p>
          </div>

          <div className="relative z-10 space-y-3 py-6">
            {filteredOffices.map((off, idx) => (
              <div key={off.id} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-400" />
                  <span className="font-bold text-slate-200">{off.name}</span>
                </div>
                <span className="text-[10px] font-mono text-teal-400 font-semibold">{off.district}</span>
              </div>
            ))}
          </div>

          <div className="relative z-10 pt-4 border-t border-slate-800 text-center">
            <button
              onClick={onTalkToAgent}
              className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center justify-center gap-1.5 mx-auto"
            >
              <Bot className="w-4 h-4" />
              <span>Ask SewaAI to find office directions</span>
            </button>
          </div>

        </div>

        {/* Right Side: Office Cards List */}
        <div className="lg:col-span-7 space-y-4">
          {filteredOffices.map(office => (
            <div key={office.id} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 px-2 py-0.5 rounded bg-teal-500/10">
                    {office.department}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1.5">{office.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>{office.address}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{office.contactNumber}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{office.email}</span>
                </p>
                <p className="flex items-center gap-2 sm:col-span-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{office.workingHours}</span>
                </p>
              </div>

              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-400 block mb-1">Services Provided:</span>
                <div className="flex flex-wrap gap-1.5">
                  {office.servicesProvided.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
