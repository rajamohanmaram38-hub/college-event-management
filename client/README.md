# 💻 Client Tier (`client/`)

This directory houses the modern, responsive React frontend application for CampusPulse (College Event Management).

---

## 🛠️ Tech Stack

- **Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Routing:** React Router DOM v7
- **Icons:** Lucide React
- **Celebration Confetti:** `canvas-confetti`
- **API Client:** Native Fetch with Vite reverse-proxy configuration

---

## 📂 Directory Structure

```
client/
├── index.html            # Main HTML document
├── package.json          # Frontend dependencies & scripts
├── vite.config.js        # Vite configuration & /api proxy to server:5000
├── public/               # Static public assets
└── src/
    ├── api/
    │   └── apiClient.js  # Centralized API service for backend endpoints
    ├── assets/           # Media and styles
    ├── components/       # Reusable UI components (Navbar, EventCard, TicketModal, etc.)
    ├── context/          # React contexts (AuthContext, EventContext)
    ├── data/             # Fallback mock data and categories
    ├── pages/            # Page components (Home, Events, Details, Dashboards, Auth)
    ├── utils/            # Helper formatting, ticket code generator, date utils
    ├── App.jsx           # Application route definitions
    ├── main.jsx          # React DOM root entry
    └── index.css         # Tailwind & global stylesheet
```

---

## 🚀 Running the Client Independently

```bash
cd client
npm install
npm run dev
```

The frontend will run at `http://localhost:5173`. Any API calls to `/api/...` will automatically be proxied to `http://localhost:5000` via `vite.config.js`.
