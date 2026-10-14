import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { InstitutionalEvent, Payment } from '../types/database';
import { getCategoryStyle } from '../utils/theme';
import {
  X,
  CreditCard,
  Building,
  CheckCircle2,
  AlertCircle,
  QrCode,
  ShieldCheck,
  ArrowRight,
  Clock,
  MapPin,
  Award,
  Sparkles
} from 'lucide-react';

interface RegistrationModalProps {
  event: InstitutionalEvent;
  onClose: () => void;
  onSuccessNavigate?: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  event,
  onClose,
  onSuccessNavigate
}) => {
  const {
    currentParticipant,
    isParticipantAlreadyRegistered,
    getEventRemainingCapacity,
    registerParticipant
  } = useDatabase();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [paymentMethod, setPaymentMethod] = useState<Payment['payment_method']>(
    event.fee === 0 ? 'COMPLIMENTARY' : 'STUDENT_BILLING'
  );
  const [studentIdInput, setStudentIdInput] = useState(currentParticipant.student_id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedPass, setGeneratedPass] = useState<{
    registrationId: string;
    qrToken: string;
    invoiceNo: string;
  } | null>(null);

  const isAlreadyRegistered = isParticipantAlreadyRegistered(
    currentParticipant.participant_id,
    event.event_id
  );
  const capacityInfo = getEventRemainingCapacity(event.event_id);
  const categoryStyle = getCategoryStyle(event.category_id);

  const handleConfirmAndPay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const res = registerParticipant(
        event.event_id,
        paymentMethod,
        event.fee,
        { student_id: studentIdInput }
      );

      setIsProcessing(false);
      if (res.success && res.registration) {
        setGeneratedPass({
          registrationId: res.registration.registration_id,
          qrToken: res.registration.qr_code_token,
          invoiceNo: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`
        });
        setStep(4);
      }
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Category Gradient Stripe */}
        <div className={`h-2.5 w-full bg-gradient-to-r ${categoryStyle.gradient}`} />

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md ${categoryStyle.bgLight} ${categoryStyle.text}`}>
                {event.event_id}
              </span>
              <span className="text-xs text-slate-500 font-medium">Event Registration Flow</span>
            </div>
            <h3 className="font-bold text-slate-900 text-base mt-1 line-clamp-1">
              {event.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Integrity Constraint Alert if already registered */}
          {isAlreadyRegistered && step < 4 && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">DBMS Constraint Alert: UNIQUE Registration</h4>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                  Student <strong>{currentParticipant.name}</strong> ({currentParticipant.student_id}) is already registered for this event. Duplicate enrollments are prohibited by relational integrity rules.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    if (onSuccessNavigate) onSuccessNavigate();
                  }}
                  className="mt-3 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors"
                >
                  View My Existing Pass in Student Portal →
                </button>
              </div>
            </div>
          )}

          {/* Sold out alert if capacity reached */}
          {capacityInfo.isFull && !isAlreadyRegistered && step < 4 && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Capacity Limit Exceeded</h4>
                <p className="text-xs text-rose-700 mt-1">
                  All {capacityInfo.totalCapacity} seats for this venue have been allocated. New registrations are temporarily closed.
                </p>
              </div>
            </div>
          )}

          {/* Step 1: Verification & Participant Details */}
          {step === 1 && !isAlreadyRegistered && !capacityInfo.isFull && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Enrolled Student Identity</span>
                  <span className="font-mono text-emerald-600 font-semibold">PARTICIPANT PK: {currentParticipant.participant_id}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <label className="text-xs text-slate-500">Student Name</label>
                    <div className="font-medium text-slate-900">{currentParticipant.name}</div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Institutional Email</label>
                    <div className="font-medium text-slate-900 truncate">{currentParticipant.email}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Student ID (Verified Against Campus Registry)
                  </label>
                  <input
                    type="text"
                    value={studentIdInput}
                    onChange={e => setStudentIdInput(e.target.value)}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. STU-2024-881"
                  />
                </div>
              </div>

              {/* Event Details Card */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-slate-800">{event.location_summary}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Scheduled: {event.start_date} to {event.end_date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-indigo-500" />
                  <span>
                    Certificate Requirement: <strong className="text-indigo-600">{event.cert_threshold_pct}% Attendance</strong>
                  </span>
                </div>
              </div>

              {/* Capacity Banner */}
              <div className="flex items-center justify-between text-xs bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                <span className="text-slate-600">Remaining Venue Capacity:</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {capacityInfo.remaining} / {capacityInfo.totalCapacity} seats available
                </span>
              </div>
            </div>
          )}

          {/* Step 2: Payment & Billing Review */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Tuition & Registration Fee
                </h4>
                <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-2">
                  <span className="text-slate-600">Standard Institutional Fee</span>
                  <span className="font-mono font-medium">${(event.fee + 15).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-2 text-emerald-600">
                  <span>Student Subsidized Grant</span>
                  <span className="font-mono">-$15.00</span>
                </div>
                <div className="flex justify-between items-center text-base font-bold text-slate-900 pt-1">
                  <span>Total Payable:</span>
                  <span className="font-mono text-indigo-600">
                    {event.fee === 0 ? 'FREE (Waiver)' : `$${event.fee.toFixed(2)}`}
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              {event.fee > 0 ? (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Select Billing Method
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('STUDENT_BILLING')}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                        paymentMethod === 'STUDENT_BILLING'
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-medium'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Building className="w-4 h-4 text-indigo-600" />
                        <div>
                          <div className="font-semibold">Direct Campus Bursar Account</div>
                          <div className="text-[11px] text-slate-500">Billed to student balance ID: {studentIdInput}</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-600 font-semibold">INSTANT</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CREDIT_CARD')}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                        paymentMethod === 'CREDIT_CARD'
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-medium'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <CreditCard className="w-4 h-4 text-indigo-600" />
                        <div>
                          <div className="font-semibold">Credit / Debit Card</div>
                          <div className="text-[11px] text-slate-500">Mock Stripe Gateway (Instant Sandbox)</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">•••• 4242</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                        paymentMethod === 'UPI'
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-medium'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <QrCode className="w-4 h-4 text-indigo-600" />
                        <div>
                          <div className="font-semibold">Institutional UPI / QR</div>
                          <div className="text-[11px] text-slate-500">Fast mobile banking portal</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">vpa@inst</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Complimentary Institutional Event. No financial transaction required.</span>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Success Confirmed with Digital Ticket Pass & QR */}
          {step === 4 && generatedPass && (
            <div className="space-y-4 text-center py-2 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Registration Confirmed!</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your seat has been reserved in <strong>{event.location_summary}</strong>
                </p>
              </div>

              {/* Digital Pass Card */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xl text-left relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-28 h-28 bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />
                <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">
                      Institutional Pass
                    </span>
                    <div className="font-bold text-sm text-white line-clamp-1">{event.title}</div>
                  </div>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {generatedPass.registrationId}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 my-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Attendee</span>
                    <span className="font-semibold text-slate-200">{currentParticipant.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Student ID</span>
                    <span className="font-mono text-slate-200">{studentIdInput}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Date</span>
                    <span className="text-slate-200">{event.start_date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Cert Threshold</span>
                    <span className="text-indigo-400 font-semibold">{event.cert_threshold_pct}% Required</span>
                  </div>
                </div>

                {/* Simulated QR Code Component */}
                <div className="bg-white rounded-xl p-3 flex items-center justify-between text-slate-900 mt-2">
                  <div className="flex items-center gap-3">
                    {/* SVG Vector QR Representation */}
                    <div className="w-12 h-12 bg-slate-950 p-1 rounded flex items-center justify-center shrink-0">
                      <QrCode className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-[11px] font-mono font-semibold text-slate-800">
                        {generatedPass.qrToken.slice(0, 18)}...
                      </div>
                      <div className="text-[10px] text-slate-500">Scan at Hall Entrance for Check-in</div>
                    </div>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          {step === 1 && !isAlreadyRegistered && !capacityInfo.isFull && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className={`flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r ${categoryStyle.gradient} text-white shadow-sm transition-all active:scale-95`}
              >
                <span>Proceed to Billing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmAndPay}
                className="flex items-center gap-2 px-6 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authorizing DBMS Transaction...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Authorize & Issue Digital Pass</span>
                  </>
                )}
              </button>
            </>
          )}

          {step === 4 && (
            <div className="w-full flex items-center justify-between">
              <button
                onClick={onClose}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium"
              >
                Close Window
              </button>
              <button
                onClick={() => {
                  onClose();
                  if (onSuccessNavigate) onSuccessNavigate();
                }}
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all"
              >
                Go to My Student Portal →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
