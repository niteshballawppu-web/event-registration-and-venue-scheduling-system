import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Role,
  Category,
  Coordinator,
  Speaker,
  Venue,
  InstitutionalEvent,
  Session,
  Participant,
  Registration,
  Payment,
  Attendance,
  Certificate,
  Feedback,
  CollisionWarning
} from '../types/database';
import {
  SEED_CATEGORIES,
  SEED_COORDINATORS,
  SEED_SPEAKERS,
  SEED_VENUES,
  SEED_EVENTS,
  SEED_SESSIONS,
  SEED_PARTICIPANTS,
  SEED_REGISTRATIONS,
  SEED_PAYMENTS,
  SEED_ATTENDANCE,
  SEED_CERTIFICATES,
  SEED_FEEDBACK
} from '../data/seedDatabase';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
}

interface AttendanceProgress {
  totalSessions: number;
  attendedSessions: number;
  percentage: number;
  thresholdPct: number;
  isEligibleForCert: boolean;
  certificate?: Certificate;
}

interface DatabaseContextType {
  // Active Role & Personas
  role: Role;
  setRole: (role: Role) => void;
  currentParticipant: Participant;
  currentSpeaker: Speaker;
  currentCoordinator: Coordinator;
  setCurrentParticipantId: (id: string) => void;
  setCurrentSpeakerId: (id: string) => void;
  setCurrentCoordinatorId: (id: string) => void;

  // 12 Entities
  categories: Category[];
  coordinators: Coordinator[];
  speakers: Speaker[];
  venues: Venue[];
  events: InstitutionalEvent[];
  sessions: Session[];
  participants: Participant[];
  registrations: Registration[];
  payments: Payment[];
  attendances: Attendance[];
  certificates: Certificate[];
  feedbacks: Feedback[];

  // Constraints & Validator Utilities
  checkVenueCollision: (
    venueId: string,
    date: string,
    startTime: string,
    endTime: string,
    excludeSessionId?: string
  ) => CollisionWarning;
  getEventRemainingCapacity: (eventId: string) => {
    totalCapacity: number;
    registeredCount: number;
    remaining: number;
    isFull: boolean;
  };
  isParticipantAlreadyRegistered: (participantId: string, eventId: string) => boolean;
  getParticipantAttendanceProgress: (registrationId: string) => AttendanceProgress;
  
  // Actions & Mutations
  createEvent: (eventData: Omit<InstitutionalEvent, 'event_id'>) => { success: boolean; event?: InstitutionalEvent; error?: string };
  scheduleSession: (
    sessionData: Omit<Session, 'session_id'>,
    ignoreCollisionWarning?: boolean
  ) => { success: boolean; session?: Session; error?: string; collision?: CollisionWarning };
  deleteSession: (sessionId: string) => void;
  registerParticipant: (
    eventId: string,
    paymentMethod: Payment['payment_method'],
    amount: number,
    participantOverride?: Partial<Participant>
  ) => { success: boolean; registration?: Registration; error?: string };
  toggleAttendance: (registrationId: string, sessionId: string) => { status: 'PRESENT' | 'ABSENT'; progress: AttendanceProgress };
  submitFeedback: (
    registrationId: string,
    ratings: { overall: number; content: number; venue: number; organization: number },
    comments: string
  ) => { success: boolean; feedback?: Feedback };
  resetDatabaseToSeed: () => void;

  // Notification Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

const STORAGE_KEY = 'NEXUS_INSTITUTIONAL_DBMS_V1';

export const DatabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Role & active personas
  const [role, setRole] = useState<Role>('COORDINATOR');
  const [currentParticipantId, setCurrentParticipantId] = useState<string>('PT-01');
  const [currentSpeakerId, setCurrentSpeakerId] = useState<string>('SPK-01');
  const [currentCoordinatorId, setCurrentCoordinatorId] = useState<string>('COORD-01');

  // 12 Entities State
  const [categories, setCategories] = useState<Category[]>(SEED_CATEGORIES);
  const [coordinators, setCoordinators] = useState<Coordinator[]>(SEED_COORDINATORS);
  const [speakers, setSpeakers] = useState<Speaker[]>(SEED_SPEAKERS);
  const [venues, setVenues] = useState<Venue[]>(SEED_VENUES);
  const [events, setEvents] = useState<InstitutionalEvent[]>(SEED_EVENTS);
  const [sessions, setSessions] = useState<Session[]>(SEED_SESSIONS);
  const [participants, setParticipants] = useState<Participant[]>(SEED_PARTICIPANTS);
  const [registrations, setRegistrations] = useState<Registration[]>(SEED_REGISTRATIONS);
  const [payments, setPayments] = useState<Payment[]>(SEED_PAYMENTS);
  const [attendances, setAttendances] = useState<Attendance[]>(SEED_ATTENDANCE);
  const [certificates, setCertificates] = useState<Certificate[]>(SEED_CERTIFICATES);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(SEED_FEEDBACK);

  // Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load from local storage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.events && parsed.sessions && parsed.registrations) {
          setCategories(parsed.categories || SEED_CATEGORIES);
          setCoordinators(parsed.coordinators || SEED_COORDINATORS);
          setSpeakers(parsed.speakers || SEED_SPEAKERS);
          setVenues(parsed.venues || SEED_VENUES);
          setEvents(parsed.events);
          setSessions(parsed.sessions);
          setParticipants(parsed.participants);
          setRegistrations(parsed.registrations);
          setPayments(parsed.payments);
          setAttendances(parsed.attendances);
          setCertificates(parsed.certificates);
          setFeedbacks(parsed.feedbacks);
        }
      }
    } catch {
      // Fallback to seeds on parse error
    }
  }, []);

  // Sync to local storage
  const saveStateToStorage = (newState: Partial<{
    categories: Category[];
    coordinators: Coordinator[];
    speakers: Speaker[];
    venues: Venue[];
    events: InstitutionalEvent[];
    sessions: Session[];
    participants: Participant[];
    registrations: Registration[];
    payments: Payment[];
    attendances: Attendance[];
    certificates: Certificate[];
    feedbacks: Feedback[];
  }>) => {
    try {
      const current = {
        categories,
        coordinators,
        speakers,
        venues,
        events,
        sessions,
        participants,
        registrations,
        payments,
        attendances,
        certificates,
        feedbacks,
        ...newState
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch {
      // Ignore storage errors in restricted contexts
    }
  };

  const addToast = (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => {
    const id = `t-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { ...toast, id, timestamp: Date.now() };
    setToasts(prev => [newToast, ...prev.slice(0, 4)]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const currentParticipant = useMemo(
    () => participants.find(p => p.participant_id === currentParticipantId) || participants[0],
    [participants, currentParticipantId]
  );

  const currentSpeaker = useMemo(
    () => speakers.find(s => s.speaker_id === currentSpeakerId) || speakers[0],
    [speakers, currentSpeakerId]
  );

  const currentCoordinator = useMemo(
    () => coordinators.find(c => c.coordinator_id === currentCoordinatorId) || coordinators[0],
    [coordinators, currentCoordinatorId]
  );

  // ==========================================
  // CONSTRAINT 1: NO VENUE OVERLAP CHECK
  // Two sessions in the same venue on the same date collide if:
  // !(sessionA.end_time <= sessionB.start_time || sessionA.start_time >= sessionB.end_time)
  // ==========================================
  const checkVenueCollision = (
    venueId: string,
    date: string,
    startTime: string,
    endTime: string,
    excludeSessionId?: string
  ): CollisionWarning => {
    const venue = venues.find(v => v.venue_id === venueId);
    
    // Parse time to minutes for robust comparison
    const toMinutes = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const newStart = toMinutes(startTime);
    const newEnd = toMinutes(endTime);

    if (newEnd <= newStart) {
      return {
        hasConflict: true,
        message: 'Invalid Time Interval: Session end time must be strictly after start time.'
      };
    }

    const sameDayVenueSessions = sessions.filter(
      s => s.venue_id === venueId && s.date === date && s.session_id !== excludeSessionId
    );

    for (const session of sameDayVenueSessions) {
      const existStart = toMinutes(session.start_time);
      const existEnd = toMinutes(session.end_time);

      // Overlap condition
      const isOverlapping = !(newEnd <= existStart || newStart >= existEnd);

      if (isOverlapping) {
        return {
          hasConflict: true,
          conflictingSession: session,
          conflictingVenue: venue,
          message: `Collision Detected: Venue "${venue?.name || venueId}" is already reserved for "${session.title}" (${session.start_time} - ${session.end_time}).`
        };
      }
    }

    return { hasConflict: false };
  };

  // ==========================================
  // CONSTRAINT 2: CAPACITY ENFORCER
  // ==========================================
  const getEventRemainingCapacity = (eventId: string) => {
    const event = events.find(e => e.event_id === eventId);
    if (!event) return { totalCapacity: 0, registeredCount: 0, remaining: 0, isFull: true };

    const confirmedRegs = registrations.filter(
      r => r.event_id === eventId && (r.status === 'CONFIRMED' || r.status === 'PENDING_PAYMENT')
    );

    const totalCapacity = event.max_capacity;
    const registeredCount = confirmedRegs.length;
    const remaining = Math.max(0, totalCapacity - registeredCount);

    return {
      totalCapacity,
      registeredCount,
      remaining,
      isFull: remaining <= 0
    };
  };

  // ==========================================
  // CONSTRAINT 3: UNIQUE PARTICIPANT REGISTRATION
  // UNIQUE(participant_id, event_id)
  // ==========================================
  const isParticipantAlreadyRegistered = (participantId: string, eventId: string) => {
    return registrations.some(
      r => r.participant_id === participantId && r.event_id === eventId && r.status !== 'CANCELLED'
    );
  };

  // ==========================================
  // CONSTRAINT 4: ATTENDANCE THRESHOLD VALIDATION
  // ==========================================
  const getParticipantAttendanceProgress = (registrationId: string): AttendanceProgress => {
    const reg = registrations.find(r => r.registration_id === registrationId);
    if (!reg) {
      return { totalSessions: 0, attendedSessions: 0, percentage: 0, thresholdPct: 75, isEligibleForCert: false };
    }

    const event = events.find(e => e.event_id === reg.event_id);
    const eventSessions = sessions.filter(s => s.event_id === reg.event_id);
    const totalSessions = eventSessions.length;
    const thresholdPct = event?.cert_threshold_pct || 75;

    if (totalSessions === 0) {
      return { totalSessions: 0, attendedSessions: 0, percentage: 0, thresholdPct, isEligibleForCert: false };
    }

    const attendedRecords = attendances.filter(
      a => a.registration_id === registrationId && a.status === 'PRESENT'
    );
    const attendedSessions = attendedRecords.length;
    const percentage = Math.round((attendedSessions / totalSessions) * 100);
    const isEligibleForCert = percentage >= thresholdPct;
    const cert = certificates.find(c => c.registration_id === registrationId);

    return {
      totalSessions,
      attendedSessions,
      percentage,
      thresholdPct,
      isEligibleForCert,
      certificate: cert
    };
  };

  // ==========================================
  // ACTIONS / MUTATIONS
  // ==========================================

  const createEvent = (eventData: Omit<InstitutionalEvent, 'event_id'>) => {
    const eventId = `EVT-2026-${String(events.length + 1).padStart(3, '0')}`;
    const newEvent: InstitutionalEvent = {
      ...eventData,
      event_id: eventId
    };

    const nextEvents = [newEvent, ...events];
    setEvents(nextEvents);
    saveStateToStorage({ events: nextEvents });

    addToast({
      type: 'success',
      title: 'Event Created',
      message: `Event "${newEvent.title}" (${newEvent.event_id}) successfully persisted.`
    });

    return { success: true, event: newEvent };
  };

  const scheduleSession = (
    sessionData: Omit<Session, 'session_id'>,
    ignoreCollisionWarning = false
  ) => {
    // 1. Enforce No Venue Overlap Constraint
    const collision = checkVenueCollision(
      sessionData.venue_id,
      sessionData.date,
      sessionData.start_time,
      sessionData.end_time
    );

    if (collision.hasConflict && !ignoreCollisionWarning) {
      addToast({
        type: 'error',
        title: 'DBMS Collision Constraint Violated',
        message: collision.message || 'Venue is already booked during this time interval.'
      });
      return { success: false, error: collision.message, collision };
    }

    const sessionId = `SES-${Math.floor(100 + Math.random() * 900)}`;
    const newSession: Session = {
      ...sessionData,
      session_id: sessionId
    };

    const nextSessions = [...sessions, newSession];
    setSessions(nextSessions);
    saveStateToStorage({ sessions: nextSessions });

    addToast({
      type: 'success',
      title: 'Session Scheduled',
      message: `Allocated to ${newSession.date} (${newSession.start_time} - ${newSession.end_time}).`
    });

    return { success: true, session: newSession };
  };

  const deleteSession = (sessionId: string) => {
    const nextSessions = sessions.filter(s => s.session_id !== sessionId);
    const nextAttendance = attendances.filter(a => a.session_id !== sessionId);
    setSessions(nextSessions);
    setAttendances(nextAttendance);
    saveStateToStorage({ sessions: nextSessions, attendances: nextAttendance });

    addToast({
      type: 'info',
      title: 'Session Removed',
      message: `Session ${sessionId} has been deallocated from the matrix.`
    });
  };

  const registerParticipant = (
    eventId: string,
    paymentMethod: Payment['payment_method'],
    amount: number,
    participantOverride?: Partial<Participant>
  ) => {
    const event = events.find(e => e.event_id === eventId);
    if (!event) return { success: false, error: 'Event not found.' };

    const participantId = currentParticipant.participant_id;

    // Check Unique Registration constraint
    if (isParticipantAlreadyRegistered(participantId, eventId)) {
      addToast({
        type: 'error',
        title: 'Integrity Constraint Error: UNIQUE(participant_id, event_id)',
        message: `Student "${currentParticipant.name}" is already registered for this event.`
      });
      return {
        success: false,
        error: `Unique Constraint Violated: Already registered for ${event.title}.`
      };
    }

    // Check Capacity constraint
    const capacityStatus = getEventRemainingCapacity(eventId);
    if (capacityStatus.isFull) {
      addToast({
        type: 'warning',
        title: 'Capacity Limit Exceeded',
        message: `Venue capacity of ${event.max_capacity} seats has been reached.`
      });
      return {
        success: false,
        error: `Capacity Constraint Violated: Event has 0 remaining seats.`
      };
    }

    // Check Payment amount constraint (strictly >= 0)
    if (amount < 0) {
      addToast({
        type: 'error',
        title: 'Integrity Constraint Error: CHECK(amount >= 0)',
        message: 'Payment amount cannot be negative.'
      });
      return { success: false, error: 'Payment amount must be greater than or equal to 0.' };
    }

    // Update participant details if modified in checkout
    let nextParticipants = participants;
    if (participantOverride) {
      nextParticipants = participants.map(p =>
        p.participant_id === participantId ? { ...p, ...participantOverride } : p
      );
      setParticipants(nextParticipants);
    }

    // Generate new Registration entity
    const regId = `REG-${Math.floor(1000 + Math.random() * 9000)}`;
    const qrToken = `NEXUS-${regId}-${event.event_id.replace('EVT-', '')}-${participantId}`;
    const newReg: Registration = {
      registration_id: regId,
      participant_id: participantId,
      event_id: eventId,
      registered_at: new Date().toISOString(),
      status: 'CONFIRMED',
      qr_code_token: qrToken,
      notes: `Institutional pass issued to ${currentParticipant.name}.`
    };

    // Generate Payment entity
    const payId = `PAY-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPayment: Payment = {
      payment_id: payId,
      registration_id: regId,
      amount: Number(amount.toFixed(2)),
      payment_method: paymentMethod,
      transaction_ref: `TXN-${paymentMethod.substring(0, 3)}-${Date.now().toString(36).toUpperCase()}`,
      status: 'COMPLETED',
      paid_at: new Date().toISOString(),
      invoice_number: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`
    };

    const nextRegistrations = [newReg, ...registrations];
    const nextPayments = [newPayment, ...payments];

    setRegistrations(nextRegistrations);
    setPayments(nextPayments);
    saveStateToStorage({
      participants: nextParticipants,
      registrations: nextRegistrations,
      payments: nextPayments
    });

    addToast({
      type: 'success',
      title: 'Registration Confirmed!',
      message: `Pass #${regId} generated with secure QR Ticket.`
    });

    return { success: true, registration: newReg };
  };

  const toggleAttendance = (registrationId: string, sessionId: string) => {
    const existingIndex = attendances.findIndex(
      a => a.registration_id === registrationId && a.session_id === sessionId
    );

    let nextAttendances = [...attendances];
    let newStatus: 'PRESENT' | 'ABSENT' = 'PRESENT';

    if (existingIndex >= 0) {
      // Toggle off
      nextAttendances.splice(existingIndex, 1);
      newStatus = 'ABSENT';
    } else {
      // Mark present
      const newAttendance: Attendance = {
        attendance_id: `ATT-${Date.now().toString(36).toUpperCase()}`,
        registration_id: registrationId,
        session_id: sessionId,
        check_in_time: new Date().toISOString(),
        status: 'PRESENT',
        verified_by: `${currentCoordinator.coordinator_id} (${currentCoordinator.name})`
      };
      nextAttendances.push(newAttendance);
      newStatus = 'PRESENT';
    }

    setAttendances(nextAttendances);

    // Recompute attendance progress & handle certificate trigger
    const reg = registrations.find(r => r.registration_id === registrationId);
    const event = events.find(e => e.event_id === reg?.event_id);
    const eventSessions = sessions.filter(s => s.event_id === reg?.event_id);
    const totalSessions = eventSessions.length;
    const thresholdPct = event?.cert_threshold_pct || 75;

    const attendedCount = nextAttendances.filter(
      a => a.registration_id === registrationId && a.status === 'PRESENT'
    ).length;

    const percentage = totalSessions > 0 ? Math.round((attendedCount / totalSessions) * 100) : 0;
    const isEligible = percentage >= thresholdPct;

    let nextCertificates = [...certificates];
    const existingCertIndex = nextCertificates.findIndex(c => c.registration_id === registrationId);

    if (isEligible && existingCertIndex === -1 && reg) {
      // Trigger Certificate Generation!
      const certId = `CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const hashToken = `NEXUS-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const newCert: Certificate = {
        certificate_id: certId,
        registration_id: registrationId,
        issue_date: new Date().toISOString().split('T')[0],
        verification_hash: hashToken,
        attendance_pct: percentage,
        qr_verification_url: `https://verify.institution.edu/cert/${hashToken}`
      };
      nextCertificates.push(newCert);
      setCertificates(nextCertificates);

      addToast({
        type: 'success',
        title: '🎓 Certificate Unlocked!',
        message: `Attendance threshold (${thresholdPct}%) achieved! Certificate of Completion generated.`
      });
    } else if (!isEligible && existingCertIndex >= 0) {
      // If attendance fell below threshold, revoke certificate
      nextCertificates.splice(existingCertIndex, 1);
      setCertificates(nextCertificates);
    }

    saveStateToStorage({ attendances: nextAttendances, certificates: nextCertificates });

    const updatedCert = nextCertificates.find(c => c.registration_id === registrationId);

    return {
      status: newStatus,
      progress: {
        totalSessions,
        attendedSessions: attendedCount,
        percentage,
        thresholdPct,
        isEligibleForCert: isEligible,
        certificate: updatedCert
      }
    };
  };

  const submitFeedback = (
    registrationId: string,
    ratings: { overall: number; content: number; venue: number; organization: number },
    comments: string
  ) => {
    const feedbackId = `FDB-${Date.now().toString(36).toUpperCase()}`;
    const newFeedback: Feedback = {
      feedback_id: feedbackId,
      registration_id: registrationId,
      overall_rating: ratings.overall,
      content_rating: ratings.content,
      venue_rating: ratings.venue,
      organization_rating: ratings.organization,
      comments,
      submitted_at: new Date().toISOString()
    };

    const nextFeedbacks = [newFeedback, ...feedbacks.filter(f => f.registration_id !== registrationId)];
    setFeedbacks(nextFeedbacks);
    saveStateToStorage({ feedbacks: nextFeedbacks });

    addToast({
      type: 'success',
      title: 'Feedback Recorded',
      message: 'Thank you! Your institutional appraisal has been stored in FEEDBACK table.'
    });

    return { success: true, feedback: newFeedback };
  };

  const resetDatabaseToSeed = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCategories(SEED_CATEGORIES);
    setCoordinators(SEED_COORDINATORS);
    setSpeakers(SEED_SPEAKERS);
    setVenues(SEED_VENUES);
    setEvents(SEED_EVENTS);
    setSessions(SEED_SESSIONS);
    setParticipants(SEED_PARTICIPANTS);
    setRegistrations(SEED_REGISTRATIONS);
    setPayments(SEED_PAYMENTS);
    setAttendances(SEED_ATTENDANCE);
    setCertificates(SEED_CERTIFICATES);
    setFeedbacks(SEED_FEEDBACK);

    addToast({
      type: 'info',
      title: 'Database Reset',
      message: 'Restored all 12 relational tables to pristine baseline seed data.'
    });
  };

  return (
    <DatabaseContext.Provider
      value={{
        role,
        setRole,
        currentParticipant,
        currentSpeaker,
        currentCoordinator,
        setCurrentParticipantId,
        setCurrentSpeakerId,
        setCurrentCoordinatorId,
        categories,
        coordinators,
        speakers,
        venues,
        events,
        sessions,
        participants,
        registrations,
        payments,
        attendances,
        certificates,
        feedbacks,
        checkVenueCollision,
        getEventRemainingCapacity,
        isParticipantAlreadyRegistered,
        getParticipantAttendanceProgress,
        createEvent,
        scheduleSession,
        deleteSession,
        registerParticipant,
        toggleAttendance,
        submitFeedback,
        resetDatabaseToSeed,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
