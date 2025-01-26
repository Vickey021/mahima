const express = require('express');
const path = require('path');
const cors = require('cors');
const serverless = require('serverless-http');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' folder

// Import API routes
const buyRoutes = require('./api/buy');
const sellRoutes = require('./api/sell');
const detailsRoutes = require('./api/details');
const loginRoutes = require('./api/login');

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Serve dashboard page after successful login
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Serve buy page
app.get('/buy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'buy.html'));
});

// Serve sell page
app.get('/sell', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sell.html'));
});

// Serve details page
app.get('/details', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'details.html'));
});

// Use API routes
app.use('/api/buy', buyRoutes);
app.use('/api/sell', sellRoutes);
app.use('/api/details', detailsRoutes);
app.use('/api/login', loginRoutes);

// Export the serverless handler
module.exports.handler = serverless(app);
