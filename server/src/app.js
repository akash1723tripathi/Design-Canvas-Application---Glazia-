const express = require('express');
const cors = require('cors');
const canvasRoutes = require('./routes/canvasRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// In production, ALLOWED_ORIGIN will be set to the deployed Vercel URL
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/canvases', canvasRoutes);

// Catch-all 404 for unmatched routes
app.use((_req, res) => res.status(404).json({ error: 'not found' }));

// Centralized error handler — must be registered last
app.use(errorHandler);

module.exports = app;
