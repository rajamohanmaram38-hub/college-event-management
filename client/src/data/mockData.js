// Mock Initial Data for College Event Management Portal

export const CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: 'Sparkles' },
  { id: 'Tech & Coding', name: 'Tech & Coding', icon: 'Code', color: 'from-blue-600 to-indigo-600' },
  { id: 'Workshops & Seminars', name: 'Workshops & Seminars', icon: 'BookOpen', color: 'from-amber-500 to-orange-600' },
  { id: 'Cultural & Arts', name: 'Cultural & Arts', icon: 'Music', color: 'from-pink-500 to-rose-600' },
  { id: 'Sports & Fitness', name: 'Sports & Fitness', icon: 'Trophy', color: 'from-emerald-500 to-teal-600' },
  { id: 'Career & Placement', name: 'Career & Placement', icon: 'Briefcase', color: 'from-purple-600 to-violet-600' },
  { id: 'Club Activities', name: 'Club Activities', icon: 'Users', color: 'from-cyan-500 to-blue-500' }
];

export const INITIAL_EVENTS = [
  {
    id: 'evt-1',
    name: 'HackNova 2026: 24-Hour Inter-College Hackathon',
    description: 'Join over 250+ aspiring builders for an exhilarating 24-hour hackathon focused on Artificial Intelligence, Web3, and Sustainable Tech. Form teams of 2-4 members, receive mentorship from industry engineers at Google & Microsoft, and compete for a prize pool of $5,000 plus interview fast-tracks!',
    date: '2026-10-24',
    time: '09:00 AM - 09:00 AM (Next Day)',
    venue: 'Alan Turing Innovation Centre, 4th Floor',
    organizer: 'Department of Computer Science & GDSC Club',
    category: 'Tech & Coding',
    registrationDeadline: '2026-10-22',
    maxParticipants: 150,
    bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    prerequisites: 'Bring your laptop, charger, student ID card, and enthusiasm. Meals & beverages will be provided.',
    agenda: [
      { time: '09:00 AM', title: 'Check-in & Team Registration' },
      { time: '10:30 AM', title: 'Keynote & Problem Statements Release' },
      { time: '12:00 PM', title: 'Hacking Begins & Mentor Round 1' },
      { time: '08:00 PM', title: 'Dinner & Mid-way Progress Check' },
      { time: '08:00 AM', title: 'Code Freeze & Project Submission' },
      { time: '10:00 AM', title: 'Final Pitches & Award Ceremony' }
    ],
    contactEmail: 'hacknova@apex.college.edu',
    featured: true
  },
  {
    id: 'evt-2',
    name: 'Hands-on Deep Learning & LLM Fine-Tuning Workshop',
    description: 'A deep-dive technical masterclass on transformer architectures, instruction fine-tuning using LoRA/QLoRA, and building enterprise RAG pipelines with Python and PyTorch. Led by AI researchers from the Institute of Data Sciences.',
    date: '2026-10-28',
    time: '02:00 PM - 06:00 PM',
    venue: 'Sir C.V. Raman Auditorium, Science Block',
    organizer: 'AI & Robotics Research Society',
    category: 'Workshops & Seminars',
    registrationDeadline: '2026-10-26',
    maxParticipants: 80,
    bannerUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    prerequisites: 'Basic Python proficiency and familiarization with matrix operations. Google Colab environment provided.',
    agenda: [
      { time: '02:00 PM', title: 'Attention Mechanism & Transformer Core' },
      { time: '03:15 PM', title: 'Hands-on Lab: Fine-Tuning Open Source LLMs' },
      { time: '04:45 PM', title: 'Coffee Break & Q&A' },
      { time: '05:00 PM', title: 'RAG Pipeline Implementation & Evaluation' }
    ],
    contactEmail: 'ai.society@apex.college.edu',
    featured: true
  },
  {
    id: 'evt-3',
    name: 'AURA 2026: Annual Inter-Department Cultural Fest',
    description: 'The pinnacle of collegiate expression! Experience electrifying battle of the bands, classical solo and western dance competitions, stage drama, street play showdowns, and food carnivals featuring authentic regional cuisines.',
    date: '2026-11-05',
    time: '10:00 AM - 10:00 PM',
    venue: 'University Central Open Air Amphitheatre',
    organizer: 'Student Cultural Committee & Arts Council',
    category: 'Cultural & Arts',
    registrationDeadline: '2026-11-02',
    maxParticipants: 500,
    bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    prerequisites: 'All registered college students with valid RFID ID cards. Outside guest passes subject to verification.',
    agenda: [
      { time: '10:00 AM', title: 'Inauguration & Acoustic Showcase' },
      { time: '01:00 PM', title: 'Street Play (Nukkad Natak) Competition' },
      { time: '04:00 PM', title: 'Inter-College Dance Battle' },
      { time: '07:30 PM', title: 'Celebrity Music Concert & DJ Night' }
    ],
    contactEmail: 'aura.cult@apex.college.edu',
    featured: true
  },
  {
    id: 'evt-4',
    name: 'Fall 2026 Campus Placement & Internship Expo',
    description: 'Direct networking with 40+ leading recruiters across Technology, Management Consulting, Core Engineering, and Finance. Bring 5 hard copies of your vetted resume and dress in business formals.',
    date: '2026-11-12',
    time: '09:30 AM - 05:00 PM',
    venue: 'Convention Centre, North Campus Plaza',
    organizer: 'Training & Placement Cell (T&P)',
    category: 'Career & Placement',
    registrationDeadline: '2026-11-08',
    maxParticipants: 350,
    bannerUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    prerequisites: 'Eligible for 3rd and final year undergraduate & postgraduate students. Pre-approved placement profile required.',
    agenda: [
      { time: '09:30 AM', title: 'Recruiter Inauguration & Keynote Address' },
      { time: '10:30 AM', title: 'Company Booth Walkthroughs & Resume Drops' },
      { time: '02:00 PM', title: 'Spot Technical Screening & GD Rounds' },
      { time: '04:30 PM', title: 'Shortlisting Announcements' }
    ],
    contactEmail: 'placements@apex.college.edu',
    featured: false
  },
  {
    id: 'evt-5',
    name: 'Inter-Department Futsal Championship 2026',
    description: 'Fast-paced 5v5 indoor football tournament spanning 3 thrilling days. 16 departmental teams battle for the coveted Chancellor Cup and individual Golden Boot honors.',
    date: '2026-11-18',
    time: '04:00 PM - 08:30 PM',
    venue: 'Olympic Indoor Sports Complex, Turf A & B',
    organizer: 'University Sports Board',
    category: 'Sports & Fitness',
    registrationDeadline: '2026-11-15',
    maxParticipants: 120,
    bannerUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    prerequisites: 'Standard futsal/turf shoes and shin guards mandatory. Medical waiver signed at gate.',
    agenda: [
      { time: '04:00 PM', title: 'Captains Briefing & Draw Reveal' },
      { time: '04:30 PM', title: 'Preliminary Knockout Fixtures' },
      { time: '07:00 PM', title: 'Quarter-Finals' }
    ],
    contactEmail: 'sports@apex.college.edu',
    featured: false
  },
  {
    id: 'evt-6',
    name: 'Leadership Fireside Chat: From Campus Project to $50M Series B',
    description: 'Exclusive keynote and interactive Q&A session with alumni founder Ananya Rao, CEO of NovaCloud. Learn early stage validation, venture capital fundraising, and navigating technical co-founder dynamics.',
    date: '2026-11-22',
    time: '03:00 PM - 05:00 PM',
    venue: 'Management Auditorium, MBA Block',
    organizer: 'Entrepreneurship Cell (E-Cell)',
    category: 'Workshops & Seminars',
    registrationDeadline: '2026-11-20',
    maxParticipants: 140,
    bannerUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    prerequisites: 'Open to all students across all academic faculties. Submit your questions during RSVP for priority selection.',
    agenda: [
      { time: '03:00 PM', title: 'Introduction & Journey Keynote' },
      { time: '03:45 PM', title: 'Fireside Discussion on Silicon Valley Scaling' },
      { time: '04:30 PM', title: 'Audience Open Mic Q&A & Photo Session' }
    ],
    contactEmail: 'ecell@apex.college.edu',
    featured: false
  },
  {
    id: 'evt-7',
    name: 'RoboWars & Autonomous Drone Navigation Challenge',
    description: 'Witness combat robots duel in an armored arena, followed by precision autonomous obstacle avoidance racing by student-built quadcopters. Live telemetry and commentary throughout the afternoon.',
    date: '2026-11-28',
    time: '11:00 AM - 05:00 PM',
    venue: 'Mechanical Engineering Workshop Quad',
    organizer: 'Mechatronics & Drone Innovation Club',
    category: 'Tech & Coding',
    registrationDeadline: '2026-11-25',
    maxParticipants: 160,
    bannerUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    prerequisites: 'Safety glasses provided at entry. Audience barrier restrictions apply.',
    agenda: [
      { time: '11:00 AM', title: 'Safety Inspection & Weigh-In' },
      { time: '12:00 PM', title: 'Round 1 Combat Matches (30kg Category)' },
      { time: '02:30 PM', title: 'Autonomous Drone Time-Trial Challenge' },
      { time: '04:00 PM', title: 'RoboWars Grand Final' }
    ],
    contactEmail: 'robotics@apex.college.edu',
    featured: false
  },
  {
    id: 'evt-8',
    name: 'Campus Eco-Drive: Tree Plantation & Solar Awareness',
    description: 'Contribute to a greener campus! We will plant 200 indigenous tree saplings along the southern campus lake perimeter and conduct solar energy demonstration walks with sustainability faculty.',
    date: '2026-12-02',
    time: '08:00 AM - 12:00 PM',
    venue: 'South Lake Campus Promenade',
    organizer: 'Rotaract Club & Green Earth Cell',
    category: 'Club Activities',
    registrationDeadline: '2026-11-30',
    maxParticipants: 100,
    bannerUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    prerequisites: 'Wear comfortable outdoor attire and sturdy shoes. Gardening gloves and refreshments provided.',
    agenda: [
      { time: '08:00 AM', title: 'Assembly & Safety Orientation' },
      { time: '08:30 AM', title: 'Sapling Distribution & Zone Planting' },
      { time: '10:45 AM', title: 'Solar Array Walk & Eco-Pledge' },
      { time: '11:30 AM', title: 'Refreshments & Certificate of Volunteering' }
    ],
    contactEmail: 'green@apex.college.edu',
    featured: false
  }
];

