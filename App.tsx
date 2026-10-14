/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DatabaseProvider, useDatabase } from './context/DatabaseContext';
import { Navbar } from './components/Navbar';
import { EventsDirectory } from './components/EventsDirectory';
import { VenueScheduler } from './components/VenueScheduler';
import { ParticipantPortal } from './components/ParticipantPortal';
import { SpeakerPortal } from './components/SpeakerPortal';
import { AdminAnalytics } from './components/AdminAnalytics';
import { ERDiagramShowcase } from './components/ERDiagramShowcase';
import { CreateEventModal } from './components/CreateEventModal';
import { ToastContainer } from './components/Toast';
import { ShieldCheck } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('events');
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const { role } = useDatabase();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Sticky Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'events' && (
          <EventsDirectory
            onNavigateToPortal={() => setActiveTab('participant')}
            onOpenCreateEvent={() => setIsCreateEventOpen(true)}
          />
        )}

        {activeTab === 'scheduler' && <VenueScheduler />}

        {activeTab === 'participant' && <ParticipantPortal />}

        {activeTab === 'speaker' && <SpeakerPortal />}

        {activeTab === 'admin' && <AdminAnalytics />}

        {activeTab === 'schema' && <ERDiagramShowcase />}
      </main>

      {/* Create Event Modal */}
      {isCreateEventOpen && (
        <CreateEventModal onClose={() => setIsCreateEventOpen(false)} />
      )}

      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Institutional System Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
              NX
            </div>
            <span className="font-semibold text-slate-800">
              NEXUS Institutional Event Registration & Venue Scheduling System
            </span>
            <span className="font-mono text-[11px] text-slate-400">v2.4 (3NF RDBMS)</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-600">
            <span className="flex items-center gap-1 text-emerald-600">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Collision Guard Active</span>
            </span>
            <span>·</span>
            <span>12 Relational Entities</span>
            <span>·</span>
            <span>ACID Compliant Sandbox</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <DatabaseProvider>
      <AppContent />
    </DatabaseProvider>
  );
}
