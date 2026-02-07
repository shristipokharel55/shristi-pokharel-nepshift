# NepShift - Project Documentation

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [User Roles](#user-roles)
- [Database Models](#database-models)
- [API Endpoints](#api-endpoints)
- [Frontend Pages](#frontend-pages)
- [Authentication & Authorization](#authentication--authorization)
- [Key Functionalities](#key-functionalities)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)

---

## 🎯 Project Overview

**NepShift** is a comprehensive shift-based job marketplace platform designed for Nepal, connecting workers (helpers) with employers (hirers) for short-term jobs and gig work. The platform facilitates job posting, bidding, application management, and includes features like verification systems, ratings, notifications, and payment tracking.

### Core Concept
- **Workers/Helpers**: Browse and apply for available shifts/jobs
- **Hirers**: Post job shifts and manage applications/bids
- **Admins**: Oversee platform operations, verify users, and manage the system

---

## 🛠 Technology Stack

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js v5.2.1
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: 
  - JWT (JSON Web Tokens)
  - Google OAuth 2.0
  - bcrypt for password hashing
- **File Uploads**: Multer
- **Email Service**: Nodemailer
- **Cookie Management**: cookie-parser
- **CORS**: Enabled for cross-origin requests

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Routing**: React Router DOM v7.10.1
- **Styling**: TailwindCSS v4.1.17
- **HTTP Client**: Axios
- **State Management**: React Context API
- **UI Components**: 
  - Lucide React (icons)
  - React Hot Toast (notifications)
- **Maps**: 
  - React Leaflet
  - @react-google-maps/api
- **Charts**: ApexCharts with react-apexcharts
- **OAuth**: @react-oauth/google

### Development Tools
- **Backend Dev Server**: Nodemon
- **Frontend Dev Server**: Vite
- **Linting**: ESLint
- **Testing DB**: MongoDB Memory Server (for development)

---

## 📁 Project Structure

```
nepshift/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection
│   │   ├── controllers/              # Business logic
│   │   │   ├── adminController.js
│   │   │   ├── applicationController.js
│   │   │   ├── authController.js
│   │   │   ├── bidController.js
│   │   │   ├── googleAuthController.js
│   │   │   ├── helperController.js
│   │   │   ├── hirerProfileController.js
│   │   │   ├── notificationController.js
│   │   │   ├── reviewController.js
│   │   │   ├── shiftController.js
│   │   │   └── userController.js
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js     # JWT verification & role authorization
│   │   │   └── errorMiddleware.js    # Error handling
│   │   ├── models/                   # Mongoose schemas
│   │   │   ├── Application.js
│   │   │   ├── bid.js
│   │   │   ├── helperProfile.js
│   │   │   ├── Notification.js
│   │   │   ├── Review.js
│   │   │   ├── shift.js
│   │   │   └── user.js
│   │   ├── routes/                   # API route definitions
│   │   │   ├── adminRoutes.js
│   │   │   ├── applicationRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── bidRoutes.js
│   │   │   ├── helperRoutes.js
│   │   │   ├── notificationRoutes.js
│   │   │   ├── reviewRoutes.js
│   │   │   ├── shiftRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── services/
│   │   │   └── googleAuthService.js  # Google OAuth integration
│   │   ├── utils/                    # Helper utilities
│   │   │   ├── asyncHandler.js
│   │   │   ├── cookieOptions.js
│   │   │   ├── generateToken.js
│   │   │   ├── httpError.js
│   │   │   ├── otpGenerator.js
│   │   │   ├── profileCompletion.js
│   │   │   └── sendEmail.js
│   │   └── server.js                 # Entry point
│   ├── uploads/                      # File upload storage
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── assets/                   # Images, fonts, etc.
    │   ├── components/
    │   │   ├── admin/
    │   │   │   └── AdminLayout.jsx
    │   │   ├── auth/
    │   │   │   ├── HelperRegisterForm.jsx
    │   │   │   └── HirerRegisterForm.jsx
    │   │   ├── hirer/
    │   │   │   └── HirerLayout.jsx
    │   │   ├── landing/              # Landing page components
    │   │   │   ├── CTASection.jsx
    │   │   │   ├── Features.jsx
    │   │   │   ├── Footer.jsx
    │   │   │   ├── Hero.jsx
    │   │   │   ├── HowItWorks.jsx
    │   │   │   └── Navbar.jsx
    │   │   ├── ui/                   # Reusable UI components
    │   │   │   ├── PasswordToggle.jsx
    │   │   │   └── VerifiedBadge.jsx
    │   │   └── worker/
    │   │       ├── BidModal.jsx
    │   │       └── WorkerLayout.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx       # Global authentication state
    │   ├── middleware/
    │   │   └── ProtectedRoute.jsx    # Route protection
    │   ├── pages/
    │   │   ├── admin/                # Admin dashboard pages
    │   │   │   ├── AdminDashboard.jsx
    │   │   │   ├── AdminFinancials.jsx
    │   │   │   ├── AdminHirerVerification.jsx
    │   │   │   ├── AdminSettings.jsx
    │   │   │   ├── AdminUsers.jsx
    │   │   │   └── AdminVerification.jsx
    │   │   ├── auth/                 # Authentication pages
    │   │   │   ├── ForgotPassword.jsx
    │   │   │   ├── RegisterHelper.jsx
    │   │   │   ├── RegisterHirer.jsx
    │   │   │   ├── RegisterPage.jsx
    │   │   │   ├── RegisterSelect.jsx
    │   │   │   ├── ResetPassword.jsx
    │   │   │   └── VerifyOtp.jsx
    │   │   ├── hirer/                # Hirer dashboard pages
    │   │   │   ├── Applicants.jsx
    │   │   │   ├── ChatWithWorker.jsx
    │   │   │   ├── HirerDashboard.jsx
    │   │   │   ├── HirerPayments.jsx
    │   │   │   ├── HirerProfile.jsx
    │   │   │   ├── HirerProfileEdit.jsx
    │   │   │   ├── HirerVerification.jsx
    │   │   │   ├── ManageJobs.jsx
    │   │   │   ├── PostShift.jsx
    │   │   │   ├── ShiftDetails.jsx
    │   │   │   ├── ViewApplicants.jsx
    │   │   │   ├── WorkerProfileView.jsx
    │   │   │   └── Workers.jsx
    │   │   ├── worker/               # Worker dashboard pages
    │   │   │   ├── AppliedShifts.jsx
    │   │   │   ├── ChatWithHirer.jsx
    │   │   │   ├── CompleteProfile.jsx
    │   │   │   ├── FindShifts.jsx
    │   │   │   ├── HelperVerification.jsx
    │   │   │   ├── MyShifts.jsx
    │   │   │   ├── Wallet.jsx
    │   │   │   ├── WorkerActiveJobs.jsx
    │   │   │   ├── WorkerAvailability.jsx
    │   │   │   ├── WorkerCompletedJobs.jsx
    │   │   │   ├── WorkerDashboard.jsx
    │   │   │   ├── WorkerEarnings.jsx
    │   │   │   ├── WorkerJobRequests.jsx
    │   │   │   ├── WorkerNearbyJobs.jsx
    │   │   │   ├── WorkerNotifications.jsx
    │   │   │   ├── WorkerProfile.jsx
    │   │   │   ├── WorkerRatings.jsx
    │   │   │   └── WorkerSupport.jsx
    │   │   ├── Home/
    │   │   │   └── Home.jsx          # Landing page
    │   │   └── Login.jsx
    │   ├── utils/
    │   │   ├── api.js                # Axios configuration
    │   │   └── nepalLocations.js     # Nepal location data
    │   ├── App.jsx                   # Main app component with routes
    │   ├── main.jsx                  # Entry point
    │   ├── App.css
    │   └── index.css
    ├── public/
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## ✨ Features

### For Workers/Helpers
- ✅ Browse available shifts/jobs
- ✅ Apply for shifts
- ✅ Place bids with custom rates
- ✅ Profile management with completion tracking
- ✅ Upload verification documents (citizenship)
- ✅ Location-based job matching with map integration
- ✅ View applied shifts and job history
- ✅ Track earnings and completed jobs
- ✅ Receive notifications
- ✅ Rate and review hirers
- ✅ Wallet/earnings tracking
- ✅ Availability calendar management
- ✅ Real-time chat with hirers

### For Hirers
- ✅ Post job shifts with detailed requirements
- ✅ Manage job postings (edit, delete)
- ✅ View and manage applicants
- ✅ Review received bids
- ✅ Accept/reject applications
- ✅ Profile verification with document upload
- ✅ Browse available workers
- ✅ View worker profiles and ratings
- ✅ Track payments
- ✅ Rate and review workers
- ✅ Receive notifications for applications/bids
- ✅ Location selection with interactive maps
- ✅ Real-time chat with accepted workers

### For Admins
- ✅ Dashboard with platform statistics
- ✅ User management (view, edit, delete)
- ✅ Verify helper profiles
- ✅ Verify hirer documents
- ✅ View recent platform activity
- ✅ Financial overview
- ✅ Platform settings management

---

## 👥 User Roles

### 1. Helper/Worker
Users who offer their services and apply for shifts. They can:
- Create detailed profiles with skills and experience
- Browse and search for jobs
- Apply or bid on shifts
- Manage their availability
- Track earnings and completed jobs

### 2. Hirer/Employer
Users who post job requirements and hire workers. They can:
- Post detailed shift requirements
- Review applications and bids
- Select and hire workers
- Manage multiple job postings
- Track payments and expenses

### 3. Admin
System administrators with full platform access. They can:
- Monitor platform health and statistics
- Verify user documents
- Manage disputes
- View all transactions
- Moderate content

---

## 💾 Database Models

### User Model
**Collection**: `users`

```javascript
{
  fullName: String (required),
  email: String (required, unique),
  phone: String,
  location: String (default: 'Not Provided'),
  role: String (enum: ["helper", "hirer", "admin"], default: "helper"),
  password: String (required, hashed),
  googleId: String,
  
  // Hirer-specific
  bio: String (max 500 chars),
  profilePhoto: String (URL),
  coverPhoto: String (URL),
  
  // Rating system
  rating: Number (0-5),
  totalRatings: Number,
  ratingSum: Number,
  
  // Address with coordinates
  address: {
    latitude: Number,
    longitude: Number,
    district: String,
    municipality: String,
    ward: Number,
    street: String
  },
  
  // Verification
  verificationDocs: {
    citizenshipFront: String (URL),
    citizenshipBack: String (URL),
    selfieWithId: String (URL)
  },
  isVerified: Boolean (default: false),
  verificationStatus: String (enum: ['unverified', 'pending', 'approved', 'rejected']),
  verifiedAt: Date,
  verifiedBy: ObjectId (ref: 'User'),
  rejectionReason: String,
  
  // Availability
  bookedDates: [Date],
  
  // Documents for helpers
  documents: [{
    type: String (enum: ['kyc', 'id', 'address', 'business_license']),
    url: String,
    uploadedAt: Date,
    status: String (enum: ['pending', 'approved', 'rejected'])
  }],
  
  // Stats
  totalHires: Number (default: 0),
  
  // Password reset
  resetOtp: String,
  resetOtpExpires: Date,
  resetOtpVerifiedAt: Date,
  
  createdAt: Date (default: now),
  joinedAt: Date (default: now)
}
```

### Shift Model
**Collection**: `shifts`

```javascript
{
  title: String (required, max 100 chars),
  description: String (max 1000 chars),
  category: String (required, enum: [
    "Construction", "Marketing", "Delivery", "Event Staff",
    "Cleaning", "Security", "Teaching", "Data Entry",
    "Customer Service", "Other"
  ]),
  
  // Payment range
  pay: {
    min: Number (required, >= 0),
    max: Number (required, >= 0)
  },
  
  // Location with map coordinates
  location: {
    address: String (required),
    city: String (required),
    coordinates: {
      lat: Number (required),
      lng: Number (required)
    }
  },
  
  // Timing
  date: Date (required),
  time: {
    start: String (required, e.g., "09:00 AM"),
    end: String (required, e.g., "05:00 PM")
  },
  
  // Requirements
  skills: [String],
  
  // References
  hirerId: ObjectId (ref: 'User', required),
  worker: ObjectId (ref: 'User'),
  selectedWorker: ObjectId (ref: 'User'),
  
  // Status tracking
  status: String (enum: [
    "open", "reserved", "in-progress", "completed", "cancelled"
  ], default: "open"),
  
  // Applicants
  applicants: [{
    workerId: ObjectId (ref: 'User'),
    appliedAt: Date (default: now),
    status: String (enum: ["pending", "accepted", "rejected"], default: "pending")
  }],
  
  timestamps: true
}
```

### HelperProfile Model
**Collection**: `helperprofiles`

```javascript
{
  user: ObjectId (ref: 'User', required, unique),
  
  // Profile info
  skillCategory: String (enum: [
    'Plumber', 'Electrician', 'Cleaning', 'Gardening',
    'General Labour', 'Cooking', 'Delivery', 'Painting',
    'Carpentry', 'Other'
  ]),
  yearsOfExperience: Number (default: 0),
  aboutMe: String (max 500 chars),
  hourlyRate: Number,
  
  // Location
  location: {
    address: String,
    city: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  // Profile completion
  isProfileComplete: Boolean (default: false),
  profileCompletionPercentage: Number (default: 0),
  
  // Verification documents
  citizenshipNumber: String,
  citizenshipFrontImage: String (URL),
  citizenshipBackImage: String (URL),
  
  // Stats
  averageRating: Number (default: 0),
  totalJobsCompleted: Number (default: 0),
  totalEarnings: Number (default: 0),
  
  // Availability
  isAvailable: Boolean (default: true),
  
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

### Bid Model
**Collection**: `bids`

```javascript
{
  shiftId: ObjectId (ref: 'Shift', required),
  workerId: ObjectId (ref: 'User', required),
  hirerId: ObjectId (ref: 'User', required),
  bidAmount: Number (required, >= 0),
  estimatedArrivalTime: String (required),
  message: String (max 500 chars),
  status: String (enum: ["pending", "accepted", "rejected"], default: "pending"),
  
  timestamps: true
}

// Unique index: { shiftId: 1, workerId: 1 }
```

### Application Model
**Collection**: `applications`

```javascript
{
  worker: ObjectId (ref: 'User', required),
  shift: ObjectId (ref: 'Shift', required),
  status: String (enum: ["pending", "approved", "rejected"], default: "pending"),
  appliedAt: Date (default: now),
  
  timestamps: true
}
```

### Review Model
**Collection**: `reviews`

```javascript
{
  shiftId: ObjectId (ref: 'Shift', required),
  fromUser: ObjectId (ref: 'User', required),
  toUser: ObjectId (ref: 'User', required),
  rating: Number (required, 1-5),
  comment: String (max 500 chars),
  createdAt: Date (default: now)
}

// Unique index: { shiftId: 1, fromUser: 1, toUser: 1 }
```

### Notification Model
**Collection**: `notifications`

```javascript
{
  recipient: ObjectId (ref: 'User', required),
  type: String (enum: ['info', 'success', 'warning', 'error'], default: 'info'),
  title: String (required),
  message: String (required),
  read: Boolean (default: false),
  relatedId: ObjectId,
  createdAt: Date (default: now)
}
```

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)
```
POST   /api/auth/register              - Register new user
POST   /api/auth/register-hirer        - Register hirer
POST   /api/auth/login                 - Login user
POST   /api/auth/logout                - Logout user
POST   /api/auth/google                - Google OAuth login
POST   /api/auth/google-login          - Alternative Google login
POST   /api/auth/forgot-password       - Request password reset
POST   /api/auth/verify-otp            - Verify OTP for password reset
POST   /api/auth/reset-password        - Reset password with verified OTP
GET    /api/auth/me                    - Get current authenticated user
GET    /api/auth/admin-only            - Admin-only test route
```

### Shift Routes (`/api/shifts`)
```
GET    /api/shifts                     - Get all shifts (public)
GET    /api/shifts/open                - Get all open shifts
GET    /api/shifts/my-shifts           - Get hirer's posted shifts (hirer only)
GET    /api/shifts/applicants          - Get all applicants for hirer's shifts (hirer only)
GET    /api/shifts/:id                 - Get shift by ID
GET    /api/shifts/:id/details         - Get shift details with bids (hirer only)
POST   /api/shifts                     - Create new shift (hirer only)
PUT    /api/shifts/:id                 - Update shift (hirer only)
PUT    /api/shifts/:shiftId/complete   - Mark shift as complete (protected)
DELETE /api/shifts/:id                 - Delete shift (hirer only)
```

### Bid Routes (`/api/bids`)
```
POST   /api/bids                       - Place a bid (helper only)
GET    /api/bids/my-bids               - Get worker's bids (helper only)
GET    /api/bids/received              - Get received bids (hirer only)
PUT    /api/bids/:id                   - Update bid status (hirer only)
```

### Application Routes (`/api/applications`)
```
POST   /api/applications               - Apply for a shift
GET    /api/applications/my-applications - Get user's applications
GET    /api/applications/shift/:shiftId  - Get applications for a shift
PUT    /api/applications/:id           - Update application status
```

### Helper Routes (`/api/helper`)
```
GET    /api/helper/workers             - Get all workers (hirer only)
GET    /api/helper/profile             - Get helper profile (helper only)
PUT    /api/helper/profile             - Update helper profile (helper only)
PUT    /api/helper/location            - Update helper location (helper only)
POST   /api/helper/verify              - Submit verification (helper only)
GET    /api/helper/verification-status - Get verification status (helper only)
POST   /api/helper/upload              - Upload image (helper only)
GET    /api/helper/stats               - Get worker stats (helper only)
GET    /api/helper/can-bid             - Check if can bid on shifts (helper only)

# Hirer-specific routes
GET    /api/helper/hirer/profile       - Get hirer profile (hirer only)
PUT    /api/helper/hirer/profile       - Update hirer profile (hirer only)
POST   /api/helper/hirer/upload-documents - Upload verification docs (hirer only)
POST   /api/helper/hirer/upload-photo  - Upload profile photo (hirer only)
POST   /api/helper/hirer/submit-verification - Submit for verification (hirer only)
```

### User Routes (`/api/users`)
```
GET    /api/users/:userId              - Get user by ID
PUT    /api/users/:userId              - Update user profile
GET    /api/users/:userId/reviews      - Get user reviews
```

### Review Routes (`/api/reviews`)
```
POST   /api/reviews                    - Create a review
GET    /api/reviews/shift/:shiftId     - Get reviews for a shift
GET    /api/reviews/user/:userId       - Get reviews for a user
```

### Notification Routes (`/api/notifications`)
```
GET    /api/notifications              - Get user notifications
PUT    /api/notifications/:id/read     - Mark notification as read
DELETE /api/notifications/:id          - Delete notification
```

### Admin Routes (`/api/admin`)
All admin routes require authentication and admin role.

```
GET    /api/admin/stats                - Get dashboard statistics
GET    /api/admin/activity             - Get recent activity
GET    /api/admin/users                - Get all users
GET    /api/admin/users/:userId        - Get user by ID
PUT    /api/admin/users/:userId        - Update user
DELETE /api/admin/users/:userId        - Delete user
GET    /api/admin/verifications        - Get pending helper verifications
PUT    /api/admin/verify/:userId       - Update verification status
GET    /api/admin/hirer-verifications  - Get hirer verification requests
PUT    /api/admin/approve-hirer/:id    - Approve hirer verification
PUT    /api/admin/reject-hirer/:id     - Reject hirer verification
```

---

## 📱 Frontend Pages

### Public Pages
- `/` - Home/Landing page
- `/login` - Login page with Google OAuth
- `/register` - Registration selection page
- `/register/helper` - Helper registration form
- `/register/hirer` - Hirer registration form
- `/forgot-password` - Password recovery
- `/verify-otp` - OTP verification
- `/reset-password` - Password reset

### Worker/Helper Dashboard (`/worker/*`)
- `/worker/dashboard` - Main dashboard
- `/worker/profile` - Profile management
- `/worker/complete-profile` - Complete profile wizard
- `/worker/verification` - Document verification
- `/worker/schedule` - Availability management
- `/worker/find-shifts` - Browse available jobs
- `/worker/my-shifts` - View assigned shifts
- `/worker/applied-shifts` - View application history
- `/worker/wallet` - Earnings and wallet
- `/worker/notifications` - Notifications center
- `/worker/support` - Help and support
- `/worker/chat/:hirerId` - Chat with hirer

### Hirer Dashboard (`/hirer/*`)
- `/hirer/dashboard` - Main dashboard
- `/hirer/profile` - View profile
- `/hirer/profile/edit` - Edit profile
- `/hirer/verify` - Document verification
- `/hirer/post-shift` - Create new shift posting
- `/hirer/manage-jobs` - Manage all job postings
- `/hirer/shift/:id` - View specific shift details
- `/hirer/workers` - Browse available workers
- `/hirer/applicants` - View all applicants
- `/hirer/applicants/:shiftId` - View shift-specific applicants
- `/hirer/worker/:id` - View worker profile
- `/hirer/payments` - Payment tracking
- `/hirer/chat/:workerId` - Chat with worker

### Admin Dashboard (`/admin/*`)
- `/admin/dashboard` - Platform statistics and overview
- `/admin/verification` - Helper verification management
- `/admin/hirer-verification` - Hirer verification management
- `/admin/users` - User management
- `/admin/financials` - Financial overview
- `/admin/settings` - Platform settings

---

## 🔐 Authentication & Authorization

### Authentication Flow

1. **Registration**:
   - Users choose role (Helper or Hirer)
   - Fill registration form
   - Password is hashed with bcrypt
   - User record created in database

2. **Login**:
   - Email/password validation
   - JWT token generated
   - Token stored in httpOnly cookie
   - User data returned to client

3. **Google OAuth**:
   - User clicks "Continue with Google"
   - Redirects to Google consent screen
   - Receives credential token
   - Backend verifies with Google
   - Creates/updates user account
   - JWT token issued

4. **Password Reset**:
   - User requests password reset
   - OTP sent to email
   - User verifies OTP
   - User sets new password

### Authorization Middleware

**`protect` middleware**:
- Verifies JWT token from cookie or Authorization header
- Attaches user object to request
- Handles admin login from environment variables

**`authorizeRoles` middleware**:
- Checks if authenticated user has required role
- Supports multiple role requirements

**`verifyAdmin` middleware**:
- Specifically validates admin access
- Used for sensitive admin routes

### Protected Routes
- Helper routes: Require `helper` role
- Hirer routes: Require `hirer` role
- Admin routes: Require `admin` role
- Profile routes: Require authentication
- Review routes: Require authentication

---

## 🎨 Key Functionalities

### 1. Job/Shift Management
- **Posting**: Hirers create detailed job postings with:
  - Title, description, category
  - Payment range (min-max)
  - Location with map coordinates
  - Date and time range
  - Required skills
- **Browsing**: Workers filter and search jobs by:
  - Location
  - Category
  - Pay range
  - Date availability
- **Status Tracking**: Shifts move through states:
  - `open` → `reserved` → `in-progress` → `completed` / `cancelled`

### 2. Bidding System
- Workers place custom bids on shifts
- Bid includes:
  - Proposed rate
  - Estimated arrival time
  - Personalized message
- Hirers review and accept/reject bids
- One bid per worker per shift (unique constraint)

### 3. Application System
- Workers apply directly to shifts
- Applications tracked with status:
  - `pending` → `approved` / `rejected`
- Hirers manage applications from dashboard

### 4. Verification System

**Helper Verification**:
- Upload citizenship documents (front & back)
- Profile completion tracked (percentage)
- Admin reviews and approves/rejects
- Verified badge displayed on profile

**Hirer Verification**:
- Upload citizenship front & back
- Upload selfie with ID
- Admin verification process
- Impacts ability to post jobs

### 5. Rating & Review System
- Mutual rating after shift completion
- Both hirer and worker can rate each other
- 1-5 star rating system
- Optional text review (max 500 chars)
- Ratings aggregate to profile score
- One review per user per shift

### 6. Notification System
- Real-time notifications for:
  - New applications
  - Bid acceptance/rejection
  - Shift status changes
  - Verification updates
- Notification types:
  - `info`, `success`, `warning`, `error`
- Mark as read functionality

### 7. Profile Management

**Helper Profile**:
- Skills and experience
- Hourly rate
- Availability status
- Location with coordinates
- Completion percentage calculation
- Profile weights:
  - Basic fields (skill, experience, bio, rate, location): 80%
  - Verification (citizenship docs): 20%

**Hirer Profile**:
- Bio and description
- Profile and cover photos
- Address with coordinates
- Rating and hire count
- Verification status

### 8. Location Services
- Interactive map integration (Leaflet & Google Maps)
- Coordinate-based location storage
- Address breakdown:
  - District, Municipality, Ward, Street
- Location-based job matching
- Nepal-specific location data

### 9. File Upload System
- Multer configuration for image uploads
- Supported files: Images only (MIME type validation)
- File size limit: 5MB
- Storage: Local file system (`/uploads` directory)
- Unique filename generation
- Static file serving

### 10. Email Service
- Nodemailer integration
- OTP generation and delivery
- Password reset emails
- Verification notifications
- Custom email templates

### 11. Real-time Messaging System
- Direct messaging between hirers and workers
- Chat only available after application acceptance
- Message persistence using localStorage (demo)
- Real-time message interface
- Typing indicators and timestamps
- Professional communication tools
- Quick action templates
- Message history tracking
- Chat accessible from multiple pages:
  - ViewApplicants page
  - ShiftDetails page
  - Applicants overview page

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn
- Google OAuth credentials (for Google login)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment variables file** (`.env`):
   ```env
   # Server Configuration
   PORT=5000
   FRONTEND_URL=http://localhost:5173

   # Database
   MONGO_URI=mongodb://localhost:27017/nepshift
   # OR use MongoDB Atlas:
   # MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/nepshift

   # JWT Secret
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d

   # Admin Credentials
   ADMIN_EMAIL=admin@nepshift.com
   ADMIN_PASSWORD=admin123

   # Email Configuration (Nodemailer)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password

   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

4. **Create uploads directory**:
   ```bash
   mkdir uploads
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```
   Or production:
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API endpoint** in `src/utils/api.js`:
   ```javascript
   const api = axios.create({
     baseURL: "http://localhost:5000/api",
     withCredentials: true
   });
   ```

4. **Update Google OAuth Client ID** in `App.jsx`:
   ```jsx
   <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

6. **Build for production**:
   ```bash
   npm run build
   ```

### Database Setup

#### Option 1: Local MongoDB
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod

# MongoDB will run on mongodb://localhost:27017
```

#### Option 2: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get connection string
4. Update `MONGO_URI` in `.env`

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized JavaScript origins:
   - `http://localhost:5173`
   - `http://localhost:3000`
6. Add authorized redirect URIs
7. Copy Client ID and Client Secret
8. Update in `.env` and `App.jsx`

---

## 🌍 Environment Variables

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/nepshift` |
| `JWT_SECRET` | Secret key for JWT signing | `your_secret_key_here` |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `ADMIN_EMAIL` | Admin login email | `admin@nepshift.com` |
| `ADMIN_PASSWORD` | Admin login password | `admin123` |
| `EMAIL_HOST` | SMTP server host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP server port | `587` |
| `EMAIL_USER` | Email account username | `your-email@gmail.com` |
| `EMAIL_PASSWORD` | Email account password/app password | `your-app-password` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | From Google Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | From Google Console |
| `USE_MEMORY_DB` | Use in-memory MongoDB (dev) | `false` |

### Frontend Environment Variables (Optional)

Create `.env` in frontend directory if needed:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

---

## 📊 Database Relationships

```
User (role: helper)
  ├─ has one HelperProfile
  ├─ has many Applications (as worker)
  ├─ has many Bids (as worker)
  ├─ has many Reviews (as fromUser and toUser)
  ├─ has many Notifications (as recipient)
  └─ has many Shifts (as worker - assigned)

User (role: hirer)
  ├─ has many Shifts (as hirerId - posted)
  ├─ has many Bids (as hirerId - received)
  ├─ has many Reviews (as fromUser and toUser)
  └─ has many Notifications (as recipient)

User (role: admin)
  └─ can verify Users

Shift
  ├─ belongs to User (hirerId)
  ├─ may have one User (worker - assigned)
  ├─ has many Applications
  ├─ has many Bids
  └─ has many Reviews

Application
  ├─ belongs to User (worker)
  └─ belongs to Shift

Bid
  ├─ belongs to User (workerId)
  ├─ belongs to User (hirerId)
  └─ belongs to Shift

Review
  ├─ belongs to User (fromUser)
  ├─ belongs to User (toUser)
  └─ belongs to Shift

Notification
  └─ belongs to User (recipient)
```

---

## 🎯 Core Business Logic

### Shift Lifecycle

1. **Creation**: Hirer posts a shift (status: `open`)
2. **Discovery**: Workers browse open shifts
3. **Application**:
   - Workers apply directly OR
   - Workers place custom bids
4. **Selection**:
   - Hirer reviews applications/bids
   - Hirer accepts one application/bid
   - Shift status changes to `reserved`
   - Worker assigned to shift
5. **Execution**:
   - Shift date arrives
   - Status can be updated to `in-progress`
6. **Completion**:
   - Either party marks shift as `completed`
   - Stats updated (totalHires, totalJobsCompleted, earnings)
   - Review system unlocked
7. **Review**:
   - Both parties can rate each other
   - Ratings aggregate to user profiles

### Profile Completion Calculation (Helper)

**Formula**: 
- Skill Category: 16%
- Years of Experience: 16%
- About Me: 16%
- Hourly Rate: 16%
- Location (coordinates): 16%
- Citizenship Number: 7%
- Citizenship Front Image: 7%
- Citizenship Back Image: 6%

**Total**: 100%

**Profile considered complete**: ≥ 80%

### Rating Aggregation

When a review is created:
1. User's `ratingSum` += new rating value
2. User's `totalRatings` += 1
3. User's `rating` = ratingSum / totalRatings

Average rating displayed on profile.

---

## 🔒 Security Features

1. **Password Hashing**: bcrypt with 10 salt rounds
2. **JWT Authentication**: Secure token-based auth
3. **HTTP-only Cookies**: Prevents XSS attacks
4. **CORS Configuration**: Whitelist allowed origins
5. **Input Validation**: Required fields and format checks
6. **File Upload Validation**:
   - MIME type checking
   - File size limits
   - Secure filename generation
7. **Role-based Access Control**: Middleware authorization
8. **OTP Expiration**: Time-limited password reset
9. **Unique Constraints**: Prevent duplicate bids/reviews
10. **Admin Verification**: Two-step verification process

---

## 📈 Future Enhancements

### Potential Features
- [ ] WebSocket integration for real-time chat updates
- [ ] Push notifications for new messages
- [ ] Payment gateway integration (eSewa, Khalti)
- [ ] Mobile app (React Native)
- [ ] Advanced search filters
- [ ] Shift templates for recurring jobs
- [ ] Worker teams/groups
- [ ] Geofencing for attendance
- [ ] Analytics dashboard
- [ ] Multi-language support (Nepali)
- [ ] Video verification
- [ ] Background checks integration
- [ ] Insurance options
- [ ] Dispute resolution system
- [ ] Automated shift reminders
- [ ] File sharing in chat
- [ ] Voice messages
- [ ] Read receipts in messaging

---

## 🐛 Known Issues & Limitations

1. **File Storage**: Currently uses local file system (not scalable for production)
   - **Solution**: Integrate cloud storage (AWS S3, Cloudinary)

2. **Email Service**: Requires SMTP configuration
   - **Alternative**: Use services like SendGrid or AWS SES

3. **Chat System**: Currently uses localStorage for message persistence (demo)
   - **Solution**: Implement backend API for message storage and WebSocket for real-time updates
   - **Note**: Messages are stored per browser and not synchronized across devices

4. **Real-time Updates**: No WebSocket implementation for live notifications
   - **Solution**: Add Socket.io for live notifications and chat updates

5. **Payment Integration**: No payment gateway
   - **Solution**: Integrate local payment providers (eSewa, Khalti)

6. **Testing**: No unit/integration tests
   - **Solution**: Add Jest, Mocha, or Vitest

---

## 📝 API Response Formats

### Success Response
```json
{
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Pagination Response
```json
{
  "data": [],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

---

## 🤝 Contributing Guidelines

### Code Style
- Use ES6+ features
- Follow camelCase naming convention
- Add comments for complex logic
- Keep functions small and focused
- Use async/await over callbacks

### Commit Messages
- Use descriptive commit messages
- Format: `type(scope): message`
- Types: feat, fix, docs, style, refactor, test, chore

### Pull Request Process
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request with description

---

## 📞 Support & Contact

For questions, issues, or contributions:
- **Email**: support@nepshift.com
- **GitHub**: [Repository Link]
- **Documentation**: This file

---

## 📜 License

This project is proprietary software developed for educational purposes.

---

## 🙏 Acknowledgments

- **MongoDB**: Database solution
- **Express.js**: Backend framework
- **React**: Frontend library
- **Vite**: Build tool
- **TailwindCSS**: UI styling
- **Leaflet**: Map integration
- **Google**: OAuth authentication

---

## 📚 Additional Resources

### Documentation
- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [Vite Docs](https://vitejs.dev/)
- [TailwindCSS Docs](https://tailwindcss.com/)

### Tutorials
- [JWT Authentication](https://jwt.io/introduction)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Multer File Uploads](https://github.com/expressjs/multer)
- [React Router](https://reactrouter.com/)

---

**Last Updated**: February 7, 2026

**Version**: 1.0.0

**Project Name**: NepShift - Nepal Shift-Based Job Marketplace

---

*This documentation provides a comprehensive overview of the NepShift platform. For technical implementation details, refer to the source code and inline comments.*
