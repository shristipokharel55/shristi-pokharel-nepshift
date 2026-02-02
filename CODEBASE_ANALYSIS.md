# Nepshift Codebase Analysis

**Generated:** February 2, 2026  
**Project:** Nepshift - Shift-Based Work Marketplace Platform

---

## 📋 Executive Summary

**Nepshift** is a modern MERN stack web application designed to connect workers (helpers) with shift-based job opportunities from hirers (employers). The platform facilitates job posting, job discovery, shift management, and worker-hirer connections with a focus on the Nepali market.

### Quick Stats
- **Tech Stack:** MongoDB, Express.js, React, Node.js (MERN)
- **Architecture:** Full-stack web application with separate frontend and backend
- **Authentication:** JWT-based with Google OAuth support
- **Deployment:** Development-ready with production configurations
- **Total Files (Backend):** 16 source files
- **Total Files (Frontend):** 50+ source files

---

## 🏗️ Project Architecture

### Directory Structure

```
shristi-pokharel-nepshift/
├── backend/                # Node.js/Express backend
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Request handlers
│   │   ├── middlewares/   # Auth & error middlewares
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Helper functions
│   │   └── server.js      # Entry point
│   ├── .env               # Environment variables
│   └── package.json
│
└── frontend/              # React + Vite frontend
    ├── src/
    │   ├── assets/        # Images & static files
    │   ├── components/    # Reusable UI components
    │   ├── context/       # React Context (Auth)
    │   ├── middleware/    # Protected routes
    │   ├── pages/         # Page components
    │   ├── utils/         # API client & helpers
    │   ├── App.jsx        # Main app component
    │   └── main.jsx       # Entry point
    ├── index.html
    └── package.json
```

---

## 🛠️ Technology Stack

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | Latest | Runtime environment |
| **Express.js** | ^5.2.1 | Web framework |
| **MongoDB** | ^9.0.0 (Mongoose) | Database |
| **JWT** | ^9.0.3 | Authentication |
| **bcrypt** | ^6.0.0 | Password hashing |
| **Nodemailer** | ^7.0.11 | Email service (OTP) |
| **Google Auth Library** | ^8.8.0 | OAuth integration |
| **CORS** | ^2.8.5 | Cross-origin support |
| **Cookie Parser** | ^1.4.7 | Cookie handling |
| **Nodemon** | ^3.1.11 (dev) | Hot reload |

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | ^19.2.0 | UI framework |
| **Vite** | ^7.2.4 | Build tool |
| **React Router** | ^7.10.1 | Routing |
| **Axios** | ^1.13.2 | HTTP client |
| **Tailwind CSS** | ^4.1.17 | Styling |
| **Lucide React** | ^0.556.0 | Icon library |
| **React Hot Toast** | ^2.6.0 | Notifications |
| **@react-oauth/google** | ^0.8.0 | Google Sign-In |
| **jwt-decode** | ^4.0.0 | Token decoding |

---

## 🔐 Authentication & Security

### Authentication Flow

1. **JWT-Based Authentication**
   - Tokens stored in **httpOnly cookies** (secure, XSS-protected)
   - 7-day token expiration (configurable)
   - Automatic token validation on protected routes
   - Cookie-based authentication preferred over headers

2. **Supported Auth Methods**
   - Email/Phone + Password login
   - Google OAuth 2.0 integration
   - OTP-based password reset

3. **Security Features**
   - Password hashing with bcrypt (10 salt rounds)
   - CORS protection with whitelist
   - Protected routes with role-based access
   - Automatic logout on token expiration
   - httpOnly cookies prevent XSS attacks

### Password Reset Flow

```
User → Forgot Password → Email OTP → Verify OTP → Reset Password → Login
```

- 6-digit OTP generation
- 5-minute expiration window
- 10-minute verification window
- Email delivery via Nodemailer

---

## 👥 User Roles & Permissions

### Role Structure

| Role | Description | Access |
|------|-------------|--------|
| **helper** | Workers looking for shifts | Worker Dashboard & Features |
| **hirer** | Employers posting jobs | Hirer Dashboard & Features |
| **admin** | System administrators | Admin-only routes (placeholder) |

