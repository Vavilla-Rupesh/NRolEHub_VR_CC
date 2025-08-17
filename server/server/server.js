// server.js

const express = require('express');
require('dotenv').config();
const { syncDatabase } = require('./config/dataBase');
const route = require('./index');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const { createSuperAdmins } = require('./modules/auth/auth.service');

const port = process.env.SERVER_PORT || 8080;
const app = express();

// Increase payload size limits (for large file uploads)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

// ===== Create uploads directory if it doesn't exist =====
const uploadsDir = path.join(__dirname, 'public', 'uploads', 'events');
const profilesDir = path.join(__dirname, 'public', 'uploads', 'profiles');
fs.mkdirSync(uploadsDir, { recursive: true });
fs.mkdirSync(profilesDir, { recursive: true });

// ===== Serve uploaded files statically =====
// This makes files accessible via /uploads/events/<filename>
app.use('/uploads/events', express.static(uploadsDir));
app.use('/uploads/profiles', express.static(profilesDir));

// ===== Serve receipt files statically =====
const receiptsDir = path.join(__dirname, 'receipts');
fs.mkdirSync(receiptsDir, { recursive: true });
app.use('/receipts', express.static(receiptsDir));

// ===== API routes =====
app.use('/api', route);

// ===== Serve Frontend in Production =====
if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, 'public'); // build output here
  app.use(express.static(publicPath));

  // Handle SPA routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

// ===== Start Server After DB Sync =====
syncDatabase().then(() => {
  console.log('Database is ready!');
  
  // Create super admins after database sync
  createSuperAdmins().then(() => {
    console.log('Super admins initialization complete');
  });
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
