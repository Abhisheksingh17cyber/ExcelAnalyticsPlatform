# 🚀 Deploy Excel Analytics Platform - Get Public Link

## ✨ Quick Deploy to Vercel (Recommended - 5 Minutes)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy Frontend
```bash
cd frontend
vercel --prod
```

**You'll get a link like:** `https://your-app-name.vercel.app`

---

## 🌐 Alternative: Deploy to Netlify

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Login
```bash
netlify login
```

### Step 3: Deploy
```bash
cd frontend
npm run build
netlify deploy --prod --dir=build
```

**You'll get a link like:** `https://your-app-name.netlify.app`

---

## 📱 For Quick Testing on Your Network (Same WiFi)

If you just want to test on nearby devices on the same WiFi:

### Get Your Local IP:
```bash
ipconfig
```
Look for IPv4 Address (e.g., 192.168.1.5)

### Start with Network Access:
```bash
cd frontend
set HOST=0.0.0.0 && npm start
```

**Access from other devices:** `http://YOUR_IP:3000/simple-login`
Example: `http://192.168.1.5:3000/simple-login`

---

## 🎯 Recommended Deployment Strategy

Since your app works in demo mode (no backend needed), deploying just the frontend is perfect!

### Option 1: Static Site (Best for Demo)
Deploy only the frontend - it works standalone with demo authentication.

### Option 2: Full Stack
Deploy both frontend and backend separately:
- Frontend → Vercel/Netlify
- Backend → Render/Railway/Heroku

---

## 📝 Demo Credentials for Your Public Link:
- **Admin:** admin@demo.com / admin123
- **User:** user@demo.com / user123

Your demo authentication works without a backend, so it's perfect for showcasing!