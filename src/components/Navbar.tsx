import React, { useEffect, useRef, useState } from 'react';
import { 
  Building2, 
  MessageSquareCode, 
  Search, 
  FileText, 
  AlertTriangle, 
  MapPin, 
  LayoutDashboard, 
  Globe, 
  Bell, 
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Siren,
  Menu,
  X
} from 'lucide-react';
import { Language, UserNotification } from '../types/sewa';
import { translations } from '../utils/translations';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  notifications: UserNotification[];
  onOpenChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentLanguage,
  setLanguage,
  notifications,
  onOpenChat,
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [helpNoticeVisible, setHelpNoticeVisible] = useState(false);
  const [alertPlaying, setAlertPlaying] = useState(false);
  const alertStopTimeoutRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sosSourceRef = useRef<OscillatorNode | null>(null);

  const t = translations[currentLanguage];
  const unreadCount = notifications.filter(n => !n.read).length;

  const stopHelpAlert = () => {
    if (alertStopTimeoutRef.current !== null) window.clearTimeout(alertStopTimeoutRef.current);
    alertStopTimeoutRef.current = null;
    if (sosSourceRef.current) {
      try {
        sosSourceRef.current.stop();
      } catch {
      }
      sosSourceRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      void audioContextRef.current.close();
    }
    audioContextRef.current = null;
    setAlertPlaying(false);
  };

  useEffect(() => () => stopHelpAlert(), []);

  const handleHelpAlert = () => {
    if (alertPlaying) {
      stopHelpAlert();
      setHelpNoticeVisible(false);
      return;
    }

    const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;
      void audioContext.resume();
      const sosSource = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const pattern = [0.22, 0.22, 0.22, 0.66, 0.66, 0.66, 0.22, 0.22, 0.22];
      const cycleDuration = 4.2;
      const scheduleStart = audioContext.currentTime + 0.05;
      sosSource.type = 'square';
      sosSource.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, scheduleStart);

      for (let cycle = 0; cycle < 15; cycle += 1) {
        let offset = cycle * cycleDuration;
        pattern.forEach((toneDuration, toneIndex) => {
          const toneStart = scheduleStart + offset;
          const toneEnd = toneStart + toneDuration;
          gain.gain.setValueAtTime(0.0001, toneStart);
          gain.gain.linearRampToValueAtTime(0.32, toneStart + 0.015);
          gain.gain.setValueAtTime(0.32, toneEnd - 0.015);
          gain.gain.linearRampToValueAtTime(0.0001, toneEnd);
          offset += toneDuration + (toneIndex === 2 || toneIndex === 5 ? 0.42 : 0.16);
        });
      }

      sosSource.connect(gain);
      gain.connect(audioContext.destination);
      sosSourceRef.current = sosSource;
      sosSource.start(scheduleStart);
      sosSource.stop(scheduleStart + 60);
      alertStopTimeoutRef.current = window.setTimeout(stopHelpAlert, 60000);
      setAlertPlaying(true);
    }

    setHelpNoticeVisible(true);
    window.setTimeout(() => setHelpNoticeVisible(false), 3500);
    onOpenChat();
  };

  const navLinks = [
    { id: 'landing', label: 'Home', icon: Building2 },
    { id: 'services', label: t.navServices, icon: Search },
    { id: 'applications', label: t.navApplications, icon: FileText },
    { id: 'complaints', label: t.navComplaints, icon: AlertTriangle },
    { id: 'offices', label: t.navOffices, icon: MapPin },
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'admin', label: t.navAdmin, icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setCurrentTab('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-teal-500 via-teal-600 to-gov-600 p-0.5 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-teal-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-teal-300 bg-clip-text text-transparent">
                  {t.appName}
                </span>
                <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30">
                  AI Agent
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                {t.appTagline}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentTab(link.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-teal-500/15 text-teal-400 border border-teal-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Action Tools & Talk Button */}
          <div className="flex items-center gap-3">

            {/* Immediate help and alert sound */}
            <div className="relative">
              <button
                onClick={handleHelpAlert}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl font-bold text-xs border transition-all shadow-lg shadow-red-950/20 ${alertPlaying ? 'bg-red-500 text-white border-red-300 animate-pulse' : 'bg-red-500/15 hover:bg-red-500/25 text-red-300 border-red-500/40 hover:border-red-400/70'}`}
                title={alertPlaying ? 'Stop SOS alert' : 'Play one-minute SOS alert and open SewaAI'}
                aria-label={alertPlaying ? 'Stop SOS alert' : 'Need help: play one-minute SOS alert and open SewaAI'}
              >
                <Siren className="w-4 h-4" />
                <span className="hidden sm:inline">{alertPlaying ? 'Stop SOS' : 'SOS Help'}</span>
              </button>
              {helpNoticeVisible && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-red-500/40 bg-slate-800 px-3 py-2 text-[11px] font-semibold text-red-200 shadow-xl z-50">
                  SOS alert activated. SewaAI is ready to assist.
                </div>
              )}
            </div>
            
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 transition-colors"
                title={t.selectLang}
              >
                <Globe className="w-4 h-4 text-teal-400" />
                <span className="uppercase">{currentLanguage}</span>
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => { setLanguage('en'); setShowLangMenu(false); }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center justify-between ${currentLanguage === 'en' ? 'bg-teal-500/20 text-teal-300 font-bold' : 'text-slate-300 hover:bg-slate-700/60'}`}
                  >
                    <span>English</span>
                    {currentLanguage === 'en' && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />}
                  </button>
                  <button
                    onClick={() => { setLanguage('ml'); setShowLangMenu(false); }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center justify-between ${currentLanguage === 'ml' ? 'bg-teal-500/20 text-teal-300 font-bold' : 'text-slate-300 hover:bg-slate-700/60'}`}
                  >
                    <span>മലയാളം (Malayalam)</span>
                    {currentLanguage === 'ml' && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />}
                  </button>
                  <button
                    onClick={() => { setLanguage('hi'); setShowLangMenu(false); }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center justify-between ${currentLanguage === 'hi' ? 'bg-teal-500/20 text-teal-300 font-bold' : 'text-slate-300 hover:bg-slate-700/60'}`}
                  >
                    <span>हिंदी (Hindi)</span>
                    {currentLanguage === 'hi' && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />}
                  </button>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 transition-colors"
              >
                <Bell className="w-4 h-4 text-slate-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-teal-500 text-slate-950 font-extrabold text-[10px] flex items-center justify-center shadow-md animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl p-3 z-50">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700">
                    <span className="text-xs font-bold text-slate-200">Notifications</span>
                    <span className="text-[10px] text-teal-400 font-semibold">{notifications.length} alerts</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/50 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-200">{n.title}</span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {n.timestamp}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px] leading-snug">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action CTA Button */}
            <button
              onClick={onOpenChat}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-teal-500 via-teal-600 to-gov-600 hover:from-teal-400 hover:to-gov-500 text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-300 transform active:scale-95"
            >
              <MessageSquareCode className="w-4 h-4 animate-bounce" />
              <span>{t.talkToSewaAI}</span>
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => { setCurrentTab(link.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-teal-500/20 text-teal-400 font-bold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
