import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { getDatabase } from '../../database/dbConnection.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic CORS setup supporting production Vercel frontend, local dev, and cloud platforms
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests or any origin dynamically
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0 || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Allow all vercel deployment subdomains (*.vercel.app)
    if (origin.endsWith('.vercel.app') || origin.includes('localhost')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-user-role']
}));

// Body parsing with 25MB limit for image data
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static file serving for uploaded event media
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  let sqliteStatus = 'UNKNOWN';
  let firestoreStatus = 'NOT_CONFIGURED';

  try {
    const db = getDatabase();
    const result = db.prepare('SELECT 1 as ok').get();
    sqliteStatus = result.ok === 1 ? 'CONNECTED' : 'ERROR';
  } catch {
    sqliteStatus = 'DISCONNECTED';
  }

  try {
    const { isFirebaseAdminConfigured, adminDb } = await import('./config/firebaseAdmin.js');
    if (isFirebaseAdminConfigured && adminDb) {
      firestoreStatus = 'CONNECTED (Firestore)';
    }
  } catch {
    firestoreStatus = 'ERROR';
  }

  res.json({
    status: 'UP',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    databases: {
      sqlite: sqliteStatus,
      firestore: firestoreStatus
    }
  });
});

// Mount modular API routers
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler for unhandled API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route ${req.method} ${req.baseUrl} not found.`
  });
});

// Centralized error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CampusPulse API Server running at: http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📅 Events endpoint: http://localhost:${PORT}/api/events`);
});

export default app;
