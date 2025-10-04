const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Request counter middleware
let totalRequests = 0;
app.use((req, res, next) => {
  totalRequests++;
  next();
});

// Database connection (MongoDB)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/api-dashboard';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Auto-load routes dari folder routes
const fs = require('fs');
const routesPath = path.join(__dirname, 'routes');

fs.readdirSync(routesPath).forEach(file => {
  if (file.endsWith('.js')) {
    const route = require(path.join(routesPath, file));
    const routeName = file === 'index.js' ? '' : `/${file.replace('.js', '')}`;
    app.use(`/api${routeName}`, route);
    console.log(`🔄 Loaded route: /api${routeName}`);
  }
});

// Routes untuk dashboard
app.get('/', (req, res) => {
  const routes = [];
  fs.readdirSync(routesPath).forEach(file => {
    if (file.endsWith('.js')) {
      const routeName = file === 'index.js' ? '' : `/${file.replace('.js', '')}`;
      routes.push({
        name: routeName || 'home',
        endpoints: ['GET', 'POST', 'PUT', 'DELETE']
      });
    }
  });

  res.render('index', {
    title: 'REST API Dashboard',
    totalRequests,
    routes,
    baseUrl: `${req.protocol}://${req.get('host')}`
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    totalRequests 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
});

module.exports = app;