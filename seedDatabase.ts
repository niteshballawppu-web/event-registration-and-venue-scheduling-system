import {
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
  EntitySchemaMeta
} from '../types/database';

export const SEED_CATEGORIES: Category[] = [
  {
    category_id: 'CAT-01',
    name: 'Workshops & Labs',
    code: 'WRK',
    description: 'Hands-on technical engineering and computational laboratories.',
    color_token: 'indigo'
  },
  {
    category_id: 'CAT-02',
    name: 'Seminars & Symposia',
    code: 'SEM',
    description: 'Academic colloquia, research paper presentations, and panels.',
    color_token: 'violet'
  },
  {
    category_id: 'CAT-03',
    name: 'Guest Lectures',
    code: 'GST',
    description: 'Distinguished industry leaders and visiting faculty addresses.',
    color_token: 'amber'
  },
  {
    category_id: 'CAT-04',
    name: 'Cultural Fest & Arts',
    code: 'CUL',
    description: 'Institutional cultural celebrations, debate tournaments, and music.',
    color_token: 'rose'
  },
  {
    category_id: 'CAT-05',
    name: 'Hackathons & Summits',
    code: 'HCK',
    description: 'Competitive 24h innovation challenges and project expos.',
    color_token: 'emerald'
  }
];

export const SEED_COORDINATORS: Coordinator[] = [
  {
    coordinator_id: 'COORD-01',
    name: 'Dr. Aris Thorne',
    email: 'aris.thorne@institution.edu',
    department: 'Department of Computer Science & AI',
    phone: '+1 (555) 234-8901',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
  },
  {
    coordinator_id: 'COORD-02',
    name: 'Prof. Clara Chen',
    email: 'clara.chen@institution.edu',
    department: 'Office of Student Affairs & Culture',
    phone: '+1 (555) 345-6789',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250'
  },
  {
    coordinator_id: 'COORD-03',
    name: 'Dr. Marcus Holloway',
    email: 'marcus.holloway@institution.edu',
    department: 'Center for Electrical & Robotics Eng.',
    phone: '+1 (555) 456-7890',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'
  }
];

export const SEED_SPEAKERS: Speaker[] = [
  {
    speaker_id: 'SPK-01',
    name: 'Prof. Maya Lin',
    affiliation: 'MIT Generative Intelligence Lab',
    bio: 'Pioneer in agentic neural systems and distributed relational machine learning.',
    specialty: 'Foundation Models & Relational Reasoning',
    email: 'maya.lin@mit.edu',
    phone: '+1 (617) 555-0199',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250'
  },
  {
    speaker_id: 'SPK-02',
    name: 'Dr. Jonathan Vance',
    affiliation: 'DeepMind Systems Fellow',
    bio: 'Author of 30+ peer-reviewed papers on high-throughput database query optimization.',
    specialty: 'DBMS Concurrency & Distributed Storage',
    email: 'j.vance@deepmind.example',
    phone: '+1 (415) 555-8321',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250'
  },
  {
    speaker_id: 'SPK-03',
    name: 'Elena Rostova',
    affiliation: 'VP Architecture at CloudScale Global',
    bio: 'Over 18 years architecting enterprise distributed event-driven microservices.',
    specialty: 'High-Concurrency Event Scheduling',
    email: 'elena.rostova@cloudscale.io',
    phone: '+1 (206) 555-4412',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250'
  },
  {
    speaker_id: 'SPK-04',
    name: 'Kavita Sundaram',
    affiliation: 'National Arts & Cultural Heritage Council',
    bio: 'Curator and director of inter-collegiate arts and classical symphony festivals.',
    specialty: 'Acoustic Performing Arts & Production',
    email: 'kavita.s@artscouncil.org',
    phone: '+1 (212) 555-7788',
    avatar_url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=250'
  }
];

