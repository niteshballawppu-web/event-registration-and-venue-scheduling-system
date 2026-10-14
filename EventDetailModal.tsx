import React from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { InstitutionalEvent } from '../types/database';
import { getCategoryStyle } from '../utils/theme';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Award,
  Users,
  Shield,
  ExternalLink,
  Layers,
  Mic2
} from 'lucide-react';

interface EventDetailModalProps {
  event: InstitutionalEvent;
  onClose: () => void;
  onOpenRegister: (event: InstitutionalEvent) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onOpenRegister
}) => {
  const {
    sessions,
    speakers,
    venues,
    coordinators,
    categories,
    currentParticipant,
    isParticipantAlreadyRegistered,
    getEventRemainingCapacity
  } = useDatabase();

  const category = categories.find(c => c.category_id === event.category_id);
  const coordinator = coordinators.find(c => c.coordinator_id === event.coordinator_id);
  const eventSessions = sessions.filter(s => s.event_id === event.event_id);
  const capacityInfo = getEventRemainingCapacity(event.event_id);
  const isRegistered = isParticipantAlreadyRegistered(currentParticipant.participant_id, event.event_id);
  const categoryStyle = getCategoryStyle(event.category_id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Top Category Gradient Stripe */}
        <div className={`h-2.5 w-full bg-gradient-to-r ${categoryStyle.gradient}`} />

        {/* Header with Category Color bar */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-md ${categoryStyle.bgLight} ${categoryStyle.text}`}>
                {event.event_id}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${categoryStyle.bgLight} ${categoryStyle.text}`}>
                {category?.name || 'Academic Event'}
              </span>
              <span className="text-xs font-mono text-slate-500">
                Fee: {event.fee === 0 ? 'FREE' : `$${event.fee.toFixed(2)}`}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
              {event.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Overview Description */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Syllabus & Scope
            </h4>
            <p className="text-slate-600 leading-relaxed text-sm">
              {event.description}
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Date Range</span>
              </div>
              <div className="font-semibold text-slate-800 text-xs mt-1">
                {event.start_date}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-indigo-500" />
                <span>Certificate</span>
              </div>
              <div className="font-semibold text-indigo-700 text-xs mt-1">
                ≥ {event.cert_threshold_pct}% Attendance
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>Seats Left</span>
              </div>
              <div className="font-semibold text-slate-800 text-xs mt-1 font-mono">
                {capacityInfo.remaining} / {capacityInfo.totalCapacity}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Status</span>
              </div>
              <div className="font-semibold text-emerald-700 text-xs mt-1">
                {event.status}
              </div>
            </div>
          </div>

          {/* Sessions & Agenda Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Scheduled Timetable & Venue Allocations ({eventSessions.length} Modules)
              </h4>
            </div>

            {eventSessions.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
                No individual sessions scheduled yet. Check back soon.
              </div>
            ) : (
              <div className="space-y-3">
                {eventSessions.map((session, idx) => {
                  const venue = venues.find(v => v.venue_id === session.venue_id);
                  const speaker = speakers.find(s => s.speaker_id === session.speaker_id);

                  return (
                    <div
                      key={session.session_id}
                      className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all bg-white shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                              {session.session_id}
                            </span>
                            <span className="text-xs font-semibold text-slate-900">
                              {session.title}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            {session.description}
                          </p>
                        </div>
                        <span className="text-xs font-mono font-medium px-2 py-1 rounded bg-slate-100 text-slate-700 whitespace-nowrap">
                          {session.start_time} - {session.end_time}
                        </span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-medium text-slate-700">{venue?.name || 'TBA'}</span>
                          <span className="text-[11px] text-slate-400">({venue?.floor})</span>
                        </div>

                        {speaker && (
                          <div className="flex items-center gap-1.5">
                            <Mic2 className="w-3.5 h-3.5 text-indigo-500" />
                            <span className="text-slate-800 font-medium">{speaker.name}</span>
                            <span className="text-[11px] text-slate-400">({speaker.affiliation})</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Coordinator Details */}
          {coordinator && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                  <img
                    src={coordinator.avatar_url}
                    alt={coordinator.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Event Coordinator</div>
                  <div className="font-semibold text-slate-900 text-sm">{coordinator.name}</div>
                  <div className="text-xs text-slate-600">{coordinator.department}</div>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-500">{coordinator.email}</span>
            </div>
          )}
        </div>

        {/* Footer with Register / Status CTA */}
        <div className="p-4 px-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-mono">
            {capacityInfo.remaining} spots left · Max {event.max_capacity}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Close
            </button>

            {isRegistered ? (
              <span className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Already Registered
              </span>
            ) : capacityInfo.isFull ? (
              <button
                disabled
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-slate-200 text-slate-500 cursor-not-allowed"
              >
                Capacity Full
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onOpenRegister(event);
                }}
                className={`px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r ${categoryStyle.gradient} text-white shadow-sm transition-all active:scale-95`}
              >
                Register Now ({event.fee === 0 ? 'Free' : `$${event.fee}`}) →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
