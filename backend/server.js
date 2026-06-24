const express = require('express');
const cors    = require('cors');

const todoRoutes    = require('./routes/todos');
const historyRoutes = require('./routes/history');
const errorHandler  = require('./middleware/errorHandler');

/**
 * server.js — Bootstrap only.
 *
 * SOLID — Single Responsibility Principle:
 *   This file creates the Express app, wires middleware and routes, and starts
 *   the HTTP server. It contains zero business logic.
 */

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ───────────────────────────────────────────────────────────────

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────────────────

app.use('/api/todos',   todoRoutes);
app.use('/api/history', historyRoutes);

// Health-check endpoint (useful for CI / deployment checks)
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// 404 handler for unmatched routes
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ── Error Handling ───────────────────────────────────────────────────────────

// Must be registered AFTER all routes
app.use(errorHandler);

// ── Start Server ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✅  Ziptrrip Todo API running on http://localhost:${PORT}`);
  console.log(`    CORS enabled for http://localhost:3000`);
});