export const SEED_VENUES: Venue[] = [
  {
    venue_id: 'VEN-01',
    name: 'Turing Great Auditorium (Auditorium A)',
    building: 'Main Science & Computing Complex',
    floor: 'Floor 1, West Wing',
    capacity: 250,
    equipment: ['Dual 4K Laser Projectors', 'Wireless Lapel Mics (x4)', 'Surround Sound Array', 'Live Stream Broadcast AV', 'Stage Confidence Monitor'],
    is_active: true
  },
  {
    venue_id: 'VEN-02',
    name: 'Ada Lovelace High-Tech Lab',
    building: 'Turing Hall of Informatics',
    floor: 'Floor 3, Room 302',
    capacity: 45,
    equipment: ['Interactive Digital Whiteboard', 'Gigabit Workstations (x45)', 'Ultra-short Throw Projector', 'Hardware IoT Benches'],
    is_active: true
  },
  {
    venue_id: 'VEN-03',
    name: 'Open Air Amphitheater & Plaza',
    building: 'University Cultural Commons',
    floor: 'Ground Level Outdoor',
    capacity: 500,
    equipment: ['High-Output Concert Audio P.A.', 'Dynamic Stage Lighting Rig', 'Multi-channel Wireless Mics', 'Outdoor Projection Screen'],
    is_active: true
  },
  {
    venue_id: 'VEN-04',
    name: 'Executive Seminar Room B',
    building: 'Von Neumann Administration Tower',
    floor: 'Floor 5, Suite 508',
    capacity: 35,
    equipment: ['Polycom Video Conferencing System', 'Dual 85" 4K Displays', 'Ceiling Microphone Array', 'Podium HDMI/USB-C Hub'],
    is_active: true
  },
  {
    venue_id: 'VEN-05',
    name: 'Dirac Quantum & Robotics Center',
    building: 'Advanced Research Laboratory',
    floor: 'Ground Level East',
    capacity: 80,
    equipment: ['Robotics Test Arena', 'Precision Overhead Cameras', 'Projection Screen', 'PA System'],
    is_active: true
  }
];

export const SEED_EVENTS: InstitutionalEvent[] = [
  {
    event_id: 'EVT-2026-001',
    category_id: 'CAT-01',
    coordinator_id: 'COORD-01',
    title: 'Distributed Relational Engines & SQL Optimization Workshop',
    description: 'Deep dive into B-Tree indices, multi-version concurrency control (MVCC), and distributed transaction locks in modern 3NF architectures.',
    start_date: '2026-10-15',
    end_date: '2026-10-15',
    cert_threshold_pct: 75,
    fee: 35.00,
    max_capacity: 45,
    status: 'PUBLISHED',
    banner_color: 'indigo',
    location_summary: 'Ada Lovelace High-Tech Lab (Room 302)'
  },
  {
    event_id: 'EVT-2026-002',
    category_id: 'CAT-03',
    coordinator_id: 'COORD-01',
    title: 'Distinguished Keynote: The Frontier of Agentic Relational Models',
    description: 'An institutional lecture featuring Prof. Maya Lin exploring autonomous agent architectures grounded with deterministic database systems.',
    start_date: '2026-10-16',
    end_date: '2026-10-16',
    cert_threshold_pct: 80,
    fee: 0.00,
    max_capacity: 250,
    status: 'PUBLISHED',
    banner_color: 'amber',
    location_summary: 'Turing Great Auditorium (Auditorium A)'
  },
  {
    event_id: 'EVT-2026-003',
    category_id: 'CAT-04',
    coordinator_id: 'COORD-02',
    title: 'Veritas Inter-Collegiate Arts & Cultural Fest 2026',
    description: 'Three-day flagship university festival celebrating theater, acoustic harmonies, debate forums, and multimedia digital arts.',
    start_date: '2026-10-18',
    end_date: '2026-10-20',
    cert_threshold_pct: 50,
    fee: 15.00,
    max_capacity: 500,
    status: 'PUBLISHED',
    banner_color: 'rose',
    location_summary: 'Open Air Amphitheater & Cultural Commons'
  },
  {
    event_id: 'EVT-2026-004',
    category_id: 'CAT-02',
    coordinator_id: 'COORD-03',
    title: 'Symposium on Microservices, Concurrency & Venue Scheduling',
    description: 'Research presentations exploring constraint satisfaction algorithms, operational transforms, and real-time interval scheduling.',
    start_date: '2026-10-22',
    end_date: '2026-10-22',
    cert_threshold_pct: 75,
    fee: 50.00,
    max_capacity: 35,
    status: 'PUBLISHED',
    banner_color: 'violet',
    location_summary: 'Executive Seminar Room B'
  },
  {
    event_id: 'EVT-2026-005',
    category_id: 'CAT-05',
    coordinator_id: 'COORD-03',
    title: 'HackMatrix: 24-Hour Autonomous Systems Hackathon',
    description: 'Collegiate hackathon building resilient physical computing and cloud data pipelines. Generous prizes, mentorship, and industry judges.',
    start_date: '2026-10-25',
    end_date: '2026-10-26',
    cert_threshold_pct: 85,
    fee: 25.00,
    max_capacity: 80,
    status: 'PUBLISHED',
    banner_color: 'emerald',
    location_summary: 'Dirac Quantum & Robotics Center'
  }
];

