const express = require('express');
const router = express.Router();

// GET /api - API Information
router.get('/', (req, res) => {
  res.json({
    message: '🚀 Welcome to REST API Dashboard',
    version: '1.0.0',
    endpoints: [
      '/api/users',
      '/api/posts',
      '/health'
    ],
    documentation: 'Visit the dashboard for full documentation'
  });
});

// GET /api/stats - API Statistics
router.get('/stats', (req, res) => {
  res.json({
    totalEndpoints: 8,
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

module.exports = router;