export const INITIAL_STUDENTS = [
  {
    id: 'stu-101',
    fullName: 'Alex Chen',
    email: 'alex.chen@student.apex.edu',
    password: 'password123',
    studentIdNumber: 'APX-2023-CS-084',
    department: 'Computer Science & Engineering',
    academicYear: '3rd Year',
    registeredAt: '2026-09-01'
  },
  {
    id: 'stu-102',
    fullName: 'Priya Sharma',
    email: 'priya.s@student.apex.edu',
    password: 'password123',
    studentIdNumber: 'APX-2024-EC-112',
    department: 'Electronics & Communication',
    academicYear: '2nd Year',
    registeredAt: '2026-09-05'
  },
  {
    id: 'stu-103',
    fullName: 'Marcus Johnson',
    email: 'marcus.j@student.apex.edu',
    password: 'password123',
    studentIdNumber: 'APX-2022-ME-045',
    department: 'Mechanical Engineering',
    academicYear: '4th Year',
    registeredAt: '2026-09-10'
  }
];

export const INITIAL_ADMIN = {
  id: 'admin-1',
  fullName: 'Prof. David Vance',
  email: 'admin@college.edu',
  password: 'admin123',
  designation: 'Dean of Student Affairs & Campus Events Chair',
  department: 'Administration'
};

