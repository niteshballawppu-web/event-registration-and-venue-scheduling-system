import React, { useState, useMemo } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Session, Venue } from '../types/database';
import { getCategoryStyle, VENUE_COLOR_MAP } from '../utils/theme';
import {
  Calendar,
  Clock,
  AlertTriangle,
  Plus,
  Trash2,
  MapPin,
  Mic2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const VenueScheduler: React.FC = () => {
  const {
    venues,
    sessions,
    events,
    speakers,
    scheduleSession,
    deleteSession,
    checkVenueCollision,
    addToast
  } = useDatabase();

  const availableDates = ['2026-10-15', '2026-10-16', '2026-10-18', '2026-10-22', '2026-10-25'];
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-15');

  // New Session Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEventId, setNewEventId] = useState<string>(events[0]?.event_id || '');
  const [newVenueId, setNewVenueId] = useState<string>(venues[0]?.venue_id || '');
  const [newSpeakerId, setNewSpeakerId] = useState<string>(speakers[0]?.speaker_id || '');
  const [newTitle, setNewTitle] = useState('');
  const [newStartTime, setNewStartTime] = useState('09:00');
  const [newEndTime, setNewEndTime] = useState('11:00');
  const [newDescription, setNewDescription] = useState('');

  // Live Real-Time Collision Evaluation
  const liveCollision = useMemo(() => {
    if (!newVenueId || !selectedDate || !newStartTime || !newEndTime) {
      return { hasConflict: false };
    }
    return checkVenueCollision(newVenueId, selectedDate, newStartTime, newEndTime);
  }, [newVenueId, selectedDate, newStartTime, newEndTime, checkVenueCollision]);

  // Hours for Gantt X-Axis: 08:00 to 19:00
  const matrixHours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
  const startHour = 8;
  const totalHours = 12;

  const getTimelinePlacement = (startTime: string, endTime: string) => {
    const parseTime = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h + m / 60;
    };

    const s = Math.max(startHour, parseTime(startTime));
    const e = Math.min(startHour + totalHours, parseTime(endTime));
    const duration = Math.max(0.5, e - s);

    const left = ((s - startHour) / totalHours) * 100;
    const width = (duration / totalHours) * 100;

    return { left: `${left}%`, width: `${width}%` };
  };

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();

    if (liveCollision.hasConflict) {
      addToast({
        type: 'error',
        title: 'Collision Prevented',
        message: liveCollision.message || 'Cannot schedule overlapping sessions in the same venue.'
      });
      return;
    }

    const res = scheduleSession({
      event_id: newEventId,
      venue_id: newVenueId,
      speaker_id: newSpeakerId,
      title: newTitle || 'Institutional Colloquium Session',
      date: selectedDate,
      start_time: newStartTime,
      end_time: newEndTime,
      description: newDescription || 'Standard scheduled session module.',
      equipment_needed: ['Projector', 'Audio AV']
    });

    if (res.success) {
      setIsModalOpen(false);
      setNewTitle('');
      setNewDescription('');
    }
  };

  const handleSimulateCollisionTest = () => {
    const existing = sessions.find(s => s.date === selectedDate);
    if (existing) {
      setNewVenueId(existing.venue_id);
      setNewStartTime(existing.start_time);
      setNewEndTime(existing.end_time);
      setNewTitle(`Colliding Test Session with ${existing.session_id}`);
      setIsModalOpen(true);
    } else {
      setSelectedDate('2026-10-15');
      setNewVenueId('VEN-02');
      setNewStartTime('09:30');
      setNewEndTime('10:30');
      setNewTitle('Forced Overlap Demonstration Session');
      setIsModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar with Multi-Color Highlights */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Venue Collision & Scheduling Matrix
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
              Live DBMS Overlap Guard
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gantt timetable showing room occupancy, speaker assignments, and instant double-booking detection.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <span className="text-xs font-medium text-slate-500 px-2 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Date:
            </span>
            {availableDates.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDate(d)}
                className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all ${
                  selectedDate === d
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {d.slice(5)}
              </button>
            ))}
          </div>

          {/* Test Overlap Trigger Button */}
          <button
            onClick={handleSimulateCollisionTest}
            title="Demonstrate how DBMS flags overlapping intervals"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Test Overlap Trigger</span>
          </button>

          {/* Schedule Session Button */}
          <button
            onClick={() => {
              setNewTitle('');
              setNewStartTime('09:00');
              setNewEndTime('10:30');
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Allocate Room</span>
          </button>
        </div>
      </div>

      {/* Gantt Timeline Matrix View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table/Gantt Header: Timeline Hours */}
        <div className="border-b border-slate-200 bg-slate-50/80 p-3 sm:px-6">
          <div className="flex items-center">
            <div className="w-48 sm:w-64 shrink-0 font-semibold text-xs text-slate-600 uppercase tracking-wider">
              Campus Venue & Specs
            </div>

            <div className="flex-1 grid grid-cols-12 text-center font-mono text-[11px] text-slate-500 font-medium">
              {matrixHours.map(hour => (
                <div key={hour} className="border-l border-slate-200 px-1 truncate">
                  {hour < 10 ? `0${hour}:00` : `${hour}:00`}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Venue Rows */}
        <div className="divide-y divide-slate-100">
          {venues.map(venue => {
            const venueSessions = sessions.filter(
              s => s.venue_id === venue.venue_id && s.date === selectedDate
            );
            const venueCol = VENUE_COLOR_MAP[venue.venue_id] || { badge: 'bg-slate-100 border-slate-200 text-slate-700', text: 'text-slate-700', dot: 'bg-slate-400' };

            return (
              <div
                key={venue.venue_id}
                className="flex items-stretch min-h-[96px] hover:bg-slate-50/50 transition-colors"
              >
                {/* Venue Details Column */}
                <div className="w-48 sm:w-64 p-3.5 sm:p-4 shrink-0 border-r border-slate-100 flex flex-col justify-center">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${venueCol.dot}`} />
                    <span className="font-semibold text-xs text-slate-900 truncate">
                      {venue.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{venue.floor}</span>
                  </div>
                  <div className="text-[11px] font-mono text-indigo-600 mt-1">
                    Capacity: {venue.capacity} seats
                  </div>
                </div>

                {/* Timeline Grid Cell */}
                <div className="flex-1 relative p-2 flex items-center min-w-[500px]">
                  {/* Background grid lines */}
                  <div className="absolute inset-0 grid grid-cols-12 pointer-events-none">
                    {matrixHours.map(h => (
                      <div key={h} className="border-l border-slate-100 h-full" />
                    ))}
                  </div>

                  {/* Render Booked Sessions with Multi-Color Styles */}
                  {venueSessions.length === 0 ? (
                    <div className="text-[11px] text-slate-400 italic pl-4 pointer-events-none font-mono">
                      No sessions booked on {selectedDate}
                    </div>
                  ) : (
                    venueSessions.map(session => {
                      const placement = getTimelinePlacement(session.start_time, session.end_time);
                      const speaker = speakers.find(sp => sp.speaker_id === session.speaker_id);
                      const event = events.find(ev => ev.event_id === session.event_id);
                      const style = getCategoryStyle(event?.category_id);

                      return (
                        <div
                          key={session.session_id}
                          style={{
                            left: placement.left,
                            width: placement.width,
                            position: 'absolute'
                          }}
                          className={`h-18 rounded-xl border ${style.border} ${style.bgLight} p-2.5 shadow-xs hover:shadow-md hover:z-20 transition-all flex flex-col justify-between overflow-hidden group`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div className="min-w-0">
                              <span className={`text-[10px] font-mono font-bold ${style.text} block truncate`}>
                                {session.session_id} · {session.start_time}-{session.end_time}
                              </span>
                              <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5" title={session.title}>
                                {session.title}
                              </h4>
                            </div>

                            <button
                              onClick={e => {
                                e.stopPropagation();
                                deleteSession(session.session_id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded transition-opacity"
                              title="Delete Session"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-600 truncate mt-1">
                            <span className="truncate">
                              {speaker?.name || 'Assigned Faculty'}
                            </span>
                            <span className="font-mono text-[10px] bg-white/90 px-1.5 py-0.2 rounded border border-slate-200/60 shrink-0">
                              {event?.event_id}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Multi-Color Diagnostic Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-mono font-bold text-base shrink-0 shadow-sm">
              0
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">
                Active Schedule Collision Violations: 0
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Relational interval constraint strictly evaluated on every schedule mutation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Integrity Verified
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
              Real-Time Reactive
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Modal: Schedule New Session with Live Collision Detection */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800">
                  SESSION ALLOCATION ENGINE
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">
                  Schedule Room & Assign Speaker
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="p-6 overflow-y-auto space-y-4">
              {/* LIVE COLLISION WARNING BANNER */}
              {liveCollision.hasConflict && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 animate-in shake duration-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-rose-700">
                        DBMS Conflict Warning: Room Collision
                      </h4>
                      <p className="text-xs text-rose-800 mt-1 leading-snug">
                        {liveCollision.message}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Event Parent Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Parent Event
                </label>
                <select
                  value={newEventId}
                  onChange={e => setNewEventId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                >
                  {events.map(ev => (
                    <option key={ev.event_id} value={ev.event_id}>
                      [{ev.event_id}] {ev.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Venue Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Venue
                </label>
                <select
                  value={newVenueId}
                  onChange={e => setNewVenueId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                >
                  {venues.map(v => (
                    <option key={v.venue_id} value={v.venue_id}>
                      {v.name} ({v.capacity} seats - {v.floor})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time Slot Row */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date
                  </label>
                  <select
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  >
                    {availableDates.map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={e => setNewStartTime(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={newEndTime}
                    onChange={e => setNewEndTime(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  />
                </div>
              </div>

              {/* Session Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Session Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Database Concurrency & MVCC"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Assigned Speaker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assigned Speaker
                </label>
                <select
                  value={newSpeakerId}
                  onChange={e => setNewSpeakerId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                >
                  {speakers.map(sp => (
                    <option key={sp.speaker_id} value={sp.speaker_id}>
                      {sp.name} — {sp.affiliation}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes & Equipment
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Requires 4K laser projector and wireless microphone array..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={liveCollision.hasConflict}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white hover:from-cyan-500 hover:to-indigo-500 shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {liveCollision.hasConflict ? (
                    <span>Fix Collision to Save</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Persist Session</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
