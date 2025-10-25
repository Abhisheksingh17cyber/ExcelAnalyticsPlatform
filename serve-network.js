const express = require('express');
const path = require('path');
const os = require('os');

const app = express();
const PORT = 3000;

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Handle React Router - serve index.html for all routes
app.get('/simple-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});

app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});

app.get('/file-upload', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});

app.get('/chart-generator', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});

// Default route
app.get('/', (req, res) => {
  res.redirect('/simple-login');
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

app.listen(PORT, '0.0.0.0', () => {
  const networkIP = getNetworkIP();
  console.log('\n🚀 Excel Analytics Platform is now running!');
  console.log('📱 ACCESS FROM ANYWHERE ON YOUR NETWORK:');
  console.log('');
  console.log(`   Local:    http://localhost:${PORT}/simple-login`);
  console.log(`   Network:  http://${networkIP}:${PORT}/simple-login`);
  console.log('');
  console.log('📧 Demo Login Credentials:');
  console.log('   Admin: admin@demo.com / admin123');
  console.log('   User:  user@demo.com / user123');
  console.log('');
  console.log('💡 Share the Network URL with your team for remote access!');
  console.log('   Make sure they are on the same WiFi/network.');
  console.log('');
});