export const SEED_SESSIONS: Session[] = [
  // Sessions for EVT-2026-001 (Distributed Relational Workshop)
  {
    session_id: 'SES-101',
    event_id: 'EVT-2026-001',
    venue_id: 'VEN-02',
    speaker_id: 'SPK-02',
    title: 'Module 1: Internal Storage Engines, Write-Ahead Logs & B+ Trees',
    date: '2026-10-15',
    start_time: '09:00',
    end_time: '11:00',
    description: 'Architecting write-ahead logging (WAL) buffers and low-level page indexing.',
    equipment_needed: ['Gigabit Workstations', 'Interactive Digital Whiteboard']
  },
  {
    session_id: 'SES-102',
    event_id: 'EVT-2026-001',
    venue_id: 'VEN-02',
    speaker_id: 'SPK-02',
    title: 'Module 2: Concurrency Isolation Levels & MVCC Hands-on Lab',
    date: '2026-10-15',
    start_time: '11:30',
    end_time: '13:30',
    description: 'Hands-on debugging of phantom reads, non-repeatable reads, and serializable isolation.',
    equipment_needed: ['Gigabit Workstations']
  },
  {
    session_id: 'SES-103',
    event_id: 'EVT-2026-001',
    venue_id: 'VEN-02',
    speaker_id: 'SPK-03',
    title: 'Module 3: Query Execution Planners & Cost-Based Optimization',
    date: '2026-10-15',
    start_time: '14:30',
    end_time: '17:00',
    description: 'Benchmarking hash joins, nested loop iterations, and index scans on 10M-row datasets.',
    equipment_needed: ['Gigabit Workstations', 'Ultra-short Throw Projector']
  },

  // Sessions for EVT-2026-002 (Distinguished Keynote)
  {
    session_id: 'SES-201',
    event_id: 'EVT-2026-002',
    venue_id: 'VEN-01',
    speaker_id: 'SPK-01',
    title: 'Plenary Keynote: Deterministic Relational Schemas in the Age of Generative AI',
    date: '2026-10-16',
    start_time: '10:00',
    end_time: '12:00',
    description: 'How modern institutions eliminate hallucinations by binding LLM execution graphs to 3NF relational schemas.',
    equipment_needed: ['Dual 4K Laser Projectors', 'Wireless Lapel Mics', 'Stage Confidence Monitor']
  },
  {
    session_id: 'SES-202',
    event_id: 'EVT-2026-002',
    venue_id: 'VEN-01',
    speaker_id: 'SPK-01',
    title: 'Fireside Q&A & Open Panel with Faculty & Student Researchers',
    date: '2026-10-16',
    start_time: '13:00',
    end_time: '14:30',
    description: 'Audience interactive discussion and research directions.',
    equipment_needed: ['Wireless Lapel Mics (x4)', 'Surround Sound Array']
  },

  // Sessions for EVT-2026-004 (Symposium in Seminar Room B)
  {
    session_id: 'SES-401',
    event_id: 'EVT-2026-004',
    venue_id: 'VEN-04',
    speaker_id: 'SPK-03',
    title: 'Paper Track: Conflict-Free Replicated Event Scheduling (CRDTs)',
    date: '2026-10-22',
    start_time: '09:30',
    end_time: '12:00',
    description: 'Real-time collaborative scheduling using Conflict-Free Replicated Data Types.',
    equipment_needed: ['Polycom Video Conferencing System', 'Podium HDMI/USB-C Hub']
  },
  {
    session_id: 'SES-402',
    event_id: 'EVT-2026-004',
    venue_id: 'VEN-04',
    speaker_id: 'SPK-02',
    title: 'Roundtable: Zero-Downtime Schema Migrations in Relational DBs',
    date: '2026-10-22',
    start_time: '13:30',
    end_time: '15:30',
    description: 'Handling large-scale online table alters and backwards-compatible column constraints.',
    equipment_needed: ['Ceiling Microphone Array']
  },

  // Sessions for EVT-2026-003 (Cultural Fest)
  {
    session_id: 'SES-301',
    event_id: 'EVT-2026-003',
    venue_id: 'VEN-03',
    speaker_id: 'SPK-04',
    title: 'Inaugural Acoustic Symphony & Inter-Department Choir Showcase',
    date: '2026-10-18',
    start_time: '17:00',
    end_time: '20:00',
    description: 'Grand opening ceremony featuring campus orchestra and classical acoustic performances.',
    equipment_needed: ['High-Output Concert Audio P.A.', 'Dynamic Stage Lighting Rig']
  }
];

