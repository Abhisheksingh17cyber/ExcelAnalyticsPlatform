# 🚀 Excel Analytics Platform - MERN Stack Project

A comprehensive full-stack web application for uploading, analyzing, and visualizing Excel data with interactive 2D and 3D charts, user authentication, and administrative dashboard.

![Platform Demo](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Excel+Analytics+Platform)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Authentication & Authorization
- **User Registration & Login** with JWT tokens
- **Role-based Access Control** (Admin/User)
- **Password Security** with bcrypt hashing
- **Protected Routes** and middleware

### 📊 File Management & Processing
- **Excel File Upload** with drag-and-drop interface
- **File Validation** (size, format, content)
- **Data Parsing** using SheetJS (XLSX)
- **File Metadata** tracking and storage

### 📈 Data Visualization
- **2D Charts**: Bar, Line, Pie, Area, Scatter plots
- **3D Visualizations**: Interactive 3D scatter plots, surface charts
- **Chart Customization**: Colors, themes, animations
- **Export Options**: PNG, PDF downloads

### 🎛️ Dashboard & Analytics
- **User Dashboard** with file overview and statistics
- **Admin Panel** with user management
- **Real-time Updates** and notifications
- **Responsive Design** for all devices

### 🛡️ Security & Performance
- **Rate Limiting** (100 requests per 15 minutes)
- **CORS Protection** with configurable origins
- **File Upload Security** with validation
- **Error Handling** and logging

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **XLSX** - Excel file processing
- **Helmet** - Security middleware
- **bcrypt** - Password hashing

### Frontend
- **React** - UI library with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Recharts** - 2D chart library
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **React Dropzone** - File upload component

## 📦 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/downloads)

### Optional but Recommended:
- **MongoDB Compass** - GUI for MongoDB
- **Postman** - API testing tool
- **VS Code** - Code editor with React/Node extensions

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/excel-analytics-platform.git
cd excel-analytics-platform
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/excel_analytics_platform
MONGODB_TEST_URI=mongodb://localhost:27017/excel_analytics_platform_test

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=.xlsx,.xls,.csv

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install --legacy-peer-deps
```

### 4. Database Setup
Make sure MongoDB is running on your system:

**Windows:**
```bash
mongod --dbpath="C:\data\db"
```

**macOS/Linux:**
```bash
sudo systemctl start mongod
# or
brew services start mongodb-community
```

## 🎯 Usage

### Quick Start (Recommended)

**Windows:**
```bash
# Double-click the start-servers.bat file
# OR run from command line:
start-servers.bat
```

**macOS/Linux:**
```bash
chmod +x start-servers.sh
./start-servers.sh
```

### Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Access the Application

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Documentation**: [http://localhost:5000/api](http://localhost:5000/api)

### Default Login Credentials

The application starts with a seeded admin account:
- **Email**: admin@example.com
- **Password**: admin123

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login` | User login |
| GET    | `/api/auth/me` | Get current user |
| PUT    | `/api/auth/profile` | Update user profile |
| PUT    | `/api/auth/change-password` | Change password |

### File Management Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/files/upload` | Upload Excel file |
| GET    | `/api/files` | Get user's files |
| GET    | `/api/files/:id` | Get specific file |
| DELETE | `/api/files/:id` | Delete file |
| GET    | `/api/files/:id/data` | Get parsed file data |

### Chart Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/charts/generate` | Generate chart config |
| GET    | `/api/charts/:fileId` | Get file charts |
| POST   | `/api/charts/save` | Save chart configuration |
| PUT    | `/api/charts/:id` | Update chart |
| DELETE | `/api/charts/:id` | Delete chart |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/users` | Get all users (Admin) |
| PUT    | `/api/users/:id/role` | Update user role (Admin) |
| DELETE | `/api/users/:id` | Delete user (Admin) |
| GET    | `/api/admin/stats` | Get platform statistics |

## 📁 Project Structure

```
excel-analytics-platform/
├── 📁 backend/                 # Node.js/Express backend
│   ├── 📁 config/             # Database configuration
│   ├── 📁 middleware/         # Custom middleware
│   ├── 📁 models/             # Mongoose models
│   ├── 📁 routes/             # API routes
│   ├── 📁 uploads/            # File upload directory
│   ├── 📄 server.js           # Express server setup
│   ├── 📄 package.json        # Backend dependencies
│   └── 📄 .env                # Environment variables
├── 📁 frontend/               # React frontend
│   ├── 📁 public/            # Public assets
│   ├── 📁 src/               # Source code
│   │   ├── 📁 components/    # Reusable components
│   │   ├── 📁 contexts/      # React contexts
│   │   ├── 📁 pages/         # Page components
│   │   ├── 📁 utils/         # Utility functions
│   │   ├── 📄 App.js         # Main app component
│   │   └── 📄 index.js       # React DOM render
│   ├── 📄 package.json       # Frontend dependencies
│   ├── 📄 tailwind.config.js # Tailwind configuration
│   └── 📄 postcss.config.js  # PostCSS configuration
├── 📄 start-servers.bat       # Windows startup script
├── 📄 start-servers.sh        # Unix startup script
├── 📄 README.md               # Project documentation
└── 📄 PROJECT-COMPLETE.md     # Detailed project info
```

## 🧩 Core Components

### Backend Models

#### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  isAdmin: Boolean (default: false),
  createdAt: Date,
  lastLogin: Date
}
```

