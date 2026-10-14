import React, { useState, useMemo } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { InstitutionalEvent } from '../types/database';
import { getCategoryStyle, CATEGORY_COLORS } from '../utils/theme';
import {
  Search,
  Calendar,
  MapPin,
  Users,
  Award,
  Plus,
  ArrowRight,
  CheckCircle2,
  Building,
  GraduationCap,
  Sparkles,
  Layers
} from 'lucide-react';
import { RegistrationModal } from './RegistrationModal';
import { EventDetailModal } from './EventDetailModal';

interface EventsDirectoryProps {
  onNavigateToPortal?: () => void;
  onOpenCreateEvent?: () => void;
}

export const EventsDirectory: React.FC<EventsDirectoryProps> = ({
  onNavigateToPortal,
  onOpenCreateEvent
}) => {
  const {
    events,
    categories,
    venues,
    registrations,
    role,
    currentParticipant,
    isParticipantAlreadyRegistered,
    getEventRemainingCapacity
  } = useDatabase();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedFeeType, setSelectedFeeType] = useState<'ALL' | 'FREE' | 'PAID'>('ALL');

  const [selectedEventForModal, setSelectedEventForModal] = useState<InstitutionalEvent | null>(null);
  const [selectedEventForRegister, setSelectedEventForRegister] = useState<InstitutionalEvent | null>(null);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter(evt => {
      const matchesSearch =
        evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.event_id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'ALL' || evt.category_id === selectedCategory;

      const matchesFee =
        selectedFeeType === 'ALL' ||
        (selectedFeeType === 'FREE' && evt.fee === 0) ||
        (selectedFeeType === 'PAID' && evt.fee > 0);

      return matchesSearch && matchesCategory && matchesFee;
    });
  }, [events, searchQuery, selectedCategory, selectedFeeType]);

  const totalConfirmed = registrations.filter(r => r.status === 'CONFIRMED').length;
  const freeEventsCount = events.filter(e => e.fee === 0).length;

  return (
    <div className="space-y-6">
      {/* Radiant Multi-Color Hero Showcase */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-7 sm:p-10 shadow-xl border border-slate-800">
        {/* Multi-color ambient background glows */}
        <div className="absolute -top-12 -left-12 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-10 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-1/3 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-cyan-300 text-xs font-mono font-medium mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Institutional Event & Colloquium Registry</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Academic Symposia, Research Labs & Cultural Festivals
          </h1>

          <p className="text-sm text-slate-300 mt-2.5 max-w-2xl leading-relaxed">
            Real-time enrollment backed by 3NF relational integrity. Zero double-booking tolerance, live capacity allocation, and verified credential certificates.
          </p>
        </div>

        {/* Action Button for Coordinators */}
        {(role === 'COORDINATOR' || role === 'ADMIN') && onOpenCreateEvent && (
          <div className="mt-6 sm:mt-0 sm:absolute sm:top-10 sm:right-10 z-20">
            <button
              onClick={onOpenCreateEvent}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-lg active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          </div>
        )}
      </div>

      {/* 4 Multi-Color Visual Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Violet - Total Events */}
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50/70 border border-violet-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-violet-700 font-semibold">
            <span>Published Events</span>
            <span className="w-2 h-2 rounded-full bg-violet-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-violet-950 mt-1">
            {events.length}
          </div>
          <div className="text-[11px] text-violet-600/90 mt-0.5">
            5 Distinct Categories
          </div>
        </div>

        {/* Card 2: Cyan - Active Venues */}
        <div className="bg-gradient-to-br from-cyan-50 to-teal-50/70 border border-cyan-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-cyan-800 font-semibold">
            <span>Campus Venues</span>
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-950 mt-1">
            {venues.length}
          </div>
          <div className="text-[11px] text-cyan-700/90 mt-0.5">
            Auditoriums & High-Tech Labs
          </div>
        </div>

        {/* Card 3: Emerald - Confirmed Attendees */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/70 border border-emerald-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold">
            <span>Confirmed Attendees</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-950 mt-1">
            {totalConfirmed}
          </div>
          <div className="text-[11px] text-emerald-700/90 mt-0.5">
            Active Digital Passes
          </div>
        </div>

        {/* Card 4: Amber - Free Passes */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/70 border border-amber-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-amber-800 font-semibold">
            <span>Complimentary Events</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-950 mt-1">
            {freeEventsCount} Free Passes
          </div>
          <div className="text-[11px] text-amber-700/90 mt-0.5">
            Sponsored Plenaries & Keynotes
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by event title, syllabus keyword, or ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Fee Filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            {(['ALL', 'FREE', 'PAID'] as const).map(type => (
              <button
                key={type}
                onClick={() => setSelectedFeeType(type)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  selectedFeeType === type
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {type === 'ALL' ? 'All Fees' : type === 'FREE' ? 'Free Passes' : 'Paid Admission'}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills Filter with Matching Theme Colors */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all font-medium ${
              selectedCategory === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories ({events.length})
          </button>
          {categories.map(cat => {
            const count = events.filter(e => e.category_id === cat.category_id).length;
            const isSelected = selectedCategory === cat.category_id;
            const style = getCategoryStyle(cat.category_id);

            return (
              <button
                key={cat.category_id}
                onClick={() => setSelectedCategory(cat.category_id)}
                className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all font-medium ${
                  isSelected
                    ? `bg-gradient-to-r ${style.gradient} text-white shadow-xs font-semibold`
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-800 text-sm">No Events Match Filter</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Try adjusting your search query, fee filter, or category selector.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
              setSelectedFeeType('ALL');
            }}
            className="mt-4 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => {
            const category = categories.find(c => c.category_id === event.category_id);
            const style = getCategoryStyle(event.category_id);
            const capacity = getEventRemainingCapacity(event.event_id);
            const isRegistered = isParticipantAlreadyRegistered(
              currentParticipant.participant_id,
              event.event_id
            );
            const percentFilled = Math.min(
              100,
              Math.round((capacity.registeredCount / capacity.totalCapacity) * 100)
            );

            return (
              <div
                key={event.event_id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Top Category Gradient Stripe */}
                <div className={`h-2 w-full bg-gradient-to-r ${style.gradient}`} />

                {/* Card Top Info */}
                <div className="p-6 pb-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-500 font-semibold">
                      {event.event_id}
                    </span>
                    <span className={`font-semibold px-2.5 py-0.5 rounded-md ${style.bgLight} ${style.text}`}>
                      {category?.name || 'Academic'}
                    </span>
                  </div>

                  <h3
                    onClick={() => setSelectedEventForModal(event)}
                    className="font-bold text-slate-900 text-base leading-snug line-clamp-2 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    {event.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Clean Unboxed Metadata Line (per zero-pill discipline) */}
                  <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-medium text-slate-700">
                        {event.location_summary}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{event.start_date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-indigo-600 font-medium">
                        <Award className="w-3.5 h-3.5 shrink-0" />
                        <span>{event.cert_threshold_pct}% req.</span>
                      </div>
                    </div>
                  </div>

                  {/* Multi-Color Capacity Bar */}
                  <div className="pt-1">
                    <div className="flex justify-between text-[11px] mb-1 font-mono">
                      <span className="text-slate-500">Live Capacity</span>
                      <span className={capacity.isFull ? 'text-rose-600 font-semibold' : 'text-slate-700'}>
                        {capacity.registeredCount}/{capacity.totalCapacity} ({capacity.remaining} left)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          capacity.isFull
                            ? 'bg-rose-500'
                            : percentFilled > 80
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percentFilled}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 px-6 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Fee</span>
                    <span className="text-sm font-bold text-slate-900 font-mono">
                      {event.fee === 0 ? 'FREE' : `$${event.fee.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedEventForModal(event)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
                    >
                      Details
                    </button>

                    {isRegistered ? (
                      <button
                        onClick={onNavigateToPortal}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>My Pass</span>
                      </button>
                    ) : capacity.isFull ? (
                      <span className="px-3.5 py-1.5 text-xs font-medium rounded-xl bg-slate-200 text-slate-500 cursor-not-allowed">
                        Full
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedEventForRegister(event)}
                        className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r ${style.gradient} text-white shadow-xs transition-all active:scale-95`}
                      >
                        <span>Register</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedEventForModal && (
        <EventDetailModal
          event={selectedEventForModal}
          onClose={() => setSelectedEventForModal(null)}
          onOpenRegister={evt => {
            setSelectedEventForModal(null);
            setSelectedEventForRegister(evt);
          }}
        />
      )}

      {/* Registration Checkout Modal */}
      {selectedEventForRegister && (
        <RegistrationModal
          event={selectedEventForRegister}
          onClose={() => setSelectedEventForRegister(null)}
          onSuccessNavigate={onNavigateToPortal}
        />
      )}
    </div>
  );
};
