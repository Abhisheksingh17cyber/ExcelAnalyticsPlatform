# Quick Start - Network Access

## For Windows Users

1. Double-click: `start-network-access.bat`
2. Wait for servers to start
3. Note the IP address displayed (e.g., 192.168.1.100)
4. Access from any device: `http://YOUR_IP:3000`

## For Linux/Mac Users

1. Run: `./start-network-access.sh`
2. Wait for servers to start
3. Note the IP address displayed
4. Access from any device: `http://YOUR_IP:3000`

## Firewall Configuration

### Windows
```batch
netsh advfirewall firewall add rule name="Excel Analytics Frontend" dir=in action=allow protocol=TCP localport=3000
netsh advfirewall firewall add rule name="Excel Analytics Backend" dir=in action=allow protocol=TCP localport=5000
```

### Linux (Ubuntu/Debian)
```bash
sudo ufw allow 3000/tcp
sudo ufw allow 5000/tcp
```

### Mac
System Preferences → Security & Privacy → Firewall → Firewall Options → Add ports 3000 and 5000

## Access URLs

- Main App: `http://YOUR_IP:3000`
- Login: `http://YOUR_IP:3000/simple-login`
- API: `http://YOUR_IP:5000/api/health`

## Troubleshooting

**Can't connect from another device?**
- Check firewall settings
- Verify both devices are on the same network
- Try: `ping YOUR_IP` from the other device

**CORS errors?**
- Restart the backend server
- Clear browser cache
- Check browser console for exact error

**Need help?**
See [NETWORK-ACCESS-GUIDE.md](NETWORK-ACCESS-GUIDE.md) for detailed instructions.
