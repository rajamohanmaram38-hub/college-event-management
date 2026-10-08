-- Initial Seed Data for College Event Management

-- Clean existing data
DELETE FROM registrations;
DELETE FROM events;
DELETE FROM students;
DELETE FROM admins;

-- Admins
INSERT INTO admins (id, fullName, email, password, designation, department)
VALUES ('admin-1', 'Prof. David Vance', 'admin@college.edu', 'admin123', 'Dean of Student Affairs & Campus Events Chair', 'Administration');

-- Students
INSERT INTO students (id, fullName, email, password, studentIdNumber, department, academicYear, registeredAt)
VALUES
('stu-101', 'Alex Chen', 'alex.chen@student.apex.edu', 'password123', 'APX-2023-CS-084', 'Computer Science & Engineering', '3rd Year', '2026-09-01'),
('stu-102', 'Priya Sharma', 'priya.s@student.apex.edu', 'password123', 'APX-2024-EC-112', 'Electronics & Communication', '2nd Year', '2026-09-05'),
('stu-103', 'Marcus Johnson', 'marcus.j@student.apex.edu', 'password123', 'APX-2022-ME-045', 'Mechanical Engineering', '4th Year', '2026-09-10');

-- Events
INSERT INTO events (id, name, description, date, time, venue, organizer, category, registrationDeadline, maxParticipants, bannerUrl, prerequisites, agenda, contactEmail, featured, createdAt)
VALUES
(
  'evt-1',
  'HackNova 2026: 24-Hour Inter-College Hackathon',
  'Join over 250+ aspiring builders for an exhilarating 24-hour hackathon focused on Artificial Intelligence, Web3, and Sustainable Tech. Form teams of 2-4 members, receive mentorship from industry engineers at Google & Microsoft, and compete for a prize pool of $5,000 plus interview fast-tracks!',
  '2026-10-24',
  '09:00 AM - 09:00 AM (Next Day)',
  'Alan Turing Innovation Centre, 4th Floor',
  'Department of Computer Science & GDSC Club',
  'Tech & Coding',
  '2026-10-22',
  150,
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
  'Bring your laptop, charger, student ID card, and enthusiasm. Meals & beverages will be provided.',
  '[{"time":"09:00 AM","title":"Check-in & Team Registration"},{"time":"10:30 AM","title":"Keynote & Problem Statements Release"},{"time":"12:00 PM","title":"Hacking Begins & Mentor Round 1"},{"time":"08:00 PM","title":"Dinner & Mid-way Progress Check"},{"time":"08:00 AM","title":"Code Freeze & Project Submission"},{"time":"10:00 AM","title":"Final Pitches & Award Ceremony"}]',
  'hacknova@apex.college.edu',
  1,
  '2026-10-01'
),
(
  'evt-2',
  'Hands-on Deep Learning & LLM Fine-Tuning Workshop',
  'A deep-dive technical masterclass on transformer architectures, instruction fine-tuning using LoRA/QLoRA, and building enterprise RAG pipelines with Python and PyTorch. Led by AI researchers from the Institute of Data Sciences.',
  '2026-10-28',
  '02:00 PM - 06:00 PM',
  'Sir C.V. Raman Auditorium, Science Block',
  'AI & Robotics Research Society',
  'Workshops & Seminars',
  '2026-10-26',
  80,
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
  'Basic Python proficiency and familiarization with matrix operations. Google Colab environment provided.',
  '[{"time":"02:00 PM","title":"Attention Mechanism & Transformer Core"},{"time":"03:15 PM","title":"Hands-on Lab: Fine-Tuning Open Source LLMs"},{"time":"04:45 PM","title":"Coffee Break & Q&A"},{"time":"05:00 PM","title":"RAG Pipeline Implementation & Evaluation"}]',
  'ai.society@apex.college.edu',
  1,
  '2026-10-01'
),
(
  'evt-3',
  'AURA 2026: Annual Inter-Department Cultural Fest',
  'The pinnacle of collegiate expression! Experience electrifying battle of the bands, classical solo and western dance competitions, stage drama, street play showdowns, and food carnivals featuring authentic regional cuisines.',
  '2026-11-05',
  '10:00 AM - 10:00 PM',
  'University Central Open Air Amphitheatre',
  'Student Cultural Committee & Arts Council',
  'Cultural & Arts',
  '2026-11-02',
  500,
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
  'All registered college students with valid RFID ID cards. Outside guest passes subject to verification.',
  '[{"time":"10:00 AM","title":"Inauguration & Acoustic Showcase"},{"time":"01:00 PM","title":"Street Play (Nukkad Natak) Competition"},{"time":"04:00 PM","title":"Inter-College Dance Battle"},{"time":"07:30 PM","title":"Celebrity Music Concert & DJ Night"}]',
  'aura.cult@apex.college.edu',
  1,
  '2026-10-01'
),
(
  'evt-4',
  'Fall 2026 Campus Placement & Internship Expo',
  'Direct networking with 40+ leading recruiters across Technology, Management Consulting, Core Engineering, and Finance. Bring 5 hard copies of your vetted resume and dress in business formals.',
  '2026-11-12',
  '09:30 AM - 05:00 PM',
  'Convention Centre, North Campus Plaza',
  'Training & Placement Cell (T&P)',
  'Career & Placement',
  '2026-11-08',
  350,
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
  'Eligible for 3rd and final year undergraduate & postgraduate students. Pre-approved placement profile required.',
  '[{"time":"09:30 AM","title":"Recruiter Inauguration & Keynote Address"},{"time":"10:30 AM","title":"Company Booth Walkthroughs & Resume Drops"},{"time":"02:00 PM","title":"Spot Technical Screening & GD Rounds"},{"time":"04:30 PM","title":"Shortlisting Announcements"}]',
  'placements@apex.college.edu',
  0,
  '2026-10-01'
),
(
  'evt-5',
  'Inter-Department Futsal Championship 2026',
  'Fast-paced 5v5 indoor football tournament spanning 3 thrilling days. 16 departmental teams battle for the coveted Chancellor Cup and individual Golden Boot honors.',
  '2026-11-18',
  '04:00 PM - 08:30 PM',
  'Olympic Indoor Sports Complex, Turf A & B',
  'University Sports Board',
  'Sports & Fitness',
  '2026-11-15',
  120,
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
  'Standard futsal/turf shoes and shin guards mandatory. Medical waiver signed at gate.',
  '[{"time":"04:00 PM","title":"Captains Briefing & Draw Reveal"},{"time":"04:30 PM","title":"Preliminary Knockout Fixtures"},{"time":"07:00 PM","title":"Quarter-Finals"}]',
  'sports@apex.college.edu',
  0,
  '2026-10-01'
),
(
  'evt-6',
  'Leadership Fireside Chat: From Campus Project to $50M Series B',
  'Exclusive keynote and interactive Q&A session with alumni founder Ananya Rao, CEO of NovaCloud. Learn early stage validation, venture capital fundraising, and navigating technical co-founder dynamics.',
  '2026-11-22',
  '03:00 PM - 05:00 PM',
  'Management Auditorium, MBA Block',
  'Entrepreneurship Cell (E-Cell)',
  'Workshops & Seminars',
  '2026-11-20',
  140,
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
  'Open to all students across all academic faculties. Submit your questions during RSVP for priority selection.',
  '[{"time":"03:00 PM","title":"Introduction & Journey Keynote"},{"time":"03:45 PM","title":"Fireside Discussion on Silicon Valley Scaling"},{"time":"04:30 PM","title":"Audience Open Mic Q&A & Photo Session"}]',
  'ecell@apex.college.edu',
  0,
  '2026-10-01'
),
(
  'evt-7',
  'RoboWars & Autonomous Drone Navigation Challenge',
  'Witness combat robots duel in an armored arena, followed by precision autonomous obstacle avoidance racing by student-built quadcopters. Live telemetry and commentary throughout the afternoon.',
  '2026-11-28',
  '11:00 AM - 05:00 PM',
  'Mechanical Engineering Workshop Quad',
  'Mechatronics & Drone Innovation Club',
  'Tech & Coding',
  '2026-11-25',
  160,
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
  'Safety glasses provided at entry. Audience barrier restrictions apply.',
  '[{"time":"11:00 AM","title":"Safety Inspection & Weigh-In"},{"time":"12:00 PM","title":"Round 1 Combat Matches (30kg Category)"},{"time":"02:30 PM","title":"Autonomous Drone Time-Trial Challenge"},{"time":"04:00 PM","title":"RoboWars Grand Final"}]',
  'robotics@apex.college.edu',
  0,
  '2026-10-01'
),
(
  'evt-8',
  'Campus Eco-Drive: Tree Plantation & Solar Awareness',
  'Contribute to a greener campus! We will plant 200 indigenous tree saplings along the southern campus lake perimeter and conduct solar energy demonstration walks with sustainability faculty.',
  '2026-12-02',
  '08:00 AM - 12:00 PM',
  'South Lake Campus Promenade',
  'Rotaract Club & Green Earth Cell',
  'Club Activities',
  '2026-11-30',
  100,
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
  'Wear comfortable outdoor attire and sturdy shoes. Gardening gloves and refreshments provided.',
  '[{"time":"08:00 AM","title":"Assembly & Safety Orientation"},{"time":"08:30 AM","title":"Sapling Distribution & Zone Planting"},{"time":"10:45 AM","title":"Solar Array Walk & Eco-Pledge"},{"time":"11:30 AM","title":"Refreshments & Certificate of Volunteering"}]',
  'green@apex.college.edu',
  0,
  '2026-10-01'
);

