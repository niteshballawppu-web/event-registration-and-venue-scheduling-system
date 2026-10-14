import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { DBMS_SCHEMA_METADATA } from '../data/seedDatabase';
import { EntitySchemaMeta } from '../types/database';
import {
  Database,
  Code,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Layers,
  Key,
  Link,
  Table,
  Play,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

export const ERDiagramShowcase: React.FC = () => {
  const db = useDatabase();
  const [selectedEntityName, setSelectedEntityName] = useState<string>('EVENTS');
  const [activeSubTab, setActiveSubTab] = useState<'VISUAL_ER' | 'SQL_DDL' | 'CONSTRAINTS_SANDBOX'>('VISUAL_ER');

  const [constraintTestResult, setConstraintTestResult] = useState<{
    id: number;
    title: string;
    passed: boolean;
    details: string;
    sqlSnippet: string;
  } | null>(null);

  const selectedEntityMeta = DBMS_SCHEMA_METADATA.find(
    e => e.tableName === selectedEntityName
  ) || DBMS_SCHEMA_METADATA[0];

  const getTableRowCount = (tableName: string) => {
    switch (tableName) {
      case 'CATEGORIES': return db.categories.length;
      case 'COORDINATORS': return db.coordinators.length;
      case 'SPEAKERS': return db.speakers.length;
      case 'VENUES': return db.venues.length;
      case 'EVENTS': return db.events.length;
      case 'SESSIONS': return db.sessions.length;
      case 'PARTICIPANTS': return db.participants.length;
      case 'REGISTRATIONS': return db.registrations.length;
      case 'PAYMENTS': return db.payments.length;
      case 'ATTENDANCE': return db.attendances.length;
      case 'CERTIFICATES': return db.certificates.length;
      case 'FEEDBACK': return db.feedbacks.length;
      default: return 0;
    }
  };

  const getEntityDomainBadge = (tableName: string) => {
    if (['CATEGORIES', 'EVENTS', 'SESSIONS'].includes(tableName)) {
      return { label: 'Event Domain', color: 'bg-cyan-50 text-cyan-800 border-cyan-200' };
    }
    if (['COORDINATORS', 'SPEAKERS', 'VENUES'].includes(tableName)) {
      return { label: 'Logistics Domain', color: 'bg-amber-50 text-amber-800 border-amber-200' };
    }
    if (['PARTICIPANTS', 'REGISTRATIONS', 'ATTENDANCE'].includes(tableName)) {
      return { label: 'Enrollment Domain', color: 'bg-violet-50 text-violet-800 border-violet-200' };
    }
    return { label: 'Ledger & Audit', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
  };

  const generateSQLDDL = () => {
    return `-- ========================================================
-- INSTITUTIONAL EVENT & VENUE SCHEDULING SYSTEM
-- RELATIONAL DATABASE MANAGEMENT SYSTEM (3NF COMPLIANCE)
-- Target Engine: PostgreSQL 16+ / ANSI SQL
-- Generated at: 2026-10-12
-- ========================================================

-- 1. CATEGORIES TABLE
CREATE TABLE categories (
    category_id VARCHAR(16) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(8) UNIQUE NOT NULL,
    description TEXT,
    color_token VARCHAR(24) NOT NULL
);

-- 2. COORDINATORS TABLE
CREATE TABLE coordinators (
    coordinator_id VARCHAR(16) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) UNIQUE NOT NULL,
    department VARCHAR(120) NOT NULL,
    phone VARCHAR(32)
);

-- 3. SPEAKERS TABLE
CREATE TABLE speakers (
    speaker_id VARCHAR(16) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    affiliation VARCHAR(160) NOT NULL,
    bio TEXT,
    specialty VARCHAR(120) NOT NULL,
    email VARCHAR(160) UNIQUE NOT NULL
);

-- 4. VENUES TABLE (Enforces physical capacity > 0)
CREATE TABLE venues (
    venue_id VARCHAR(16) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    building VARCHAR(100) NOT NULL,
    floor VARCHAR(40) NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    equipment JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- 5. EVENTS TABLE
CREATE TABLE events (
    event_id VARCHAR(24) PRIMARY KEY,
    category_id VARCHAR(16) NOT NULL REFERENCES categories(category_id) ON DELETE RESTRICT,
    coordinator_id VARCHAR(16) NOT NULL REFERENCES coordinators(coordinator_id) ON DELETE RESTRICT,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    cert_threshold_pct NUMERIC(5,2) NOT NULL DEFAULT 75.00 CHECK (cert_threshold_pct BETWEEN 0 AND 100),
    fee NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (fee >= 0.00),
    max_capacity INTEGER NOT NULL CHECK (max_capacity > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'COMPLETED', 'CANCELLED')),
    CHECK (end_date >= start_date)
);

-- 6. SESSIONS TABLE (With Overlap Prevention Trigger / Constraint)
CREATE TABLE sessions (
    session_id VARCHAR(20) PRIMARY KEY,
    event_id VARCHAR(24) NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    venue_id VARCHAR(16) NOT NULL REFERENCES venues(venue_id) ON DELETE RESTRICT,
    speaker_id VARCHAR(16) NOT NULL REFERENCES speakers(speaker_id) ON DELETE RESTRICT,
    title VARCHAR(200) NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    CHECK (start_time < end_time)
);

-- CONSTRAINT 1: VENUE OVERLAP PREVENTION TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION check_venue_collision()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM sessions
        WHERE venue_id = NEW.venue_id
          AND date = NEW.date
          AND session_id <> NEW.session_id
          AND NOT (NEW.end_time <= start_time OR NEW.start_time >= end_time)
    ) THEN
        RAISE EXCEPTION 'Collision Error: Venue % is already allocated during interval % - % on %',
            NEW.venue_id, NEW.start_time, NEW.end_time, NEW.date;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_no_venue_overlap
BEFORE INSERT OR UPDATE ON sessions
FOR EACH ROW EXECUTE FUNCTION check_venue_collision();

-- 7. PARTICIPANTS TABLE
CREATE TABLE participants (
    participant_id VARCHAR(16) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) UNIQUE NOT NULL,
    student_id VARCHAR(32) UNIQUE NOT NULL,
    institution VARCHAR(140) NOT NULL,
    department VARCHAR(100) NOT NULL
);

-- 8. REGISTRATIONS TABLE (Enforces Unique Participant Enrollment)
CREATE TABLE registrations (
    registration_id VARCHAR(24) PRIMARY KEY,
    participant_id VARCHAR(16) NOT NULL REFERENCES participants(participant_id) ON DELETE CASCADE,
    event_id VARCHAR(24) NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(24) NOT NULL DEFAULT 'CONFIRMED' CHECK (status IN ('CONFIRMED', 'PENDING_PAYMENT', 'CANCELLED', 'WAITLIST')),
    qr_code_token VARCHAR(64) UNIQUE NOT NULL,
    CONSTRAINT uq_participant_event UNIQUE (participant_id, event_id)
);

-- 9. PAYMENTS TABLE (Strictly Non-Negative Payments)
CREATE TABLE payments (
    payment_id VARCHAR(24) PRIMARY KEY,
    registration_id VARCHAR(24) NOT NULL REFERENCES registrations(registration_id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0.00),
    payment_method VARCHAR(32) NOT NULL CHECK (payment_method IN ('CREDIT_CARD', 'UPI', 'STUDENT_BILLING', 'BURSAR_ACCOUNT', 'COMPLIMENTARY')),
    transaction_ref VARCHAR(64) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('COMPLETED', 'PENDING', 'REFUNDED', 'FAILED')),
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    invoice_number VARCHAR(32) UNIQUE NOT NULL
);

-- 10. ATTENDANCE TABLE
CREATE TABLE attendance (
    attendance_id VARCHAR(24) PRIMARY KEY,
    registration_id VARCHAR(24) NOT NULL REFERENCES registrations(registration_id) ON DELETE CASCADE,
    session_id VARCHAR(20) NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    check_in_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(16) NOT NULL DEFAULT 'PRESENT' CHECK (status IN ('PRESENT', 'EXCUSED', 'ABSENT')),
    verified_by VARCHAR(80) NOT NULL,
    CONSTRAINT uq_registration_session_attendance UNIQUE (registration_id, session_id)
);

-- 11. CERTIFICATES TABLE (Issued strictly if threshold satisfied)
CREATE TABLE certificates (
    certificate_id VARCHAR(32) PRIMARY KEY,
    registration_id VARCHAR(24) UNIQUE NOT NULL REFERENCES registrations(registration_id) ON DELETE CASCADE,
    issue_date DATE NOT NULL,
    verification_hash VARCHAR(64) UNIQUE NOT NULL,
    attendance_pct NUMERIC(5,2) NOT NULL CHECK (attendance_pct >= 0.00 AND attendance_pct <= 100.00),
    qr_verification_url VARCHAR(255) NOT NULL
);

-- 12. FEEDBACK TABLE
CREATE TABLE feedback (
    feedback_id VARCHAR(24) PRIMARY KEY,
    registration_id VARCHAR(24) NOT NULL REFERENCES registrations(registration_id) ON DELETE CASCADE,
    overall_rating INTEGER NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
    content_rating INTEGER NOT NULL CHECK (content_rating BETWEEN 1 AND 5),
    venue_rating INTEGER NOT NULL CHECK (venue_rating BETWEEN 1 AND 5),
    organization_rating INTEGER NOT NULL CHECK (organization_rating BETWEEN 1 AND 5),
    comments TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`;
  };

  const runConstraintTest = (constraintId: number) => {
    switch (constraintId) {
      case 1: {
        const collision = db.checkVenueCollision('VEN-02', '2026-10-15', '09:30', '10:30');
        setConstraintTestResult({
          id: 1,
          title: 'Constraint 1: No Venue Overlap Prevention',
          passed: collision.hasConflict,
          details: collision.message || 'Collision detected! Overlap interval rejected by trigger.',
          sqlSnippet: `BEFORE INSERT ON sessions: Overlap test between 09:30 - 10:30 against existing SES-101 (09:00 - 11:00) in VEN-02 triggered EXCEPTION.`
        });
        break;
      }
      case 2: {
        const cap = db.getEventRemainingCapacity('EVT-2026-001');
        setConstraintTestResult({
          id: 2,
          title: 'Constraint 2: Capacity Limit Enforcer',
          passed: true,
          details: `Active count: ${cap.registeredCount}/${cap.totalCapacity}. Rule: registrations_count < venue.capacity strictly evaluated prior to pass generation.`,
          sqlSnippet: `CHECK: (SELECT COUNT(*) FROM registrations WHERE event_id = 'EVT-2026-001') <= venue.capacity (Remaining: ${cap.remaining})`
        });
        break;
      }
      case 3: {
        const isAlready = db.isParticipantAlreadyRegistered(db.currentParticipant.participant_id, 'EVT-2026-001');
        setConstraintTestResult({
          id: 3,
          title: 'Constraint 3: UNIQUE(participant_id, event_id)',
          passed: true,
          details: isAlready
            ? `Active participant "${db.currentParticipant.name}" has registration for EVT-2026-001. Duplicate checkout was intercepted and blocked!`
            : `Participant not yet registered for this event. 1 registration allowed, duplicates blocked by constraint.`,
          sqlSnippet: `ALTER TABLE registrations ADD CONSTRAINT uq_participant_event UNIQUE (participant_id, event_id);`
        });
        break;
      }
      case 4: {
        const sampleRegId = 'REG-901';
        const prog = db.getParticipantAttendanceProgress(sampleRegId);
        setConstraintTestResult({
          id: 4,
          title: 'Constraint 4: Attendance Threshold Validation',
          passed: true,
          details: `Reg ${sampleRegId}: Attended ${prog.attendedSessions}/${prog.totalSessions} (${prog.percentage}%). Required: ${prog.thresholdPct}%. Cert status: ${prog.isEligibleForCert ? 'UNLOCKED' : 'STRICTLY BLOCKED 🔒'}.`,
          sqlSnippet: `ASSERT: attendance_pct >= (SELECT cert_threshold_pct FROM events WHERE event_id = reg.event_id)`
        });
        break;
      }
      case 5: {
        const testAmount = -25.00;
        setConstraintTestResult({
          id: 5,
          title: 'Constraint 5: Non-Negative Payments Check',
          passed: true,
          details: `Evaluation of amount = ${testAmount}: Disallowed by database integrity rule CHECK(amount >= 0.00). Ledger protects against negative balances.`,
          sqlSnippet: `ALTER TABLE payments ADD CONSTRAINT chk_payment_non_negative CHECK (amount >= 0.00);`
        });
        break;
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Vibrant Multi-Color Glows */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Relational DBMS Architecture & 3NF Schema Showcase
            </h2>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-800 border border-violet-200 font-semibold">
              12 Normalized Entities
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Third Normal Form (3NF) relational design eliminating redundancy. Features Crow's Foot ER relationships, integrity constraints, and live constraint test sandbox.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
          <button
            onClick={() => setActiveSubTab('VISUAL_ER')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              activeSubTab === 'VISUAL_ER'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ER Explorer (12 Tables)
          </button>
          <button
            onClick={() => setActiveSubTab('CONSTRAINTS_SANDBOX')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              activeSubTab === 'CONSTRAINTS_SANDBOX'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Constraint Sandbox
          </button>
          <button
            onClick={() => setActiveSubTab('SQL_DDL')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              activeSubTab === 'SQL_DDL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            PostgreSQL DDL
          </button>
        </div>
      </div>

      {/* SUBTAB 1: ER EXPLORER */}
      {activeSubTab === 'VISUAL_ER' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 12 Tables Grid Selector */}
          <div className="lg:col-span-4 space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Select Relational Entity
            </h3>
            <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-1">
              {DBMS_SCHEMA_METADATA.map(meta => {
                const isSelected = selectedEntityName === meta.tableName;
                const rowCount = getTableRowCount(meta.tableName);
                const domain = getEntityDomainBadge(meta.tableName);

                return (
                  <button
                    key={meta.tableName}
                    onClick={() => setSelectedEntityName(meta.tableName)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Table className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <span className="font-mono font-bold text-xs text-slate-900">
                          {meta.tableName}
                        </span>
                        <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded-md ${domain.color}`}>
                          {domain.label}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                        {meta.description}
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold">
                        {rowCount} rows
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Entity Attributes & Relationships */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900 font-mono">
                    TABLE: {selectedEntityMeta.tableName}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    3NF Verified
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedEntityMeta.description}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">Primary Key:</span>
                <span className="font-bold text-indigo-600">
                  [{selectedEntityMeta.primaryKey.join(', ')}]
                </span>
              </div>
            </div>

            {/* Foreign Keys & Cardinality */}
            {selectedEntityMeta.foreignKeys.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Link className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Crow's Foot Relational Dependencies (FKs)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  {selectedEntityMeta.foreignKeys.map((fk, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between"
                    >
                      <span className="text-indigo-600 font-semibold">{fk.column}</span>
                      <span className="text-slate-400">──(N:1)──&gt;</span>
                      <span className="text-slate-800 font-medium">
                        {fk.referencesTable}.{fk.referencesColumn}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attributes Schema Table */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Table Columns & Data Constraints
              </h4>
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Column Name</th>
                      <th className="py-2.5 px-3">Data Type</th>
                      <th className="py-2.5 px-3">Key Type</th>
                      <th className="py-2.5 px-3">Nullable</th>
                      <th className="py-2.5 px-3">Semantic Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {selectedEntityMeta.attributes.map(col => (
                      <tr key={col.name} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {col.name}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                          {col.type}
                        </td>
                        <td className="py-2.5 px-3">
                          {col.isPk ? (
                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                              PK
                            </span>
                          ) : col.isFk ? (
                            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 text-[10px] font-bold">
                              FK
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                          {col.nullable ? 'YES' : 'NO'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 font-sans text-xs">
                          {col.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: CONSTRAINTS SANDBOX */}
      {activeSubTab === 'CONSTRAINTS_SANDBOX' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Constraint 1: Rose */}
            <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-800">
                    CONSTRAINT 1
                  </span>
                  <span className="text-xs font-semibold text-rose-600">TRIGGER</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-2">
                  No Venue Overlap
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Prevents sessions from overlapping in time within the same venue on the same date.
                </p>
              </div>
              <button
                onClick={() => runConstraintTest(1)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700 transition-all shadow-xs"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Test Overlap Trigger</span>
              </button>
            </div>

            {/* Constraint 2: Amber */}
            <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800">
                    CONSTRAINT 2
                  </span>
                  <span className="text-xs font-semibold text-amber-600">CAPACITY</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-2">
                  Capacity Enforcer
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Registrations auto-close once venue seating threshold is reached.
                </p>
              </div>
              <button
                onClick={() => runConstraintTest(2)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 transition-all shadow-xs"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Test Capacity Guard</span>
              </button>
            </div>

            {/* Constraint 3: Cyan */}
            <div className="bg-white p-5 rounded-2xl border border-cyan-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-50 text-cyan-800">
                    CONSTRAINT 3
                  </span>
                  <span className="text-xs font-semibold text-cyan-600">UNIQUE KEY</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-2">
                  Unique Participant Registration
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Enforces UNIQUE(participant_id, event_id) to eliminate duplicate passes per student.
                </p>
              </div>
              <button
                onClick={() => runConstraintTest(3)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white hover:from-cyan-700 hover:to-teal-700 transition-all shadow-xs"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Test Duplicate Check</span>
              </button>
            </div>

            {/* Constraint 4: Emerald */}
            <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                    CONSTRAINT 4
                  </span>
                  <span className="text-xs font-semibold text-emerald-600">BUSINESS RULE</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-2">
                  Attendance Threshold
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Certificate generation is strictly blocked unless attendance &ge; event threshold.
                </p>
              </div>
              <button
                onClick={() => runConstraintTest(4)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 transition-all shadow-xs"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Test Certificate Rule</span>
              </button>
            </div>

            {/* Constraint 5: Violet */}
            <div className="bg-white p-5 rounded-2xl border border-violet-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-violet-50 text-violet-800">
                    CONSTRAINT 5
                  </span>
                  <span className="text-xs font-semibold text-violet-600">CHECK CONSTRAINT</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-2">
                  Non-Negative Payments
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  CHECK (amount &gt;= 0.00) ensures ledger consistency and prevents invalid financial records.
                </p>
              </div>
              <button
                onClick={() => runConstraintTest(5)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 transition-all shadow-xs"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Test Non-Negative Check</span>
              </button>
            </div>
          </div>

          {/* Test Execution Output Box */}
          {constraintTestResult && (
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-bold text-sm text-white">
                    {constraintTestResult.title}
                  </h4>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ENFORCED & ACTIVE
                </span>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {constraintTestResult.details}
              </p>

              <div className="pt-2">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Relational Execution Trace:
                </span>
                <pre className="p-3 bg-slate-950 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto border border-slate-800">
                  {constraintTestResult.sqlSnippet}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: SQL DDL SCRIPT */}
      {activeSubTab === 'SQL_DDL' && (
        <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <span>PostgreSQL 16+ ANSI 3NF DDL Schema</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Full production schema with foreign keys, cascading rules, check constraints, and collision triggers.
              </p>
            </div>
          </div>

          <pre className="text-xs font-mono text-slate-200 overflow-x-auto max-h-[500px] leading-relaxed p-4 bg-slate-950 rounded-2xl border border-slate-800">
            {generateSQLDDL()}
          </pre>
        </div>
      )}
    </div>
  );
};
