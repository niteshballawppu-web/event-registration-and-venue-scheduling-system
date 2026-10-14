/**
 * Institutional Event Registration & Venue Scheduling System
 * Relational DBMS Architecture (3NF Normalization)
 * Core Entities: 12 Tables
 */

export type Role = 'COORDINATOR' | 'PARTICIPANT' | 'SPEAKER' | 'ADMIN';

// 1. CATEGORIES
export interface Category {
  category_id: string; // PK: e.g. 'CAT-01'
  name: string;
  code: string;
  description: string;
  color_token: string; // e.g. 'indigo', 'emerald', 'violet', 'amber'
}

// 2. COORDINATORS
export interface Coordinator {
  coordinator_id: string; // PK: e.g. 'COORD-01'
  name: string;
  email: string;
  department: string;
  phone: string;
  avatar_url?: string;
}

// 3. SPEAKERS
export interface Speaker {
  speaker_id: string; // PK: e.g. 'SPK-01'
  name: string;
  affiliation: string;
  bio: string;
  specialty: string;
  email: string;
  phone: string;
  avatar_url?: string;
}

// 4. VENUES
export interface Venue {
  venue_id: string; // PK: e.g. 'VEN-01'
  name: string;
  building: string;
  floor: string;
  capacity: number;
  equipment: string[]; // ['4K Projector', 'Wireless Lapel', 'Confidence Monitor', 'Podium AV']
  is_active: boolean;
}

// 5. EVENTS
export interface InstitutionalEvent {
  event_id: string; // PK: e.g. 'EVT-2026-001'
  category_id: string; // FK -> CATEGORIES.category_id
  coordinator_id: string; // FK -> COORDINATORS.coordinator_id
  title: string;
  description: string;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  cert_threshold_pct: number; // e.g., 75 (attendance percentage required)
  fee: number; // e.g. 0.00 for free, 45.00 for paid
  max_capacity: number;
  status: 'DRAFT' | 'PUBLISHED' | 'COMPLETED' | 'CANCELLED';
  banner_color: string;
  location_summary: string;
}

// 6. SESSIONS
export interface Session {
  session_id: string; // PK: e.g. 'SES-101'
  event_id: string; // FK -> EVENTS.event_id
  venue_id: string; // FK -> VENUES.venue_id
  speaker_id: string; // FK -> SPEAKERS.speaker_id
  title: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:mm (24hr e.g. '09:00')
  end_time: string; // HH:mm (24hr e.g. '10:30')
  description: string;
  equipment_needed: string[];
}

// 7. PARTICIPANTS
export interface Participant {
  participant_id: string; // PK: e.g. 'PT-01'
  name: string;
  email: string;
  student_id: string; // e.g. 'STU-2024-881'
  institution: string;
  department: string;
  phone: string;
  avatar_url?: string;
}

// 8. REGISTRATIONS
export interface Registration {
  registration_id: string; // PK: e.g. 'REG-901'
  participant_id: string; // FK -> PARTICIPANTS.participant_id
  event_id: string; // FK -> EVENTS.event_id
  registered_at: string; // ISO string
  status: 'CONFIRMED' | 'PENDING_PAYMENT' | 'CANCELLED' | 'WAITLIST';
  qr_code_token: string;
  notes?: string;
}

// 9. PAYMENTS
export interface Payment {
  payment_id: string; // PK: e.g. 'PAY-501'
  registration_id: string; // FK -> REGISTRATIONS.registration_id
  amount: number; // STRICTLY > 0 (or 0 for waived/free pass)
  payment_method: 'CREDIT_CARD' | 'UPI' | 'STUDENT_BILLING' | 'BURSAR_ACCOUNT' | 'COMPLIMENTARY';
  transaction_ref: string;
  status: 'COMPLETED' | 'PENDING' | 'REFUNDED' | 'FAILED';
  paid_at: string; // ISO string
  invoice_number: string;
}

// 10. ATTENDANCE
export interface Attendance {
  attendance_id: string; // PK: e.g. 'ATT-1001'
  registration_id: string; // FK -> REGISTRATIONS.registration_id
  session_id: string; // FK -> SESSIONS.session_id
  check_in_time: string; // ISO string
  status: 'PRESENT' | 'EXCUSED' | 'ABSENT';
  verified_by: string; // e.g. Coordinator ID or Scanner ID
}

// 11. CERTIFICATES
export interface Certificate {
  certificate_id: string; // PK: e.g. 'CERT-2026-789'
  registration_id: string; // FK -> REGISTRATIONS.registration_id
  issue_date: string; // YYYY-MM-DD
  verification_hash: string; // SHA-like token e.g. 'NEXUS-7A89B2CF'
  attendance_pct: number;
  qr_verification_url: string;
}

// 12. FEEDBACK
export interface Feedback {
  feedback_id: string; // PK: e.g. 'FDB-301'
  registration_id: string; // FK -> REGISTRATIONS.registration_id
  overall_rating: number; // 1-5
  content_rating: number; // 1-5
  venue_rating: number; // 1-5
  organization_rating: number; // 1-5
  comments: string;
  submitted_at: string;
}

// UI & Filter Types
export interface EventFilterState {
  searchQuery: string;
  categoryId: string;
  venueId: string;
  dateRange: 'ALL' | 'TODAY' | 'UPCOMING' | 'THIS_MONTH';
  feeType: 'ALL' | 'FREE' | 'PAID';
}

export interface CollisionWarning {
  hasConflict: boolean;
  conflictingSession?: Session;
  conflictingVenue?: Venue;
  message?: string;
}

// DBMS Schema Metadata for 3NF Visualizer
export interface EntitySchemaMeta {
  tableName: string;
  description: string;
  primaryKey: string[];
  foreignKeys: { column: string; referencesTable: string; referencesColumn: string }[];
  uniqueKeys?: string[][];
  checkConstraints?: string[];
  attributes: {
    name: string;
    type: string;
    nullable: boolean;
    isPk?: boolean;
    isFk?: boolean;
    references?: string;
    description: string;
  }[];
}
