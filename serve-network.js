const express = require('express');
const path = require('path');
const os = require('os');
const fs = require('fs');

const app = express();
const PORT = 8080; // Changed to a different port

// Middleware for CORS (allow all origins for network access)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Serve static files from the React build folder
const buildPath = path.join(__dirname, 'frontend/build');
console.log('Serving files from:', buildPath);

// Check if build directory exists
if (!fs.existsSync(buildPath)) {
  console.error('❌ Build directory does not exist:', buildPath);
  console.log('Please run: npm run build in the frontend directory');
  process.exit(1);
}

app.use('/ExcelAnalyticsPlatform', express.static(buildPath));
app.use(express.static(buildPath));

// API health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Excel Analytics Platform Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Handle specific React Router routes
app.get('/simple-login', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.get('/file-upload', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.get('/chart-generator', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Root route
app.get('/', (req, res) => {
  res.redirect('/simple-login');
});

// Fallback for any other routes
app.use((req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Get local network IP
function getNetworkIP() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName of Object.keys(interfaces)) {
    for (const iface of interfaces[interfaceName]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Start the server
const server = app.listen(PORT, '0.0.0.0', () => {
  const networkIP = getNetworkIP();
  
  console.log('\n' + '='.repeat(60));
  console.log('🚀 EXCEL ANALYTICS PLATFORM - LIVE SERVER! 🚀');
  console.log('='.repeat(60));
  console.log('');
  console.log('✅ SERVER STATUS: RUNNING');
  console.log(`✅ PORT: ${PORT}`);
  console.log(`✅ NETWORK IP: ${networkIP}`);
  console.log('');
  console.log('📱 SHARE THESE LINKS WITH YOUR TEAM:');
  console.log('='.repeat(60));
  console.log(`🌐 Network:  http://${networkIP}:${PORT}`);
  console.log(`🏠 Local:    http://localhost:${PORT}`);
  console.log('');
  console.log('🔗 DIRECT LOGIN LINKS:');
  console.log('='.repeat(60));
  console.log(`🔑 Login Page: http://${networkIP}:${PORT}/simple-login`);
  console.log('');
  console.log('📧 DEMO CREDENTIALS:');
  console.log('='.repeat(60));
  console.log('👑 Admin: admin@demo.com / admin123');
  console.log('👤 User:  user@demo.com / user123');
  console.log('');
  console.log('💡 INSTRUCTIONS FOR TEAM:');
  console.log('='.repeat(60));
  console.log('1. Connect to the same WiFi network');
  console.log('2. Open any browser (Chrome, Safari, etc.)');
  console.log(`3. Go to: http://${networkIP}:${PORT}`);
  console.log('4. Login with the credentials above');
  console.log('5. Explore the platform!');
  console.log('');
  console.log('⚠️  To stop server: Press Ctrl+C');
  console.log('='.repeat(60));
  console.log('');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server stopped successfully');
    process.exit(0);
  });
});