### Role-Based Routing

**Helper/Worker Routes:**
- `/worker/dashboard` - Main dashboard
- `/worker/find-shifts` - Browse available jobs
- `/worker/my-shifts` - Manage booked shifts
- `/worker/schedule` - Availability management
- `/worker/wallet` - Earnings & payments
- `/worker/profile` - Personal profile
- `/worker/notifications` - Alerts & updates
- `/worker/support` - Help center

**Hirer Routes:**
- `/hirer/dashboard` - Main dashboard
- `/hirer/post-shift` - Create job postings
- `/hirer/manage-jobs` - Edit/delete jobs
- `/hirer/applicants` - Review applications
- `/hirer/payments` - Payment management
- `/hirer/profile` - Company profile

---

## 📊 Database Schema

### User Model (`models/user.js`)

```javascript
{
  fullName: String (required),
  email: String (required, unique),
  phone: String,
  location: String (required),
  role: Enum["helper", "hirer", "admin"] (default: "helper"),
  password: String (required, hashed),
  googleId: String,
  isVerified: Boolean (default: false),
  resetOtp: String,
  resetOtpExpires: Date,
  resetOtpVerifiedAt: Date,
  createdAt: Date (default: Date.now)
}
```

**Key Features:**
- Dual login support (email or phone)
- Location-based job matching
- Google account linking
- OTP reset mechanism
- Email verification placeholder

---

## 🌐 API Architecture

### Base Configuration

**Backend Server:** `http://localhost:5000`  
**Frontend Dev Server:** `http://localhost:5173`  
**API Base Path:** `/api`

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Create new account | ❌ |
| POST | `/login` | Login with credentials | ❌ |
| POST | `/logout` | Clear auth session | ❌ |
| POST | `/google` | Google OAuth login | ❌ |
| POST | `/forgot-password` | Request OTP | ❌ |
| POST | `/verify-otp` | Verify OTP code | ❌ |
| POST | `/reset-password` | Update password | ❌ |
| GET | `/me` | Get current user | ✅ |
| GET | `/admin-only` | Admin test route | ✅ (admin) |

### Middleware Stack

1. **CORS Middleware**
   - Allowed origins: localhost:5173, 5174, 5175, 3000
   - Credentials enabled for cookies
   - Custom origin validation

2. **Auth Middleware** (`protect`)
   - Validates JWT from cookies or headers
   - Attaches `req.user` to request
   - Returns 401 on invalid/missing token

3. **Role Authorization** (`authorizeRoles`)
   - Restricts access by user role
   - Returns 403 on unauthorized access

4. **Error Handling**
   - `notFound` - 404 handler
   - `errorHandler` - Global error middleware

---

## 🎨 Frontend Architecture

### Design System

**Color Palette:**
```css
/* Original Theme */
--color-primary: #4A9287      /* Teal */
--color-secondary: #F4FBFA    /* Light Mint */
--color-dark: #1F2937         /* Dark Gray */

/* Worker Dashboard Theme */
--color-worker-primary: #0B4B54      /* Deep Teal */
--color-worker-secondary: #D3E4E7    /* Light Blue-Gray */
--color-worker-seafoam: #82ACAB      /* Seafoam */
--color-worker-midnight: #032A33     /* Midnight Blue */
```

**Typography:**
- Primary Font: **Outfit** (Google Fonts)
- Secondary Font: **Inter** (Google Fonts)
- Font weights: 300, 400, 500, 600, 700, 800

### Component Library

**Landing Page Components:**
- `Navbar` - Navigation header
- `Hero` - Main hero section
- `Features` - Feature showcase
- `HowItWorks` - Process explanation
- `CTASection` - Call-to-action
- `Footer` - Site footer

**Worker Dashboard Components:**
- `WorkerLayout` - Main layout with sidebar & topbar
- `StatCard` - Metric display cards
- `QuickActionButton` - Action buttons
- `SimpleBarChart` - Weekly stats visualization
- `EarningsChart` - Earnings line chart
- `RecommendedJobCard` - Job listing cards