-- Registrations
INSERT INTO registrations (id, eventId, studentId, studentName, studentEmail, studentIdNumber, department, ticketCode, registeredAt, status)
VALUES
('reg-001', 'evt-1', 'stu-101', 'Alex Chen', 'alex.chen@student.apex.edu', 'APX-2023-CS-084', 'Computer Science & Engineering', 'CAMPUS-EVT1-9A4B', '2026-10-02T14:30:00Z', 'CONFIRMED'),
('reg-002', 'evt-1', 'stu-102', 'Priya Sharma', 'priya.s@student.apex.edu', 'APX-2024-EC-112', 'Electronics & Communication', 'CAMPUS-EVT1-2K7L', '2026-10-03T11:15:00Z', 'CONFIRMED'),
('reg-003', 'evt-2', 'stu-101', 'Alex Chen', 'alex.chen@student.apex.edu', 'APX-2023-CS-084', 'Computer Science & Engineering', 'CAMPUS-EVT2-8M3X', '2026-10-04T09:45:00Z', 'CONFIRMED'),
('reg-004', 'evt-3', 'stu-103', 'Marcus Johnson', 'marcus.j@student.apex.edu', 'APX-2022-ME-045', 'Mechanical Engineering', 'CAMPUS-EVT3-5V1Q', '2026-10-05T16:20:00Z', 'CONFIRMED');
