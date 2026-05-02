/**
 * ═══════════════════════════════════════════════════════════════════════
 *  LPU Talk — Health Check Route
 *  GET /api/health
 *  Simple health check endpoint — no auth required.
 * ═══════════════════════════════════════════════════════════════════════
 */

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'LPU Talk API',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
