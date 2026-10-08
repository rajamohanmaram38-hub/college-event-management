-- College Event Management Database Schema
-- Compatible with SQLite3, PostgreSQL, MySQL

-- 1. Students Table
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  fullName TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  studentIdNumber TEXT NOT NULL,
  department TEXT NOT NULL,
  academicYear TEXT NOT NULL,
  registeredAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Administrators Table
CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY,
  fullName TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  designation TEXT NOT NULL,
  department TEXT NOT NULL
);

-- 3. Events Table
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  venue TEXT NOT NULL,
  organizer TEXT NOT NULL,
  category TEXT NOT NULL,
  registrationDeadline TEXT NOT NULL,
  maxParticipants INTEGER NOT NULL DEFAULT 100,
  bannerUrl TEXT NOT NULL,
  prerequisites TEXT,
  agenda TEXT, -- JSON-stringified array of {time, title}
  contactEmail TEXT NOT NULL,
  featured INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Event Registrations Table
CREATE TABLE IF NOT EXISTS registrations (
  id TEXT PRIMARY KEY,
  eventId TEXT NOT NULL,
  studentId TEXT NOT NULL,
  studentName TEXT NOT NULL,
  studentEmail TEXT NOT NULL,
  studentIdNumber TEXT NOT NULL,
  department TEXT NOT NULL,
  ticketCode TEXT NOT NULL UNIQUE,
  registeredAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'CONFIRMED',
  FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_registrations_event ON registrations(eventId);
CREATE INDEX IF NOT EXISTS idx_registrations_student ON registrations(studentId);
CREATE INDEX IF NOT EXISTS idx_registrations_ticket ON registrations(ticketCode);
