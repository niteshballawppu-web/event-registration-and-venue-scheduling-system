import React, { useRef } from 'react';
import { Certificate, InstitutionalEvent, Participant } from '../types/database';
import {
  X,
  Printer,
  Download,
  Award,
  ShieldCheck,
  QrCode,
  Sparkles,
  Building2
} from 'lucide-react';

interface CertificateModalProps {
  certificate: Certificate;
  event: InstitutionalEvent;
  participant: Participant;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  event,
  participant,
  onClose
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden flex flex-col max-h-[95vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-mono font-medium tracking-wider text-slate-300">
              OFFICIAL ACADEMIC CREDENTIAL VERIFICATION
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas Area */}
        <div className="p-8 sm:p-12 overflow-y-auto bg-slate-50 flex items-center justify-center">
          <div
            ref={printRef}
            className="w-full max-w-2xl bg-white border-8 border-double border-slate-300 rounded-2xl p-8 sm:p-12 shadow-xl relative overflow-hidden text-center font-serif text-slate-900"
          >
            {/* Background watermark seal */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
              <Award className="w-96 h-96 text-slate-900" />
            </div>

            {/* Institutional Header */}
            <div className="space-y-1 mb-6 border-b border-slate-200 pb-5">
              <div className="flex items-center justify-center gap-2 text-indigo-900 font-sans font-bold text-sm tracking-widest uppercase">
                <Building2 className="w-4 h-4 text-indigo-700" />
                <span>NEXUS INSTITUTE OF ADVANCED STUDIES & RESEARCH</span>
              </div>
              <div className="text-[11px] font-sans text-slate-500 uppercase tracking-widest">
                Division of Academic Affairs & Technical Colloquia
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2 mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-wide uppercase">
                Certificate of Completion
              </h1>
              <p className="text-xs font-sans text-slate-600 italic">
                This is officially conferred upon verification of attendance thresholds to
              </p>
            </div>

            {/* Student Name */}
            <div className="my-6 py-2 border-b-2 border-indigo-900/20 max-w-md mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-indigo-950 font-serif italic tracking-wide">
                {participant.name}
              </h2>
              <div className="text-xs font-sans font-mono text-slate-500 mt-1">
                Student ID: {participant.student_id} · {participant.institution}
              </div>
            </div>

            {/* Description Body */}
            <p className="text-xs sm:text-sm text-slate-700 max-w-lg mx-auto leading-relaxed font-sans mb-8">
              For distinguished participation and successful fulfillment of attendance in the institutional program:
              <br />
              <strong className="text-slate-950 font-semibold block text-base mt-2">
                "{event.title}"
              </strong>
              <span className="text-xs text-slate-500 mt-1 block">
                Audited Session Attendance: <strong className="text-emerald-700 font-mono">{certificate.attendance_pct}%</strong> (Required Minimum: {event.cert_threshold_pct}%)
              </span>
            </p>

            {/* Signatures & Seal Footer */}
            <div className="grid grid-cols-3 items-end pt-6 border-t border-slate-200 text-xs font-sans">
              <div className="text-center">
                <div className="font-serif italic font-semibold text-slate-800 text-sm mb-1">
                  Dr. Aris Thorne
                </div>
                <div className="w-28 h-px bg-slate-300 mx-auto mb-1" />
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                  Event Coordinator
                </span>
              </div>

              {/* Central Gold Seal Badge */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 p-1 shadow-md flex items-center justify-center">
                  <div className="w-full h-full rounded-full border-2 border-dashed border-amber-800/40 flex flex-col items-center justify-center text-amber-950">
                    <ShieldCheck className="w-6 h-6 text-amber-900" />
                    <span className="text-[7px] font-bold tracking-tighter uppercase font-mono">
                      SEAL
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-slate-400 mt-1">
                  Issued: {certificate.issue_date}
                </span>
              </div>

              <div className="text-center">
                <div className="font-serif italic font-semibold text-slate-800 text-sm mb-1">
                  Prof. Clara Chen
                </div>
                <div className="w-28 h-px bg-slate-300 mx-auto mb-1" />
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                  Dean of Academic Registry
                </span>
              </div>
            </div>

            {/* Cryptographic Hash Bar */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-slate-500" />
                <span>HASH: {certificate.verification_hash}</span>
              </div>
              <span>CERTIFICATE ID: {certificate.certificate_id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