export const INITIAL_REGISTRATIONS = [
  {
    id: 'reg-001',
    eventId: 'evt-1',
    studentId: 'stu-101',
    studentName: 'Alex Chen',
    studentEmail: 'alex.chen@student.apex.edu',
    studentIdNumber: 'APX-2023-CS-084',
    department: 'Computer Science & Engineering',
    ticketCode: 'CAMPUS-EVT1-9A4B',
    registeredAt: '2026-10-02T14:30:00Z',
    status: 'CONFIRMED'
  },
  {
    id: 'reg-002',
    eventId: 'evt-1',
    studentId: 'stu-102',
    studentName: 'Priya Sharma',
    studentEmail: 'priya.s@student.apex.edu',
    studentIdNumber: 'APX-2024-EC-112',
    department: 'Electronics & Communication',
    ticketCode: 'CAMPUS-EVT1-2K7L',
    registeredAt: '2026-10-03T11:15:00Z',
    status: 'CONFIRMED'
  },
  {
    id: 'reg-003',
    eventId: 'evt-2',
    studentId: 'stu-101',
    studentName: 'Alex Chen',
    studentEmail: 'alex.chen@student.apex.edu',
    studentIdNumber: 'APX-2023-CS-084',
    department: 'Computer Science & Engineering',
    ticketCode: 'CAMPUS-EVT2-8M3X',
    registeredAt: '2026-10-04T09:45:00Z',
    status: 'CONFIRMED'
  },
  {
    id: 'reg-004',
    eventId: 'evt-3',
    studentId: 'stu-103',
    studentName: 'Marcus Johnson',
    studentEmail: 'marcus.j@student.apex.edu',
    studentIdNumber: 'APX-2022-ME-045',
    department: 'Mechanical Engineering',
    ticketCode: 'CAMPUS-EVT3-5V1Q',
    registeredAt: '2026-10-05T16:20:00Z',
    status: 'CONFIRMED'
  }
];
