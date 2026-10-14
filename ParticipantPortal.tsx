import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { InstitutionalEvent, Registration, Session, Certificate } from '../types/database';
import { getCategoryStyle } from '../utils/theme';
import {
  QrCode,
  CheckCircle2,
  Lock,
  Award,
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  FileText,
  UserCheck,
  Building,
  GraduationCap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Receipt,
  Ticket
} from 'lucide-react';
import { CertificateModal } from './CertificateModal';
import { FeedbackModal } from './FeedbackModal';

export const ParticipantPortal: React.FC = () => {
  const {
    currentParticipant,
    registrations,
    events,
    sessions,
    venues,
    attendances,
    payments,
    feedbacks,
    getParticipantAttendanceProgress,
    toggleAttendance
  } = useDatabase();

  const [expandedRegId, setExpandedRegId] = useState<string | null>(null);
  const [selectedCert, setSelectedCert] = useState<{
    certificate: Certificate;
    event: InstitutionalEvent;
  } | null>(null);
  const [selectedFeedbackReg, setSelectedFeedbackReg] = useState<{
    registration: Registration;
    event: InstitutionalEvent;
  } | null>(null);

  const myRegistrations = registrations.filter(
    r => r.participant_id === currentParticipant.participant_id && r.status !== 'CANCELLED'
  );

  return (
    <div className="space-y-6">
      {/* Student Identity Card with Vibrant Accents */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-violet-600 text-white overflow-hidden shrink-0 flex items-center justify-center font-bold text-xl shadow-md">
            {currentParticipant.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {currentParticipant.name}
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                ACTIVE STUDENT
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-mono font-medium text-slate-700">
                ID: {currentParticipant.student_id}
              </span>
              <span>·</span>
              <span>{currentParticipant.department}</span>
              <span>·</span>
              <span>{currentParticipant.institution}</span>
            </div>
          </div>
        </div>

        {/* Quick Multi-Color Summary Cards */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-4 py-2.5 bg-cyan-50/80 border border-cyan-200 rounded-2xl text-cyan-950">
            <span className="text-cyan-700 block text-[10px] uppercase font-semibold">Enrolled Passes</span>
            <span className="font-bold text-base">{myRegistrations.length}</span>
          </div>
          <div className="px-4 py-2.5 bg-violet-50/80 border border-violet-200 rounded-2xl text-violet-950">
            <span className="text-violet-700 block text-[10px] uppercase font-semibold">Certificates</span>
            <span className="font-bold text-base">
              {
                myRegistrations.filter(
                  r => getParticipantAttendanceProgress(r.registration_id).isEligibleForCert
                ).length
              } Unlocked
            </span>
          </div>
        </div>
      </div>

      {/* Main Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            My Registered Events & Credentials
          </h3>
          <p className="text-xs text-slate-500">
            Scan QR code for hall admission. Check-in to sessions to meet threshold and unlock Certificate of Completion.
          </p>
        </div>
      </div>

      {/* Registrations List */}
      {myRegistrations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-slate-800">No Active Registrations</h4>
          <p className="text-xs text-slate-500 mt-1">
            You have not registered for any events yet. Explore the Event Directory to enroll.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {myRegistrations.map(reg => {
            const event = events.find(e => e.event_id === reg.event_id);
            if (!event) return null;

            const categoryStyle = getCategoryStyle(event.category_id);
            const progress = getParticipantAttendanceProgress(reg.registration_id);
            const payment = payments.find(p => p.registration_id === reg.registration_id);
            const feedback = feedbacks.find(f => f.registration_id === reg.registration_id);
            const eventSessions = sessions.filter(s => s.event_id === reg.event_id);
            const isExpanded = expandedRegId === reg.registration_id;

            return (
              <div
                key={reg.registration_id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden transition-all"
              >
                {/* Event Category Stripe */}
                <div className={`h-2.5 w-full bg-gradient-to-r ${categoryStyle.gradient}`} />

                {/* Main Pass Row */}
                <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Left: Event Info & Pass ID */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-slate-700">
                        PASS: {reg.registration_id}
                      </span>
                      <span>·</span>
                      <span className={`font-semibold ${categoryStyle.text}`}>
                        {event.event_id}
                      </span>
                      <span>·</span>
                      <span className="font-medium text-emerald-700">
                        {reg.status}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-slate-900 leading-snug">
                      {event.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{event.location_summary}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{event.start_date}</span>
                      </div>
                      {payment && (
                        <div className="flex items-center gap-1 font-mono text-slate-600">
                          <Receipt className="w-3 h-3 text-slate-400" />
                          <span>{payment.invoice_number} (${payment.amount.toFixed(2)})</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Attendance Threshold Gauge & Action CTAs */}
                  <div className="flex flex-wrap items-center gap-3 lg:border-l lg:border-slate-100 lg:pl-6">
                    {/* Attendance % Metric with Multi-Color Bar */}
                    <div className="w-44">
                      <div className="flex justify-between text-[11px] mb-1 font-mono">
                        <span className="text-slate-500">Session Progress</span>
                        <span
                          className={`font-bold ${
                            progress.isEligibleForCert ? 'text-emerald-600' : 'text-amber-600'
                          }`}
                        >
                          {progress.percentage}% / {progress.thresholdPct}% req
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 rounded-full ${
                            progress.isEligibleForCert
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                              : 'bg-gradient-to-r from-amber-400 to-orange-500'
                          }`}
                          style={{ width: `${Math.min(100, progress.percentage)}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">
                        {progress.attendedSessions} of {progress.totalSessions} sessions verified
                      </div>
                    </div>

                    {/* Certificate Action */}
                    {progress.isEligibleForCert && progress.certificate ? (
                      <button
                        onClick={() =>
                          setSelectedCert({
                            certificate: progress.certificate!,
                            event
                          })
                        }
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md hover:from-amber-600 hover:to-orange-600 transition-all active:scale-95"
                      >
                        <Award className="w-4 h-4 text-amber-200" />
                        <span>View Diploma 🎓</span>
                      </button>
                    ) : (
                      <div
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono rounded-xl bg-slate-100 text-slate-400 border border-slate-200"
                        title={`Locked until ${progress.thresholdPct}% attendance reached`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Cert Locked</span>
                      </div>
                    )}

                    {/* Feedback Form Button */}
                    <button
                      onClick={() =>
                        setSelectedFeedbackReg({
                          registration: reg,
                          event
                        })
                      }
                      className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl border transition-colors ${
                        feedback
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span>{feedback ? 'Rated (★)' : 'Feedback'}</span>
                    </button>

                    {/* Expand/Collapse Sessions Tracker */}
                    <button
                      onClick={() => setExpandedRegId(isExpanded ? null : reg.registration_id)}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Toggle Session Check-in Log"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expandable Session Log & Interactive Check-in Simulator */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/80 p-6 space-y-4 animate-in fade-in duration-150">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                          Session Attendance & Real-Time Check-In Simulator
                        </span>
                        <span className="text-xs text-slate-500">
                          Simulate door RFID/QR scanning to test attendance threshold unlocking in real-time.
                        </span>
                      </div>

                      {/* Scannable Token Badge */}
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shrink-0">
                        <QrCode className="w-4 h-4 text-cyan-600" />
                        <span>Pass Token: {reg.qr_code_token.slice(0, 18)}...</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {eventSessions.map(session => {
                        const venue = venues.find(v => v.venue_id === session.venue_id);
                        const isAttended = attendances.some(
                          a =>
                            a.registration_id === reg.registration_id &&
                            a.session_id === session.session_id &&
                            a.status === 'PRESENT'
                        );

                        return (
                          <div
                            key={session.session_id}
                            className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                              isAttended
                                ? 'bg-white border-emerald-300 shadow-xs'
                                : 'bg-white border-slate-200'
                            }`}
                          >
                            <div className="space-y-1 min-w-0 pr-3">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono font-semibold text-slate-500">
                                  {session.session_id}
                                </span>
                                <span className="text-xs font-bold text-slate-900 truncate">
                                  {session.title}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-2 font-mono">
                                <span>{session.start_time} - {session.end_time}</span>
                                <span>·</span>
                                <span>{venue?.name || 'Assigned Hall'}</span>
                              </div>
                            </div>

                            {/* Interactive Check-in Toggle Button */}
                            <button
                              onClick={() => toggleAttendance(reg.registration_id, session.session_id)}
                              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                isAttended
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xs'
                              }`}
                            >
                              <CheckCircle2
                                className={`w-3.5 h-3.5 ${
                                  isAttended ? 'text-emerald-600' : 'text-slate-400'
                                }`}
                              />
                              <span>{isAttended ? 'Present' : 'Check-in'}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Certificate Modal */}
      {selectedCert && (
        <CertificateModal
          certificate={selectedCert.certificate}
          event={selectedCert.event}
          participant={currentParticipant}
          onClose={() => setSelectedCert(null)}
        />
      )}

      {/* Feedback Modal */}
      {selectedFeedbackReg && (
        <FeedbackModal
          registration={selectedFeedbackReg.registration}
          event={selectedFeedbackReg.event}
          onClose={() => setSelectedFeedbackReg(null)}
        />
      )}
    </div>
  );
};
