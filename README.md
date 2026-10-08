# 🎓 CampusPulse • College Event Management Portal

A full-stack university event scheduling and registration portal architected with cleanly decoupled **Client**, **Server**, and **Database** layers.

---

## 🏛️ Project Architecture

```
college-event-management/
│
├── 📂 client/                → Frontend Application (React + Vite)
│   ├── public/               # Public static assets
│   ├── src/                  # React source code
│   │   ├── api/              # Centralized backend API client
│   │   ├── components/       # UI components (Navbar, EventCard, TicketModal, etc.)
│   │   ├── context/          # State management (AuthContext, EventContext)
│   │   ├── pages/            # View pages (Home, Events, Details, Dashboards, Auth)
│   │   ├── utils/            # Helper formatting, ticket code generation
│   │   ├── App.jsx           # Routing & layout configuration
│   │   ├── main.jsx          # App bootstrap entry
│   │   └── index.css         # Tailwind CSS styles
│   ├── package.json          # Frontend dependencies & scripts
│   ├── vite.config.js        # Vite config with /api reverse proxy
│   └── README.md             # Client tier documentation
│
├── 📂 server/                → Backend REST API (Node.js + Express)
│   ├── src/
│   │   ├── controllers/      # Handlers (Auth, Events, Registrations, Stats)
│   │   ├── models/           # Data access layer connecting to database/
│   │   ├── routes/           # REST endpoints definition
│   │   ├── middleware/       # Auth guards, role checks & error handler
│   │   └── server.js         # Express app entry point (port 5000)
│   ├── .env                  # Environment configuration
│   ├── .env.example          # Environment template
│   ├── package.json          # Server dependencies & scripts
│   └── README.md             # Server tier documentation
│
├── 📂 database/              → Database Tier (Schemas, Seeds, Engine)
│   ├── data/
│   │   └── events.sqlite     # SQLite relational database storage file
│   ├── schema.sql            # DDL definitions (students, admins, events, registrations)
│   ├── seed.sql              # Initial seed data SQL script
│   ├── dbConnection.js       # Database connection instance and query helper methods
│   ├── initDb.js             # Automated schema creation & data seeder script
│   └── README.md             # Database documentation
│
├── dev-runner.js             # Unified runner to start Client + Server simultaneously
├── package.json              # Master orchestrator script commands
└── README.md                 # Root architecture overview
```

---

## 🚀 Quick Start Guide

### 1. One-Step Setup
Run this from the project root to initialize the database and install all dependencies:
```bash
npm run setup
```
*(Or initialize just the database: `npm run db:setup`)*

### 2. Start Everything Together
To launch both the **Backend Server** (Port `5000`) and the **Frontend Client** (Port `5173`) in one command:
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser!

---

## 🛠️ Running Services Individually

If you prefer to run services in separate terminal tabs:

### Backend Server (`server/`)
```bash
npm run server
# Or: cd server && npm run dev
```
- API Base URL: `http://localhost:5000`
- Health check: `http://localhost:5000/api/health`

### Frontend Client (`client/`)
```bash
npm run client
# Or: cd client && npm run dev
```
- Client URL: `http://localhost:5173`

### Database Re-seed (`database/`)
```bash
npm run db:setup
# Or: node database/initDb.js
```

---

## 👥 Demo Credentials

| Role | Email | Password | Details |
|---|---|---|---|
| **Student** | `alex.chen@student.apex.edu` | `password123` | 3rd Year CS Student (has active registrations) |
| **Admin** | `admin@college.edu` | `admin123` | Dean of Student Affairs & Campus Events Chair |

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service & Database health status |
| `POST` | `/api/auth/login/student` | Authenticate student |
| `POST` | `/api/auth/register/student` | Register new student profile |
| `POST` | `/api/auth/login/admin` | Authenticate administrator |
| `GET` | `/api/events` | List all campus events |
| `GET` | `/api/events/:id` | Event details + attendee roster |
| `POST` | `/api/events` | Create new event (Admin) |
| `PUT` | `/api/events/:id` | Update event details (Admin) |
| `DELETE` | `/api/events/:id` | Delete event (Admin) |
| `GET` | `/api/registrations/student/:id` | Get student tickets & RSVP passes |
| `POST` | `/api/registrations` | RSVP & issue digital e-pass |
| `DELETE` | `/api/registrations/:id` | Cancel registration |
| `GET` | `/api/stats/overview` | Platform analytics & KPI counters |