export const SEED_PARTICIPANTS: Participant[] = [
  {
    participant_id: 'PT-01',
    name: 'Alex Rivera',
    email: 'alex.rivera@student.institution.edu',
    student_id: 'STU-2024-881',
    institution: 'Institute of Engineering & Applied Sciences',
    department: 'Computer Science (Year 3)',
    phone: '+1 (555) 789-0123',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'
  },
  {
    participant_id: 'PT-02',
    name: 'Sophia Patel',
    email: 'sophia.patel@student.institution.edu',
    student_id: 'STU-2023-412',
    institution: 'Institute of Engineering & Applied Sciences',
    department: 'Data Science & Machine Learning',
    phone: '+1 (555) 890-1234',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250'
  },
  {
    participant_id: 'PT-03',
    name: 'Liam Chen',
    email: 'liam.chen@student.institution.edu',
    student_id: 'STU-2025-109',
    institution: 'School of Humanities & Digital Media',
    department: 'Digital Arts & Media',
    phone: '+1 (555) 901-2345',
    avatar_url: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=250'
  }
];

export const SEED_REGISTRATIONS: Registration[] = [
  {
    registration_id: 'REG-901',
    participant_id: 'PT-01', // Alex Rivera
    event_id: 'EVT-2026-001', // Distributed Relational Workshop
    registered_at: '2026-10-01T14:32:00Z',
    status: 'CONFIRMED',
    qr_code_token: 'NEXUS-REG-901-EVT001-PT01',
    notes: 'Early bird registration, CS departmental subsidy applied.'
  },
  {
    registration_id: 'REG-902',
    participant_id: 'PT-01', // Alex Rivera
    event_id: 'EVT-2026-002', // Distinguished Keynote
    registered_at: '2026-10-02T10:15:00Z',
    status: 'CONFIRMED',
    qr_code_token: 'NEXUS-REG-902-EVT002-PT01',
    notes: 'Free admission event ticket.'
  },
  {
    registration_id: 'REG-903',
    participant_id: 'PT-02', // Sophia Patel
    event_id: 'EVT-2026-001',
    registered_at: '2026-10-02T16:20:00Z',
    status: 'CONFIRMED',
    qr_code_token: 'NEXUS-REG-903-EVT001-PT02'
  },
  {
    registration_id: 'REG-904',
    participant_id: 'PT-03', // Liam Chen
    event_id: 'EVT-2026-003',
    registered_at: '2026-10-03T11:45:00Z',
    status: 'CONFIRMED',
    qr_code_token: 'NEXUS-REG-904-EVT003-PT03'
  }
];

export const SEED_PAYMENTS: Payment[] = [
  {
    payment_id: 'PAY-501',
    registration_id: 'REG-901',
    amount: 35.00,
    payment_method: 'STUDENT_BILLING',
    transaction_ref: 'TXN-STU-20261001-89312',
    status: 'COMPLETED',
    paid_at: '2026-10-01T14:33:10Z',
    invoice_number: 'INV-2026-0091'
  },
  {
    payment_id: 'PAY-502',
    registration_id: 'REG-902',
    amount: 0.00, // Free event pass
    payment_method: 'COMPLIMENTARY',
    transaction_ref: 'FREE-ADM-2026-002',
    status: 'COMPLETED',
    paid_at: '2026-10-02T10:15:05Z',
    invoice_number: 'INV-2026-0092'
  },
  {
    payment_id: 'PAY-503',
    registration_id: 'REG-903',
    amount: 35.00,
    payment_method: 'CREDIT_CARD',
    transaction_ref: 'TXN-STRIPE-CC-994821',
    status: 'COMPLETED',
    paid_at: '2026-10-02T16:22:00Z',
    invoice_number: 'INV-2026-0093'
  },
  {
    payment_id: 'PAY-504',
    registration_id: 'REG-904',
    amount: 15.00,
    payment_method: 'UPI',
    transaction_ref: 'UPI-REF-8849102831',
    status: 'COMPLETED',
    paid_at: '2026-10-03T11:46:20Z',
    invoice_number: 'INV-2026-0094'
  }
];

