# ⚙️ Server Tier (`server/`)

This directory houses the Node.js + Express backend REST API for the College Event Management system.

---

## 📂 Directory Structure

```
server/
├── .env                  # Environment configurations (PORT, CLIENT_URL)
├── .env.example          # Template environment file
├── package.json          # Dependencies (express, cors, dotenv)
├── README.md             # Backend documentation
└── src/
    ├── server.js         # Main Express entry point & middleware mounting
    ├── controllers/      # Route logic handlers
    │   ├── authController.js
    │   ├── eventController.js
    │   ├── registrationController.js
    │   └── statsController.js
    ├── models/           # Data access layer connecting to database/
    │   ├── adminModel.js
    │   ├── eventModel.js
    │   ├── registrationModel.js
    │   └── studentModel.js
    ├── middleware/       # Express middlewares
    │   ├── authMiddleware.js
    │   └── errorHandler.js
    └── routes/           # REST endpoints definition
        ├── authRoutes.js
        ├── eventRoutes.js
        ├── registrationRoutes.js
        └── statsRoutes.js
```

---

## 🔌 REST API Endpoints

### 1. Health
- `GET /api/health` - Check API and SQLite database health status

### 2. Authentication (`/api/auth`)
- `POST /api/auth/login/student` - Authenticate student (`email`, `password`)
- `POST /api/auth/register/student` - Create a student profile
- `POST /api/auth/login/admin` - Authenticate administrator
- `GET /api/auth/students` - List all students (admin only)

### 3. Events (`/api/events`)
- `GET /api/events` - Get all events (optional `?category=...&search=...`)
- `GET /api/events/:id` - Get event details and current attendee list
- `POST /api/events` - Create a new event
- `PUT /api/events/:id` - Update existing event details
- `DELETE /api/events/:id` - Delete an event
- `GET /api/events/:id/attendees` - List attendees for an event

### 4. Registrations (`/api/registrations`)
- `GET /api/registrations` - List all registrations
- `GET /api/registrations/student/:studentId` - List registrations for a student
- `POST /api/registrations` - Register a student for an event (issues unique ticket code)
- `DELETE /api/registrations/:id` - Cancel registration and free seat

### 5. Statistics (`/api/stats`)
- `GET /api/stats/overview` - Dashboard statistics (total events, registrations, students, upcoming)

---

## 🚀 Running the Server Independently

```bash
cd server
npm install
npm run dev
```
The server will start on `http://localhost:5000`.