#### FileUpload Model
```javascript
{
  filename: String (required),
  originalName: String (required),
  mimetype: String (required),
  size: Number (required),
  uploadedBy: ObjectId (ref: User),
  uploadedAt: Date,
  parsedData: Object,
  isProcessed: Boolean
}
```

#### ChartAnalysis Model
```javascript
{
  fileId: ObjectId (ref: FileUpload),
  userId: ObjectId (ref: User),
  chartType: String (required),
  chartConfig: Object,
  title: String,
  description: String,
  createdAt: Date
}
```

### Frontend Pages

- **🏠 Dashboard**: File overview, statistics, quick actions
- **📤 File Upload**: Drag-and-drop file upload with progress
- **📊 Chart Generator**: Interactive chart creation and customization
- **👤 Profile**: User profile management and settings
- **🛡️ Admin Panel**: User management and platform statistics
- **🔑 Login/Register**: Authentication forms with validation

## 🎨 Styling & Theming

The project uses **Tailwind CSS** with a custom configuration:

- **Primary Colors**: Blue gradient (#3B82F6 to #1D4ED8)
- **Typography**: Inter font family
- **Components**: Custom utility classes for buttons, forms, cards
- **Responsive**: Mobile-first approach with breakpoints
- **Dark Mode**: Ready for implementation

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### End-to-End Testing
```bash
npm run test:e2e
```

## 🚀 Deployment

### Backend Deployment (Heroku)
```bash
cd backend
heroku create excel-analytics-api
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_production_jwt_secret
git add .
git commit -m "Deploy backend"
git push heroku main
```

### Frontend Deployment (Netlify)
```bash
cd frontend
npm run build
# Upload build/ folder to Netlify or use Netlify CLI
netlify deploy --prod --dir=build
```

### Database (MongoDB Atlas)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create cluster and database
3. Get connection string
4. Update `MONGODB_URI` in environment variables

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/excel_analytics_platform
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
MAX_FILE_SIZE=10485760
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env.local)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_MAX_FILE_SIZE=10
REACT_APP_ALLOWED_TYPES=.xlsx,.xls,.csv
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow **ESLint** configuration for code style
- Write **tests** for new features
- Update **documentation** for API changes
- Use **conventional commits** for commit messages
- Ensure **responsive design** for UI changes

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- **React Team** for the amazing library
- **Express.js** for the robust web framework
- **MongoDB** for the flexible database
- **Tailwind CSS** for the utility-first approach
- **Three.js** for 3D graphics capabilities
- **Recharts** for beautiful 2D charts

## 📞 Support

If you have any questions or need help:

1. Check the **[Issues](https://github.com/yourusername/excel-analytics-platform/issues)** page
2. Create a **new issue** with detailed description
3. Join our **[Discord community](https://discord.gg/yourserver)**
4. Email us at **support@yourplatform.com**

---

## 🎉 Quick Start Summary

```bash
# 1. Clone and setup
git clone <repository-url>
cd excel-analytics-platform

# 2. Install dependencies
cd backend && npm install
cd ../frontend && npm install --legacy-peer-deps

# 3. Configure environment
# Create .env in backend/ with MongoDB and JWT settings

# 4. Start development servers
# Windows: double-click start-servers.bat
# Unix: ./start-servers.sh

# 5. Open browser
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

**🎊 Congratulations! Your Excel Analytics Platform is now running!** 🎊

---

*Made with ❤️ using the MERN stack*