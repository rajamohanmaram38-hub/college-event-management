# 🗄️ Database Tier (`database/`)

This directory houses the database schema, seeds, data files, and database access utilities for the College Event Management system.

---

## 📂 Directory Structure

```
database/
├── data/
│   └── events.sqlite     # SQLite database file (created on init)
├── schema.sql            # Table definitions (students, admins, events, registrations)
├── seed.sql              # Initial mock data and seeds
├── dbConnection.js       # Database connection module and query helpers
├── initDb.js             # One-step DB setup and seed script
└── README.md             # Database documentation
```

---

## 📊 Database Tables

### 1. `students`
Stores registered university students:
- `id` (TEXT PRIMARY KEY) - e.g. `stu-101`
- `fullName` (TEXT)
- `email` (TEXT UNIQUE)
- `password` (TEXT)
- `studentIdNumber` (TEXT) - e.g. `APX-2023-CS-084`
- `department` (TEXT)
- `academicYear` (TEXT)
- `registeredAt` (TEXT)

### 2. `admins`
Stores administrative/faculty accounts:
- `id` (TEXT PRIMARY KEY) - e.g. `admin-1`
- `fullName` (TEXT)
- `email` (TEXT UNIQUE)
- `password` (TEXT)
- `designation` (TEXT)
- `department` (TEXT)

### 3. `events`
Stores campus events:
- `id` (TEXT PRIMARY KEY) - e.g. `evt-1`
- `name` (TEXT)
- `description` (TEXT)
- `date` (TEXT) - ISO date (YYYY-MM-DD)
- `time` (TEXT)
- `venue` (TEXT)
- `organizer` (TEXT)
- `category` (TEXT)
- `registrationDeadline` (TEXT)
- `maxParticipants` (INTEGER)
- `bannerUrl` (TEXT)
- `prerequisites` (TEXT)
- `agenda` (TEXT) - JSON serialized list of session items
- `contactEmail` (TEXT)
- `featured` (INTEGER 0 or 1)
- `createdAt` (TEXT)

### 4. `registrations`
Tracks RSVP passes and tickets:
- `id` (TEXT PRIMARY KEY) - e.g. `reg-001`
- `eventId` (TEXT FOREIGN KEY -> events.id)
- `studentId` (TEXT FOREIGN KEY -> students.id)
- `studentName` (TEXT)
- `studentEmail` (TEXT)
- `studentIdNumber` (TEXT)
- `department` (TEXT)
- `ticketCode` (TEXT UNIQUE) - e.g. `CAMPUS-EVT1-9A4B`
- `registeredAt` (TEXT)
- `status` (TEXT) - e.g. `CONFIRMED`, `CANCELLED`

---

## ⚡ Resetting / Re-seeding the Database

To reset or re-seed the database at any time, run from the root:
```bash
npm run db:setup
```
or from the `database/` directory:
```bash
node initDb.js
```
