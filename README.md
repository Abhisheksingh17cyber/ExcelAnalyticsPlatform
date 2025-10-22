# Excel Analytics Platform

A comprehensive MERN stack application for uploading Excel files, analyzing data, and generating interactive 2D/3D charts with user authentication and dashboard management.

## 🚀 Features

- **User Authentication**: JWT-based authentication with user registration, login, and profile management
- **File Upload & Parsing**: Upload Excel files (.xlsx, .xls) with automatic parsing and validation
- **Interactive Charts**: Create various chart types including bar, line, pie, scatter, and 3D column charts
- **Dashboard**: User-friendly dashboard with file management and chart history
- **Admin Panel**: Administrative interface for user management and platform statistics
- **Responsive Design**: Modern, mobile-friendly UI built with Tailwind CSS
- **Data Export**: Download charts as images or export data in various formats

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file upload handling
- **SheetJS (XLSX)** for Excel file parsing
- **Helmet** and **CORS** for security
- **Rate limiting** for API protection

### Frontend
- **React** with functional components and hooks
- **React Router** for navigation
- **Axios** for API communication
- **Tailwind CSS** for styling
- **Recharts** for 2D visualizations
- **Three.js** with React Three Fiber for 3D charts
- **React Dropzone** for drag-and-drop file uploads

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or cloud instance)
- Git

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/excel-analytics-platform.git
cd excel-analytics-platform
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/excel-analytics
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Start the Application

**Option 1: Run on Local Network (Accessible from other devices)**

To make the application accessible from other devices on your local network:

Windows:
```bash
start-network-access.bat
```

Linux/Mac:
```bash
./start-network-access.sh
```

The script will:
- Automatically detect your local IP address
- Configure both servers to accept connections from the network
- Display the URLs to access the application from any device

Example access URLs:
- Frontend: `http://192.168.1.100:3000` (your IP will be different)
- Login page: `http://192.168.1.100:3000/simple-login`
- Backend API: `http://192.168.1.100:5000`

**Note**: Make sure your firewall allows connections on ports 3000 and 5000.

**Option 2: Run Locally (localhost only)**

**Option 2a: Run Both Servers Simultaneously**
```bash
cd backend
npm run dev:full
```

**Option 2b: Run Servers Separately**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🌐 Network Access

To access the application from other devices on your local network (e.g., from your phone or another computer):

1. **Run the network access script**:
   - Windows: Double-click `start-network-access.bat` or run it from command prompt
   - Linux/Mac: Run `./start-network-access.sh` from terminal

2. **Configure your firewall**:
   - Ensure ports 3000 and 5000 are allowed through your firewall
   - Windows Firewall: Add inbound rules for ports 3000 and 5000
   - Linux: Use `ufw allow 3000` and `ufw allow 5000`
   - Mac: System Preferences > Security & Privacy > Firewall > Firewall Options

3. **Access from other devices**:
   - The script will display your local IP address
   - Use that IP to access the app: `http://YOUR_IP:3000`
   - Example: `http://192.168.1.100:3000/simple-login`

**Troubleshooting Network Access**:
- Make sure all devices are on the same network
- Check that MongoDB is accessible (it runs locally on the server machine)
- Verify firewall settings on the host machine
- Try disabling VPN if connection issues occur

## 📁 Project Structure

```
excel-analytics-platform/
├── backend/
│   ├── config/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── FileUpload.js
│   │   └── ChartAnalysis.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── files.js
│   │   ├── charts.js
│   │   └── users.js
│   ├── uploads/
│   ├── .env
│   ├── server.js
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── contexts/
    │   ├── pages/
    │   ├── utils/
    │   └── App.js
    ├── tailwind.config.js
    └── package.json
```

## 🔒 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

- Users can register with username, email, and password
- Login returns a JWT token valid for 7 days
- Protected routes require authentication
- Admin routes require admin privileges

## 📊 Chart Types Supported

1. **Bar Chart** - Compare categories with vertical bars
2. **Line Chart** - Show trends over time or continuous data
3. **Pie Chart** - Display parts of a whole
4. **Scatter Plot** - Show relationships between two variables
5. **3D Column Chart** - Interactive 3D data visualization
6. **Area Chart** - Filled line charts showing volume
7. **Donut Chart** - Pie chart with center hole

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### File Management
- `POST /api/files/upload` - Upload Excel file
- `GET /api/files/my-files` - Get user's uploaded files
- `GET /api/files/:fileId/data` - Get file data for chart generation
- `DELETE /api/files/:fileId` - Delete uploaded file

### Chart Analysis
- `POST /api/charts/create` - Create new chart
- `GET /api/charts/my-charts` - Get user's charts
- `GET /api/charts/:chartId` - Get specific chart
- `PUT /api/charts/:chartId` - Update chart
- `DELETE /api/charts/:chartId` - Delete chart

### Admin (Admin Only)
- `GET /api/users/all` - Get all users
- `GET /api/users/stats/platform` - Platform statistics
- `PUT /api/users/:userId` - Update user
- `DELETE /api/users/:userId` - Delete user

## 🚀 Deployment

### Production Environment Variables
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/excel-analytics
JWT_SECRET=your_super_secure_production_jwt_secret
```

### Build for Production
```bash
# Build frontend
cd frontend
npm run build

# The build folder will be ready for deployment
```

### Deployment Options
- **Heroku**: Easy deployment with Git integration
- **DigitalOcean**: Droplet with PM2 process manager
- **AWS**: EC2 with Load Balancer and RDS
- **Vercel/Netlify**: Frontend deployment (with separate backend)

## 🔐 Security Features

- Input validation and sanitization
- Rate limiting to prevent abuse
- CORS configuration
- Helmet.js for security headers
- File type validation for uploads
- JWT token expiration
- Password hashing with bcrypt

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

If you encounter any issues or have questions, please open an issue on the GitHub repository or contact the development team.

## 🙏 Acknowledgments

- [SheetJS](https://sheetjs.com/) for Excel file parsing
- [Recharts](https://recharts.org/) for beautiful React charts
- [Three.js](https://threejs.org/) for 3D visualizations
- [Tailwind CSS](https://tailwindcss.com/) for rapid UI development
- [MongoDB](https://www.mongodb.com/) for database solutions

---

Made with ❤️ by the Excel Analytics Platform Team