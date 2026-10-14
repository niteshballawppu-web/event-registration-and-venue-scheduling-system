import React from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Role } from '../types/database';
import {
  CalendarDays,
  Grid3X3,
  UserCheck,
  Mic2,
  BarChart3,
  Database,
  RotateCcw,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const {
    role,
    setRole,
    currentParticipant,
    currentSpeaker,
    currentCoordinator,
    participants,
    speakers,
    coordinators,
    setCurrentParticipantId,
    setCurrentSpeakerId,
    setCurrentCoordinatorId,
    resetDatabaseToSeed
  } = useDatabase();

  const roleConfigs: Record<
    Role,
    { label: string; badge: string; color: string; desc: string }
  > = {
    COORDINATOR: {
      label: 'Coordinator (EC)',
      badge: 'Coordinator',
      color: 'bg-cyan-50 text-cyan-800 border-cyan-200',
      desc: currentCoordinator.name
    },
    PARTICIPANT: {
      label: 'Student (PT)',
      badge: 'Student',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      desc: `${currentParticipant.name} (${currentParticipant.student_id})`
    },
    SPEAKER: {
      label: 'Speaker (SP)',
      badge: 'Keynote',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      desc: `${currentSpeaker.name} (${currentSpeaker.affiliation.slice(0, 20)})`
    },
    ADMIN: {
      label: 'Admin (AD)',
      badge: 'Finance',
      color: 'bg-violet-50 text-violet-800 border-violet-200',
      desc: 'Institutional Finance & Audit'
    }
  };

  const navItems = [
    { id: 'events', label: 'Event Directory', icon: CalendarDays },
    { id: 'scheduler', label: 'Venue Matrix', icon: Grid3X3 },
    { id: 'participant', label: 'Student Portal', icon: UserCheck },
    { id: 'speaker', label: 'Speaker Hub', icon: Mic2 },
    { id: 'admin', label: 'Finance & Analytics', icon: BarChart3 },
    { id: 'schema', label: '3NF DBMS Architecture', icon: Database, isSpecial: true }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Bar with Brand & Role Controller */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 border-b border-slate-100 gap-4">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xs font-bold text-sm tracking-wider">
              NX
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold tracking-tight text-slate-900 text-base">
                NEXUS
              </span>
              <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                Institutional Event DBMS
              </span>
            </div>
          </div>

          {/* Center-Right Controls: Role Switcher, Persona Selector, Reset */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Role Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500 px-2 hidden sm:inline">
                Role:
              </span>
              {(['COORDINATOR', 'PARTICIPANT', 'SPEAKER', 'ADMIN'] as Role[]).map(r => {
                const isActive = role === r;
                return (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r);
                      if (r === 'PARTICIPANT' && activeTab !== 'events' && activeTab !== 'participant') {
                        setActiveTab('participant');
                      } else if (r === 'COORDINATOR' && activeTab !== 'scheduler' && activeTab !== 'events') {
                        setActiveTab('scheduler');
                      } else if (r === 'SPEAKER' && activeTab !== 'speaker') {
                        setActiveTab('speaker');
                      } else if (r === 'ADMIN' && activeTab !== 'admin') {
                        setActiveTab('admin');
                      }
                    }}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="sm:hidden">{r.slice(0, 2)}</span>
                    <span className="hidden sm:inline">
                      {r === 'COORDINATOR'
                        ? 'Coordinator'
                        : r === 'PARTICIPANT'
                        ? 'Student'
                        : r === 'SPEAKER'
                        ? 'Speaker'
                        : 'Admin'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Persona Switch dropdown */}
            {role === 'PARTICIPANT' && (
              <div className="relative group hidden md:block">
                <select
                  value={currentParticipant.participant_id}
                  onChange={e => setCurrentParticipantId(e.target.value)}
                  className="text-xs py-1.5 px-2.5 pr-6 rounded-lg border border-slate-200 bg-white text-slate-700 cursor-pointer appearance-none hover:border-slate-300 focus:outline-none"
                  title="Switch Active Student"
                >
                  {participants.map(p => (
                    <option key={p.participant_id} value={p.participant_id}>
                      {p.name} ({p.student_id})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>
            )}

            {role === 'SPEAKER' && (
              <div className="relative group hidden md:block">
                <select
                  value={currentSpeaker.speaker_id}
                  onChange={e => setCurrentSpeakerId(e.target.value)}
                  className="text-xs py-1.5 px-2.5 pr-6 rounded-lg border border-slate-200 bg-white text-slate-700 cursor-pointer appearance-none hover:border-slate-300 focus:outline-none"
                  title="Switch Active Keynote Speaker"
                >
                  {speakers.map(s => (
                    <option key={s.speaker_id} value={s.speaker_id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>
            )}

            {role === 'COORDINATOR' && (
              <div className="relative group hidden md:block">
                <select
                  value={currentCoordinator.coordinator_id}
                  onChange={e => setCurrentCoordinatorId(e.target.value)}
                  className="text-xs py-1.5 px-2.5 pr-6 rounded-lg border border-slate-200 bg-white text-slate-700 cursor-pointer appearance-none hover:border-slate-300 focus:outline-none"
                  title="Switch Active Coordinator"
                >
                  {coordinators.map(c => (
                    <option key={c.coordinator_id} value={c.coordinator_id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>
            )}

            {/* Reset Database Button */}
            <button
              onClick={resetDatabaseToSeed}
              title="Reset Database to Pristine Seed"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2 py-1.5 overflow-x-auto no-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : item.isSpecial
                    ? 'text-indigo-600 hover:bg-indigo-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.isSpecial ? 'text-indigo-600' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