export const SEED_ATTENDANCE: Attendance[] = [
  // Alex Rivera (REG-901) attended SES-101 and SES-102 out of 3 sessions (66.6% currently, needs SES-103 to hit 100% and unlock cert!)
  {
    attendance_id: 'ATT-1001',
    registration_id: 'REG-901',
    session_id: 'SES-101',
    check_in_time: '2026-10-15T08:55:00Z',
    status: 'PRESENT',
    verified_by: 'COORD-01 (Dr. Aris Thorne)'
  },
  {
    attendance_id: 'ATT-1002',
    registration_id: 'REG-901',
    session_id: 'SES-102',
    check_in_time: '2026-10-15T11:28:00Z',
    status: 'PRESENT',
    verified_by: 'COORD-01 (Dr. Aris Thorne)'
  },
  // Alex Rivera (REG-902) attended both SES-201 and SES-202 (100% attendance! threshold is 80%, cert issued!)
  {
    attendance_id: 'ATT-1003',
    registration_id: 'REG-902',
    session_id: 'SES-201',
    check_in_time: '2026-10-16T09:50:00Z',
    status: 'PRESENT',
    verified_by: 'COORD-01 (Dr. Aris Thorne)'
  },
  {
    attendance_id: 'ATT-1004',
    registration_id: 'REG-902',
    session_id: 'SES-202',
    check_in_time: '2026-10-16T12:55:00Z',
    status: 'PRESENT',
    verified_by: 'COORD-01 (Dr. Aris Thorne)'
  }
];

export const SEED_CERTIFICATES: Certificate[] = [
  // Issued for Alex Rivera's REG-902 because attendance = 100% >= 80% threshold
  {
    certificate_id: 'CERT-2026-789',
    registration_id: 'REG-902',
    issue_date: '2026-10-16',
    verification_hash: 'NEXUS-8F4A19B3E2',
    attendance_pct: 100,
    qr_verification_url: 'https://verify.institution.edu/cert/NEXUS-8F4A19B3E2'
  }
];

export const SEED_FEEDBACK: Feedback[] = [
  {
    feedback_id: 'FDB-301',
    registration_id: 'REG-902',
    overall_rating: 5,
    content_rating: 5,
    venue_rating: 4,
    organization_rating: 5,
    comments: 'Prof. Maya Lin delivered a transcendent lecture. The Turing Auditorium acoustics were superb and live Q&A was deeply inspiring.',
    submitted_at: '2026-10-16T15:30:00Z'
  }
];

