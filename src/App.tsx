import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AgentChat } from './components/AgentChat';
import { ServicesDirectory } from './components/ServicesDirectory';
import { EligibilityChecker } from './components/EligibilityChecker';
import { ApplicationWizard } from './components/ApplicationWizard';
import { TrackingDashboard } from './components/TrackingDashboard';
import { DocumentAssistant } from './components/DocumentAssistant';
import { ComplaintPortal } from './components/ComplaintPortal';
import { OfficeFinder } from './components/OfficeFinder';
import { CitizenDashboard } from './components/CitizenDashboard';
import { AdminDemoDashboard } from './components/AdminDemoDashboard';

import { Language, UserNotification } from './types/sewa';
import { mockNotifications } from './data/mockData';
import { MessageSquareCode, Sparkles } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [currentLanguage, setLanguage] = useState<Language>('en');
  const [activeTrackingRefId, setActiveTrackingRefId] = useState<string | undefined>(undefined);
  const [initialWizardServiceId, setInitialWizardServiceId] = useState<string | undefined>(undefined);
  const [notifications, setNotifications] = useState<UserNotification[]>(mockNotifications);

  const handleOpenChat = () => {
    setCurrentTab('chat');
  };

  const handleApplyWithAgent = (serviceId: string) => {
    setInitialWizardServiceId(serviceId);
    setCurrentTab('application');
  };

  const handleNavigateToTracking = (refId: string) => {
    setActiveTrackingRefId(refId);
    setCurrentTab('tracking');
  };

  const handleNavigateToTab = (tab: string, refId?: string) => {
    if (refId) setActiveTrackingRefId(refId);
    setCurrentTab(tab);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      
      {/* Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentLanguage={currentLanguage}
        setLanguage={setLanguage}
        notifications={notifications}
        onOpenChat={handleOpenChat}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onOpenChat={handleOpenChat}
            onExploreServices={() => setCurrentTab('services')}
            onTrackApp={() => setCurrentTab('tracking')}
            currentLanguage={currentLanguage}
          />
        )}

        {currentTab === 'chat' && (
          <AgentChat
            currentLanguage={currentLanguage}
            onNavigateToTab={handleNavigateToTab}
          />
        )}

        {currentTab === 'services' && (
          <ServicesDirectory
            currentLanguage={currentLanguage}
            onApplyWithAgent={handleApplyWithAgent}
          />
        )}

        {currentTab === 'eligibility' && (
          <EligibilityChecker
            currentLanguage={currentLanguage}
            onApplyWithAgent={handleApplyWithAgent}
          />
        )}

        {currentTab === 'application' && (
          <ApplicationWizard
            currentLanguage={currentLanguage}
            initialServiceId={initialWizardServiceId}
            onNavigateToTracking={handleNavigateToTracking}
          />
        )}

        {currentTab === 'tracking' && (
          <TrackingDashboard
            currentLanguage={currentLanguage}
            initialRefId={activeTrackingRefId}
            onTalkToAgent={handleOpenChat}
          />
        )}

        {currentTab === 'documents' && (
          <DocumentAssistant
            currentLanguage={currentLanguage}
            onTalkToAgent={handleOpenChat}
          />
        )}

        {currentTab === 'complaints' && (
          <ComplaintPortal
            currentLanguage={currentLanguage}
            onTalkToAgent={handleOpenChat}
          />
        )}

        {currentTab === 'offices' && (
          <OfficeFinder
            currentLanguage={currentLanguage}
            onTalkToAgent={handleOpenChat}
          />
        )}

        {currentTab === 'dashboard' && (
          <CitizenDashboard
            currentLanguage={currentLanguage}
            onNavigateToTab={handleNavigateToTab}
            onOpenChat={handleOpenChat}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDemoDashboard
            currentLanguage={currentLanguage}
          />
        )}
      </main>

      {/* Floating Action Button for SewaAI Chat */}
      {currentTab !== 'chat' && (
        <button
          onClick={handleOpenChat}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-teal-500 via-teal-600 to-gov-600 hover:from-teal-400 hover:to-gov-500 text-white font-extrabold text-sm shadow-2xl shadow-teal-500/40 hover:scale-105 transition-all duration-300 transform active:scale-95 border border-teal-300/30"
        >
          <div className="relative">
            <MessageSquareCode className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900 animate-ping" />
          </div>
          <span>Talk to SewaAI</span>
        </button>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2 font-bold text-slate-400">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>SewaAI — Autonomous Government Services Agent</span>
          </div>
          <p>Developed for Agentic AI Hackathon 2026. Designed for seamless citizen accessibility across English, Malayalam & Hindi.</p>
          <p className="text-[11px] text-amber-500/80 italic">
            Prototype Notice: All eligibility scores and departmental submissions are simulated for demonstration.
          </p>
        </div>
      </footer>

    </div>
  );
}