**Auth Components:**
- `HelperRegisterForm` - Worker registration
- `HirerRegisterForm` - Employer registration
- `PasswordToggle` - Password visibility toggle

**Shared Components:**
- `ProtectedRoute` - Route guard with role checking
- `AuthContext` - Global auth state management

### UI/UX Features

**Animations:**
- Fade-in-up entrance animations
- Slide-in-left for navigation
- Hover card elevations
- Button ripple effects
- Smooth transitions (0.2s-0.5s)

**Responsive Design:**
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Collapsible mobile sidebar
- Touch-friendly UI elements

**Loading States:**
- Spinner on auth checks
- Skeleton screens (placeholder)
- Toast notifications for feedback

---

## 🔄 State Management

### React Context (`AuthContext`)

**Global State:**
```javascript
{
  user: Object | null,
  loading: boolean,
  isAuthenticated: boolean
}
```

**Available Methods:**
- `login(email, password)` - Standard login
- `googleLogin(credential)` - Google OAuth
- `logout()` - Clear session
- `register(userData)` - Create account
- `checkAuth()` - Validate session

**Persistence:**
- User data stored in `localStorage`
- Tokens stored in httpOnly cookies
- Auto-redirect on authentication change

---

## 🚀 Key Features Implemented

### ✅ Completed Features

1. **Authentication System**
   - ✅ Email/Phone + Password login
   - ✅ Google OAuth integration
   - ✅ OTP-based password reset
   - ✅ Secure JWT token management
   - ✅ Role-based access control

2. **Worker Dashboard**
   - ✅ Personalized greeting
   - ✅ Real-time statistics (completed, active, pending jobs)
   - ✅ Weekly job & earnings charts
   - ✅ Quick action buttons
   - ✅ Recommended job listings
   - ✅ Notification system
   - ✅ Profile dropdown

3. **Landing Page**
   - ✅ Hero section
   - ✅ Features showcase
   - ✅ How it works section
   - ✅ Call-to-action
   - ✅ Auto-redirect for logged-in users

4. **Protected Routes**
   - ✅ Role-based route protection
   - ✅ Automatic redirection
   - ✅ Loading states
   - ✅ Session validation

### 🚧 Pages Present (Functionality TBD)

**Worker Pages:**
- FindShifts, MyShifts, WorkerAvailability
- Wallet, WorkerProfile, WorkerNotifications
- WorkerSupport, WorkerActiveJobs, WorkerCompletedJobs
- WorkerEarnings, WorkerJobRequests, WorkerNearbyJobs
- WorkerRatings

**Hirer Pages:**
- HirerDashboard, PostShift, ManageJobs
- Applicants, HirerPayments, HirerProfile

---

## 📝 Environment Configuration

### Backend `.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://nepshiftuser:***@cluster0.nmyncfi.mongodb.net/
JWT_SECRET=nepshift_super_secret_jwt_key_2024_change_in_production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=                    # Optional
MAIL_USER=nepshift55@gmail.com
MAIL_PASS=***
MAIL_FROM=nepshift55@gmail.com
NODE_ENV=development
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=               # For Google OAuth
```

---

## 🏃 Running the Application

### Backend Setup

```bash
cd backend
npm install
npm run dev          # Development with nodemon
# OR
npm start            # Production
```

**Server runs on:** `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
```

**Dev server runs on:** `http://localhost:5173`

---

## 🔍 Code Quality & Patterns

### Backend Patterns

1. **MVC Architecture**
   - Model: Mongoose schemas
   - View: JSON responses
   - Controller: Business logic

2. **Middleware Pattern**
   - Auth protection
   - Error handling
   - Request validation

3. **Service Layer**
   - `googleAuthService.js` - OAuth logic
   - Separation of concerns

4. **Utility Functions**
   - `asyncHandler` - Error wrapping
   - `generateToken` - JWT creation
   - `httpError` - Custom errors
   - `sendEmail` - Email service

### Frontend Patterns

1. **Component Composition**
   - Atomic design principles
   - Reusable UI components
   - Layout components

2. **Custom Hooks**
   - `useAuth()` - Authentication state
   - React Router hooks

3. **API Client**
   - Centralized axios instance
   - Automatic error handling
   - Cookie-based authentication