// DBMS Schema Metadata (All 12 Entities with PKs, FKs, and Check Constraints)
export const DBMS_SCHEMA_METADATA: EntitySchemaMeta[] = [
  {
    tableName: 'CATEGORIES',
    description: 'Lookup table classifying events into academic, technical, or cultural types.',
    primaryKey: ['category_id'],
    foreignKeys: [],
    attributes: [
      { name: 'category_id', type: 'VARCHAR(16)', nullable: false, isPk: true, description: 'Primary Key (e.g. CAT-01)' },
      { name: 'name', type: 'VARCHAR(100)', nullable: false, description: 'Descriptive category name' },
      { name: 'code', type: 'VARCHAR(8)', nullable: false, description: 'Short unique uppercase code' },
      { name: 'description', type: 'TEXT', nullable: true, description: 'Detailed definition' },
      { name: 'color_token', type: 'VARCHAR(24)', nullable: false, description: 'Design system badge token' }
    ]
  },
  {
    tableName: 'COORDINATORS',
    description: 'Faculty and departmental staff responsible for organizing events.',
    primaryKey: ['coordinator_id'],
    foreignKeys: [],
    attributes: [
      { name: 'coordinator_id', type: 'VARCHAR(16)', nullable: false, isPk: true, description: 'Primary Key' },
      { name: 'name', type: 'VARCHAR(120)', nullable: false, description: 'Full faculty name' },
      { name: 'email', type: 'VARCHAR(160)', nullable: false, description: 'Institutional email address' },
      { name: 'department', type: 'VARCHAR(120)', nullable: false, description: 'Academic department' },
      { name: 'phone', type: 'VARCHAR(32)', nullable: true, description: 'Office contact line' }
    ]
  },
  {
    tableName: 'SPEAKERS',
    description: 'External dignitaries, keynote presenters, and workshop instructors.',
    primaryKey: ['speaker_id'],
    foreignKeys: [],
    attributes: [
      { name: 'speaker_id', type: 'VARCHAR(16)', nullable: false, isPk: true, description: 'Primary Key' },
      { name: 'name', type: 'VARCHAR(120)', nullable: false, description: 'Speaker full name' },
      { name: 'affiliation', type: 'VARCHAR(160)', nullable: false, description: 'Institution or company' },
      { name: 'bio', type: 'TEXT', nullable: true, description: 'Professional biography' },
      { name: 'specialty', type: 'VARCHAR(120)', nullable: false, description: 'Domain expertise' },
      { name: 'email', type: 'VARCHAR(160)', nullable: false, description: 'Contact email' }
    ]
  },
  {
    tableName: 'VENUES',
    description: 'Physical campus auditoriums, labs, and halls with strict capacity limits.',
    primaryKey: ['venue_id'],
    foreignKeys: [],
    attributes: [
      { name: 'venue_id', type: 'VARCHAR(16)', nullable: false, isPk: true, description: 'Primary Key (e.g. VEN-01)' },
      { name: 'name', type: 'VARCHAR(120)', nullable: false, description: 'Hall / room title' },
      { name: 'building', type: 'VARCHAR(100)', nullable: false, description: 'Campus building' },
      { name: 'floor', type: 'VARCHAR(40)', nullable: false, description: 'Floor and wing details' },
      { name: 'capacity', type: 'INTEGER', nullable: false, description: 'Max physical seating capacity (> 0)' },
      { name: 'equipment', type: 'JSONB / ARRAY', nullable: false, description: 'Equipped AV and hardware components' }
    ]
  },
  {
    tableName: 'EVENTS',
    description: 'Master record representing institutional events, symposia, and workshops.',
    primaryKey: ['event_id'],
    foreignKeys: [
      { column: 'category_id', referencesTable: 'CATEGORIES', referencesColumn: 'category_id' },
      { column: 'coordinator_id', referencesTable: 'COORDINATORS', referencesColumn: 'coordinator_id' }
    ],
    attributes: [
      { name: 'event_id', type: 'VARCHAR(24)', nullable: false, isPk: true, description: 'Primary Key (e.g. EVT-2026-001)' },
      { name: 'category_id', type: 'VARCHAR(16)', nullable: false, isFk: true, references: 'CATEGORIES.category_id', description: 'Foreign Key to CATEGORIES' },
      { name: 'coordinator_id', type: 'VARCHAR(16)', nullable: false, isFk: true, references: 'COORDINATORS.coordinator_id', description: 'Foreign Key to COORDINATORS' },
      { name: 'title', type: 'VARCHAR(200)', nullable: false, description: 'Official event title' },
      { name: 'description', type: 'TEXT', nullable: false, description: 'Full syllabus / agenda description' },
      { name: 'start_date', type: 'DATE', nullable: false, description: 'Start date (YYYY-MM-DD)' },
      { name: 'end_date', type: 'DATE', nullable: false, description: 'End date (YYYY-MM-DD)' },
      { name: 'cert_threshold_pct', type: 'DECIMAL(5,2)', nullable: false, description: 'Minimum attendance % for certificate (0-100)' },
      { name: 'fee', type: 'DECIMAL(10,2)', nullable: false, description: 'Registration fee in USD (CHECK fee >= 0)' },
      { name: 'max_capacity', type: 'INTEGER', nullable: false, description: 'Event participant cap' },
      { name: 'status', type: 'VARCHAR(20)', nullable: false, description: 'DRAFT, PUBLISHED, COMPLETED' }
    ]
  },
  {
    tableName: 'SESSIONS',
    description: 'Individual scheduled timetable slots assigned to a venue and speaker with overlap checks.',
    primaryKey: ['session_id'],
    foreignKeys: [
      { column: 'event_id', referencesTable: 'EVENTS', referencesColumn: 'event_id' },
      { column: 'venue_id', referencesTable: 'VENUES', referencesColumn: 'venue_id' },
      { column: 'speaker_id', referencesTable: 'SPEAKERS', referencesColumn: 'speaker_id' }
    ],
    uniqueKeys: [['venue_id', 'date', 'start_time']],
    checkConstraints: ['start_time < end_time'],
    attributes: [
      { name: 'session_id', type: 'VARCHAR(20)', nullable: false, isPk: true, description: 'Primary Key (e.g. SES-101)' },
      { name: 'event_id', type: 'VARCHAR(24)', nullable: false, isFk: true, references: 'EVENTS.event_id', description: 'Parent Event FK' },
      { name: 'venue_id', type: 'VARCHAR(16)', nullable: false, isFk: true, references: 'VENUES.venue_id', description: 'Assigned Venue FK' },
      { name: 'speaker_id', type: 'VARCHAR(16)', nullable: false, isFk: true, references: 'SPEAKERS.speaker_id', description: 'Session Presenter FK' },
      { name: 'title', type: 'VARCHAR(200)', nullable: false, description: 'Session topic title' },
      { name: 'date', type: 'DATE', nullable: false, description: 'Session execution date' },
      { name: 'start_time', type: 'TIME', nullable: false, description: 'Start hour & minute (24hr)' },
      { name: 'end_time', type: 'TIME', nullable: false, description: 'End hour & minute (24hr)' }
    ]
  },
  {
    tableName: 'PARTICIPANTS',
    description: 'Students, researchers, and external guests attending events.',
    primaryKey: ['participant_id'],
    uniqueKeys: [['student_id'], ['email']],
    foreignKeys: [],
    attributes: [
      { name: 'participant_id', type: 'VARCHAR(16)', nullable: false, isPk: true, description: 'Primary Key (e.g. PT-01)' },
      { name: 'name', type: 'VARCHAR(120)', nullable: false, description: 'Full participant name' },
      { name: 'email', type: 'VARCHAR(160)', nullable: false, description: 'Institutional email' },
      { name: 'student_id', type: 'VARCHAR(32)', nullable: false, description: 'Unique Student ID (e.g. STU-2024-881)' },
      { name: 'institution', type: 'VARCHAR(140)', nullable: false, description: 'Home university / college' },
      { name: 'department', type: 'VARCHAR(100)', nullable: false, description: 'Field of study' }
    ]
  },
  {
    tableName: 'REGISTRATIONS',
    description: 'Associative entity joining PARTICIPANTS and EVENTS with UNIQUE constraint.',
    primaryKey: ['registration_id'],
    foreignKeys: [
      { column: 'participant_id', referencesTable: 'PARTICIPANTS', referencesColumn: 'participant_id' },
      { column: 'event_id', referencesTable: 'EVENTS', referencesColumn: 'event_id' }
    ],
    uniqueKeys: [['participant_id', 'event_id']],
    attributes: [
      { name: 'registration_id', type: 'VARCHAR(24)', nullable: false, isPk: true, description: 'Primary Key (e.g. REG-901)' },
      { name: 'participant_id', type: 'VARCHAR(16)', nullable: false, isFk: true, references: 'PARTICIPANTS.participant_id', description: 'Participant FK' },
      { name: 'event_id', type: 'VARCHAR(24)', nullable: false, isFk: true, references: 'EVENTS.event_id', description: 'Target Event FK' },
      { name: 'registered_at', type: 'TIMESTAMP', nullable: false, description: 'Timestamp of enrollment' },
      { name: 'status', type: 'VARCHAR(24)', nullable: false, description: 'CONFIRMED, PENDING_PAYMENT, WAITLIST' },
      { name: 'qr_code_token', type: 'VARCHAR(64)', nullable: false, description: 'Cryptographic ticket check-in token' }
    ]
  },
  {
    tableName: 'PAYMENTS',
    description: 'Financial ledger recording transaction settlements with strictly non-negative amounts.',
    primaryKey: ['payment_id'],
    foreignKeys: [
      { column: 'registration_id', referencesTable: 'REGISTRATIONS', referencesColumn: 'registration_id' }
    ],
    checkConstraints: ['amount >= 0.00'],
    attributes: [
      { name: 'payment_id', type: 'VARCHAR(24)', nullable: false, isPk: true, description: 'Primary Key (e.g. PAY-501)' },
      { name: 'registration_id', type: 'VARCHAR(24)', nullable: false, isFk: true, references: 'REGISTRATIONS.registration_id', description: 'Registration FK' },
      { name: 'amount', type: 'DECIMAL(10,2)', nullable: false, description: 'Billed amount (USD) >= 0.00' },
      { name: 'payment_method', type: 'VARCHAR(32)', nullable: false, description: 'CREDIT_CARD, UPI, STUDENT_BILLING' },
      { name: 'transaction_ref', type: 'VARCHAR(64)', nullable: false, description: 'Gateway reconciliation reference' },
      { name: 'status', type: 'VARCHAR(20)', nullable: false, description: 'COMPLETED, PENDING, REFUNDED' },
      { name: 'paid_at', type: 'TIMESTAMP', nullable: false, description: 'Gateway settlement timestamp' }
    ]
  },
  {
    tableName: 'ATTENDANCE',
    description: 'Physical or digital check-in timestamps per session verified by staff.',
    primaryKey: ['attendance_id'],
    foreignKeys: [
      { column: 'registration_id', referencesTable: 'REGISTRATIONS', referencesColumn: 'registration_id' },
      { column: 'session_id', referencesTable: 'SESSIONS', referencesColumn: 'session_id' }
    ],
    uniqueKeys: [['registration_id', 'session_id']],
    attributes: [
      { name: 'attendance_id', type: 'VARCHAR(24)', nullable: false, isPk: true, description: 'Primary Key (e.g. ATT-1001)' },
      { name: 'registration_id', type: 'VARCHAR(24)', nullable: false, isFk: true, references: 'REGISTRATIONS.registration_id', description: 'Registration FK' },
      { name: 'session_id', type: 'VARCHAR(20)', nullable: false, isFk: true, references: 'SESSIONS.session_id', description: 'Session FK' },
      { name: 'check_in_time', type: 'TIMESTAMP', nullable: false, description: 'Exact check-in verification time' },
      { name: 'status', type: 'VARCHAR(16)', nullable: false, description: 'PRESENT, EXCUSED, ABSENT' },
      { name: 'verified_by', type: 'VARCHAR(80)', nullable: false, description: 'Authorized scanner or coordinator' }
    ]
  },
  {
    tableName: 'CERTIFICATES',
    description: 'Cryptographically signed institutional credentials unlocked strictly upon threshold fulfillment.',
    primaryKey: ['certificate_id'],
    foreignKeys: [
      { column: 'registration_id', referencesTable: 'REGISTRATIONS', referencesColumn: 'registration_id' }
    ],
    uniqueKeys: [['registration_id']],
    checkConstraints: ['attendance_pct >= EVENT.cert_threshold_pct'],
    attributes: [
      { name: 'certificate_id', type: 'VARCHAR(32)', nullable: false, isPk: true, description: 'Primary Key (e.g. CERT-2026-789)' },
      { name: 'registration_id', type: 'VARCHAR(24)', nullable: false, isFk: true, references: 'REGISTRATIONS.registration_id', description: 'Registration FK' },
      { name: 'issue_date', type: 'DATE', nullable: false, description: 'Date of credential issuance' },
      { name: 'verification_hash', type: 'VARCHAR(64)', nullable: false, description: 'Cryptographic SHA verification token' },
      { name: 'attendance_pct', type: 'DECIMAL(5,2)', nullable: false, description: 'Audited attendance percentage' }
    ]
  },
  {
    tableName: 'FEEDBACK',
    description: 'Post-event participant evaluations and qualitative institutional appraisals.',
    primaryKey: ['feedback_id'],
    foreignKeys: [
      { column: 'registration_id', referencesTable: 'REGISTRATIONS', referencesColumn: 'registration_id' }
    ],
    uniqueKeys: [['registration_id']],
    checkConstraints: ['overall_rating BETWEEN 1 AND 5'],
    attributes: [
      { name: 'feedback_id', type: 'VARCHAR(24)', nullable: false, isPk: true, description: 'Primary Key (e.g. FDB-301)' },
      { name: 'registration_id', type: 'VARCHAR(24)', nullable: false, isFk: true, references: 'REGISTRATIONS.registration_id', description: 'Registration FK' },
      { name: 'overall_rating', type: 'INTEGER', nullable: false, description: '1 to 5 star rating' },
      { name: 'content_rating', type: 'INTEGER', nullable: false, description: '1 to 5 star rating' },
      { name: 'venue_rating', type: 'INTEGER', nullable: false, description: '1 to 5 star rating' },
      { name: 'organization_rating', type: 'INTEGER', nullable: false, description: '1 to 5 star rating' },
      { name: 'comments', type: 'TEXT', nullable: true, description: 'Qualitative student feedback' }
    ]
  }
];
