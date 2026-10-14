import React from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { getCategoryStyle } from '../utils/theme';
import {
  Mic2,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Layers,
  Wrench,
  Radio,
  FileText,
  Building,
  MonitorCheck
} from 'lucide-react';

export const SpeakerPortal: React.FC = () => {
  const {
    currentSpeaker,
    sessions,
    venues,
    events,
    registrations,
    coordinators
  } = useDatabase();

  // Sessions assigned to this speaker
  const mySessions = sessions.filter(s => s.speaker_id === currentSpeaker.speaker_id);

  return (
    <div className="space-y-6">
      {/* Speaker Identity Profile Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 overflow-hidden shrink-0 flex items-center justify-center">
            {currentSpeaker.avatar_url ? (
              <img
                src={currentSpeaker.avatar_url}
                alt={currentSpeaker.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Mic2 className="w-8 h-8 text-amber-600" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {currentSpeaker.name}
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                SPEAKER PK: {currentSpeaker.speaker_id}
              </span>
            </div>
            <div className="text-xs text-slate-600 mt-1 font-medium">
              {currentSpeaker.affiliation} · {currentSpeaker.specialty}
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-xl line-clamp-2">
              {currentSpeaker.bio}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono shrink-0">
          <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase">Allocated Sessions</span>
            <span className="font-bold text-slate-900 text-sm">{mySessions.length}</span>
          </div>
          <div className="px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-xl">
            <span className="text-indigo-500 block text-[10px] uppercase">Contact</span>
            <span className="font-bold text-indigo-700 text-xs truncate max-w-[140px] block">
              {currentSpeaker.email}
            </span>
          </div>
        </div>
      </div>

      {/* Allocated Sessions List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Allocated Keynotes, Panels & Lab Modules
            </h3>
            <p className="text-xs text-slate-500">
              Assigned physical hall locations, technical AV rider checklist, and attendee count.
            </p>
          </div>
        </div>

        {mySessions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Mic2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-slate-800">No Allocated Sessions</h4>
            <p className="text-xs text-slate-500 mt-1">
              You currently have no sessions scheduled on the institutional venue matrix.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {mySessions.map(session => {
              const venue = venues.find(v => v.venue_id === session.venue_id);
              const event = events.find(e => e.event_id === session.event_id);
              const coordinator = coordinators.find(c => c.coordinator_id === event?.coordinator_id);
              const catStyle = getCategoryStyle(event?.category_id);
              
              // Count attendees registered for this parent event
              const registeredCount = registrations.filter(
                r => r.event_id === session.event_id && r.status === 'CONFIRMED'
              ).length;

              return (
                <div
                  key={session.session_id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden"
                >
                  {/* Top Category Gradient Stripe */}
                  <div className={`h-2.5 w-full bg-gradient-to-r ${catStyle.gradient}`} />

                  {/* Top Bar with Timeslot */}
                  <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/70">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          {session.session_id}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold ${catStyle.bgLight} ${catStyle.text}`}>
                          EVENT: {session.event_id}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {event?.title}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mt-1.5 leading-snug">
                        {session.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className={`px-4 py-1.5 rounded-xl bg-gradient-to-r ${catStyle.gradient} text-white font-mono text-xs font-semibold shadow-xs flex items-center gap-1.5`}>
                        <Clock className="w-3.5 h-3.5" />
                        <span>{session.date} · {session.start_time} - {session.end_time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Specs Grid */}
                  <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Venue & Hall Specifications */}
                    <div className="space-y-3">
                      <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-500" />
                        <span>Venue Location & Capacity</span>
                      </h5>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                        <div className="font-bold text-slate-900 text-sm">
                          {venue?.name || 'TBA'}
                        </div>
                        <div className="text-slate-600 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{venue?.building} ({venue?.floor})</span>
                        </div>
                        <div className="text-indigo-600 font-mono font-medium pt-1">
                          Max Hall Seating: {venue?.capacity} seats
                        </div>
                      </div>
                    </div>

                    {/* Audio/Visual Rider & Equipment Checklist */}
                    <div className="space-y-3">
                      <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Equipped Hardware & AV Rider</span>
                      </h5>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
                        {venue?.equipment && venue.equipment.length > 0 ? (
                          venue.equipment.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-slate-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-slate-500 italic">Standard podium setup</div>
                        )}
                      </div>
                    </div>

                    {/* Audience & Logistics */}
                    <div className="space-y-3">
                      <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        <span>Audience & Coordinator</span>
                      </h5>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Expected Attendees:</span>
                          <span className="font-bold text-slate-900 font-mono text-sm">
                            {registeredCount} Participants
                          </span>
                        </div>

                        {coordinator && (
                          <div className="pt-2 border-t border-slate-200/60">
                            <span className="text-[10px] text-slate-400 block uppercase">
                              Liaison Coordinator
                            </span>
                            <div className="font-semibold text-slate-800 mt-0.5">
                              {coordinator.name}
                            </div>
                            <div className="text-slate-500 text-[11px] font-mono truncate">
                              {coordinator.email}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Notes / Syllabus Footer */}
                  <div className="px-6 py-3.5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span className="font-medium text-slate-700">
                      Module Scope: {session.description}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      Collision Status: OK (Locked)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