4. **Route Protection**
   - Higher-order component pattern
   - Role-based rendering

---

## 🐛 Known Issues & Limitations

### Current Limitations

1. **Job Management**
   - Job posting/browsing UI exists but no backend endpoints
   - No job database model yet
   - Recommended jobs are mock data

2. **Worker Features**
   - Shift booking not implemented
   - Availability management placeholder
   - Wallet/payments placeholder

3. **Hirer Features**
   - Applicant management not functional
   - Payment processing not integrated

4. **Google OAuth**
   - `GOOGLE_CLIENT_ID` not configured
   - OAuth flow needs testing

5. **Email Service**
   - OTP emails configured but need testing
   - Development mode logs OTP to console

6. **Database**
   - Commented code suggests in-memory MongoDB was considered
   - MongoDB Memory Server dependency present but unused

---

## 📈 Future Development Recommendations

### High Priority

1. **Job Model & CRUD**
   - Create Job schema (title, description, location, pay, shifts)
   - Implement job posting endpoints
   - Job search & filtering

2. **Application System**
   - Application model & endpoints
   - Worker apply to job flow
   - Hirer review applicants

3. **Shift Management**
   - Booking system
   - Calendar integration
   - Shift reminders

4. **Payment Integration**
   - Stripe/PayPal integration
   - Wallet system
   - Transaction history

### Medium Priority

5. **Notifications**
   - Real-time notifications (Socket.io)
   - Email notifications
   - Push notifications

6. **Profile Management**
   - Worker skills & certifications
   - Hirer company verification
   - Profile pictures (image upload)

7. **Rating & Reviews**
   - Worker ratings
   - Hirer ratings
   - Review system

### Low Priority

8. **Admin Panel**
   - User management
   - Job moderation
   - Analytics dashboard

9. **Advanced Features**
   - Chat system
   - Location-based matching
   - Job recommendations AI

---

## 🧪 Testing Readiness

### Current State
- ✅ Development environment configured
- ✅ ES Modules enabled
- ✅ Dev dependencies installed (nodemon)
- ❌ No test files present
- ❌ No testing framework installed

### Recommended Testing Stack
- **Backend:** Jest + Supertest
- **Frontend:** Vitest + React Testing Library
- **E2E:** Playwright or Cypress

---

## 📦 Deployment Considerations

### Production Checklist

**Backend:**
- [ ] Change JWT_SECRET to strong random key
- [ ] Remove development MONGO_URI credentials from repo
- [ ] Configure production MONGO_URI
- [ ] Set up error logging (Winston/Morgan)
- [ ] Enable rate limiting
- [ ] Add helmet.js for security headers
- [ ] Configure PM2 or similar process manager
- [ ] Set up SSL/HTTPS

**Frontend:**
- [ ] Update VITE_API_URL to production backend
- [ ] Configure Google OAuth production credentials
- [ ] Optimize build assets
- [ ] Set up CDN for static assets
- [ ] Configure environment variables in hosting platform

**Database:**
- [ ] Set up MongoDB Atlas production cluster
- [ ] Configure backups
- [ ] Set up monitoring
- [ ] Create indexes for performance

---

## 👨‍💻 Developer Notes

### Code Style
- ES6+ modules (`import/export`)
- Async/await for asynchronous operations
- Functional components (React)
- Arrow functions preferred
- Tailwind utility-first CSS

### API Conventions
- RESTful endpoint naming
- JSON response format
- HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- Error messages in `{ message: "..." }` format

### Git Workflow
- Main branch: Development
- Feature branches recommended
- `.gitignore` configured for node_modules, .env

---

## 📞 Support & Contact

**Project:** Nepshift  
**Type:** Academic/Portfolio Project  
**Status:** Active Development  
**Last Updated:** February 2, 2026

---

## 📚 Additional Resources

### Documentation Links
- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [MongoDB Docs](https://www.mongodb.com/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Useful Commands

```bash
# Backend
npm run dev              # Start backend with nodemon
npm start                # Start backend without nodemon

# Frontend
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint

# Both
npm install              # Install dependencies
```

---

**End of Codebase Analysis**
