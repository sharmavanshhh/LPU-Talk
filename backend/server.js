/**
 * ═══════════════════════════════════════════════════════════════════════
 *  LPU Talk — Express Server Entry Point
 *  Mounts all routes, configures CORS, rate limiting, and error handling.
 *
 *  Routes:
 *    POST   /api/chat                → Send message, get Gemini response
 *    GET    /api/chat/history        → Get user's chat history
 *    GET    /api/chat/sessions       → List user's chat sessions
 *    POST   /api/chat/sessions       → Create a new chat session
 *    GET    /api/chat/sessions/:id   → Get messages in a session
 *    DELETE /api/chat/sessions/:id   → Delete a session
 *    GET    /api/auth/me             → Get current user profile
 *    GET    /api/health              → Health check
 * ═══════════════════════════════════════════════════════════════════════
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// ─── Route Imports ────────────────────────────────────────────────────
const chatRoutes = require('./routes/chat');
const sessionRoutes = require('./routes/sessions');
const historyRoutes = require('./routes/history');
const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────

// CORS — allow frontend origin
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parse JSON request bodies
app.use(express.json({ limit: '10kb' }));

// Rate limiting on chat endpoint — 30 requests per minute per IP
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 30,
  message: { error: 'Too many requests. Please wait a moment before sending another message.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Mount Routes ─────────────────────────────────────────────────────
app.use('/api/chat', chatLimiter, chatRoutes);
app.use('/api/chat/sessions', sessionRoutes);
app.use('/api/chat/history', historyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Start Server ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  🎓 LPU Talk API Server`);
  console.log(`  ─────────────────────────`);
  console.log(`  Port:   ${PORT}`);
  console.log(`  Client: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
  console.log(`  Health: http://localhost:${PORT}/api/health\n`);
});
