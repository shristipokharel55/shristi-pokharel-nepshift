# NepShift - Complete Codebase Structure Documentation

## 📋 Project Overview

**NepShift** is a Nepal-based shift work marketplace platform that connects **workers/helpers** with **hirers** for temporary shift-based jobs. The platform features real-time messaging, job posting, bidding systems, application management, and user verification.

### Tech Stack
- **Backend**: Node.js with Express.js 5.2.1, MongoDB with Mongoose 9.0.0, Socket.IO 4.8.3
- **Frontend**: React 19.2.0, Vite 7.2.6, TailwindCSS 4.1.17, Socket.IO-Client 4.8.3
- **Authentication**: JWT with HTTP-only cookies, Google OAuth
- **Real-time**: Socket.IO with room-based messaging
- **Maps**: React Google Maps API, Leaflet
- **UI**: Lucide React icons, React Hot Toast, ApexCharts

---

## 🗂️ Root Structure

```
shristi-pokharel-nepshift/
├── backend/                    # Express.js REST API + Socket.IO server
├── frontend/                   # React SPA with Vite
├── .git/                       # Git version control
└── CODEBASE_STRUCTURE.md       # This documentation file
```

---

## 🔧 Backend Architecture

### Directory Structure

```
backend/
├── package.json                # Dependencies and scripts
├── .env                        # Environment variables (DB, JWT, OAuth, etc.)
├── .gitignore                  # Git ignore rules
├── node_modules/               # Installed dependencies
└── src/
    ├── server.js               # Application entry point
    ├── config/                 # Configuration files
    │   ├── db.js               # MongoDB connection setup
    │   └── socket.js           # Socket.IO server configuration
    ├── models/                 # Mongoose schemas
    │   ├── Application.js      # Job application schema
    │   ├── bid.js              # Bidding system schema
    │   ├── helperProfile.js    # Worker/helper profile details
    │   ├── Message.js          # Chat message schema
    │   ├── Notification.js     # Push notification schema
    │   ├── Review.js           # Rating and review schema
    │   ├── shift.js            # Job shift schema
    │   └── user.js             # User authentication schema
    ├── controllers/            # Business logic handlers
    │   ├── adminController.js
    │   ├── applicationController.js
    │   ├── authController.js
    │   ├── bidController.js
    │   ├── googleAuthController.js
    │   ├── helperController.js
    │   ├── hirerProfileController.js
    │   ├── hirerProfileController_backup.js
    │   ├── messageController.js
    │   ├── notificationController.js
    │   ├── reviewController.js
    │   ├── shiftController.js
    │   └── userController.js
    ├── routes/                 # API route definitions
    │   ├── adminRoutes.js
    │   ├── applicationRoutes.js
    │   ├── authRoutes.js
    │   ├── bidRoutes.js
    │   ├── helperRoutes.js
    │   ├── messageRoutes.js
    │   ├── notificationRoutes.js
    │   ├── reviewRoutes.js
    │   ├── shiftRoutes.js
    │   ├── someRoute.js
    │   └── userRoutes.js
    ├── middlewares/            # Express middleware
    │   ├── authMiddleware.js   # JWT verification, role-based access
    │   └── errorMiddleware.js  # Centralized error handling
    ├── services/               # External service integrations
    │   └── googleAuthService.js # Google OAuth handlers
    └── utils/                  # Utility functions
        ├── asyncHandler.js     # Async wrapper for error handling
        ├── cookieOptions.js    # Cookie configuration
        ├── generateToken.js    # JWT token generation
        ├── httpError.js        # HTTP error helpers
        ├── otpGenerator.js     # OTP generation for 2FA
        ├── profileCompletion.js # Profile completion percentage
        └── sendEmail.js        # Email service (Nodemailer)
```

### Backend File Descriptions

#### **server.js**
- **Purpose**: Application entry point
- **Responsibilities**:
  - Creates HTTP server from Express app
  - Initializes Socket.IO server
  - Connects to MongoDB database
  - Registers all API routes
  - Starts server on configured port
- **Key Code**: `createServer(app)`, `initializeSocket(server)`, `app.listen(PORT)`

#### **config/db.js**
- **Purpose**: MongoDB database connection
- **Responsibilities**:
  - Establishes Mongoose connection to MongoDB
  - Handles connection errors
  - Logs successful database connection
- **Environment Variables**: `MONGO_URI`

#### **config/socket.js**
- **Purpose**: Socket.IO real-time server configuration
- **Responsibilities**:
  - JWT authentication from HTTP-only cookies
  - Room-based chat management (join-chat, leave-chat)
  - Real-time message broadcasting
  - Typing indicators
  - Online/offline user status
- **Key Events**: `connection`, `join-chat`, `leave-chat`, `send-message`, `typing`, `stop-typing`
- **Authentication**: Parses JWT from cookie header, verifies token, attaches `socket.userId`

#### **models/user.js**
- **Purpose**: User authentication and profile schema
- **Fields**:
  - `fullName`, `email`, `password` (hashed), `phone`, `role` (worker/hirer/admin)
  - `isVerified`, `isGoogleAuth`, `profilePicture`
  - `location` (province, district, municipality, ward)
  - `status` (active/suspended/banned)
- **Methods**: `comparePassword()`, pre-save password hashing
- **Indexes**: `email` (unique)

#### **models/shift.js**
- **Purpose**: Job shift posting schema
- **Fields**:
  - `title`, `description`, `category`, `location`
  - `startDate`, `endDate`, `startTime`, `endTime`
  - `paymentType` (hourly/fixed), `paymentAmount`
  - `numberOfPositions`, `requiredSkills`, `status`
  - `hirerId` (ref: User), `applicants` array
- **Indexes**: `hirerId`, `category`, `status`

#### **models/Application.js**
- **Purpose**: Job application tracking schema
- **Fields**:
  - `shiftId` (ref: Shift), `workerId` (ref: User)
  - `status` (pending/approved/rejected/completed)
  - `appliedAt`, `coverLetter`, `expectedPay`
- **Indexes**: Compound index on `shiftId + workerId` (unique)

#### **models/bid.js**
- **Purpose**: Bidding system for negotiated shifts
- **Fields**:
  - `shiftId`, `workerId`, `hirerId`
  - `bidAmount`, `message`, `status` (pending/accepted/rejected)
- **Indexes**: `shiftId`, `workerId`, `hirerId`

#### **models/Message.js**
- **Purpose**: Real-time chat message storage
- **Fields**:
  - `chatId` (sorted user IDs: "userId1_userId2")
  - `sender` (ref: User), `receiver` (ref: User)
  - `senderType` (worker/hirer), `message`, `isRead`
  - `createdAt`, `updatedAt`
- **Indexes**: Compound index on `chatId + createdAt`, `receiver + isRead`
- **Room Strategy**: chatId ensures consistent room naming for bidirectional chat

#### **models/Notification.js**
- **Purpose**: In-app notification system
- **Fields**:
  - `userId` (ref: User), `type`, `title`, `message`
  - `isRead`, `link`, `createdAt`
- **Indexes**: `userId`, `isRead`

#### **models/Review.js**
- **Purpose**: Rating and review system
- **Fields**:
  - `reviewerId` (ref: User), `revieweeId` (ref: User)
  - `shiftId` (ref: Shift), `rating` (1-5), `comment`
- **Validation**: Rating between 1-5

#### **models/helperProfile.js**
- **Purpose**: Extended worker/helper profile details
- **Fields**:
  - `userId` (ref: User), `bio`, `skills`, `experience`
  - `availability`, `hourlyRate`, `documents`
  - `verificationStatus`, `completionPercentage`

#### **controllers/authController.js**
- **Purpose**: User authentication and authorization
- **Endpoints**:
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/login` - User login with JWT cookie
  - `POST /api/auth/logout` - Clear JWT cookie
  - `POST /api/auth/forgot-password` - Send OTP for password reset
  - `POST /api/auth/verify-otp` - Verify OTP code
  - `POST /api/auth/reset-password` - Reset password with token
  - `GET /api/auth/me` - Get current user profile
- **Security**: bcrypt password hashing, JWT token generation, HTTP-only cookies

#### **controllers/messageController.js**
- **Purpose**: Chat message CRUD operations
- **Endpoints**:
  - `GET /api/messages/:userId` - Get chat history with specific user
  - `POST /api/messages` - Send message (also handled by Socket.IO)
  - `PUT /api/messages/mark-read/:chatId` - Mark messages as read
  - `GET /api/messages/unread-count` - Get unread message count
- **Population**: Populates sender/receiver with `fullName` and `email`

#### **controllers/shiftController.js**
- **Purpose**: Job shift management
- **Endpoints**:
  - `POST /api/shifts` - Create new shift (hirer only)
  - `GET /api/shifts` - Get all shifts with filters
  - `GET /api/shifts/:id` - Get single shift details
  - `PUT /api/shifts/:id` - Update shift (hirer only)
  - `DELETE /api/shifts/:id` - Delete shift (hirer only)
  - `GET /api/shifts/hirer/my-shifts` - Get hirer's posted shifts
  - `GET /api/shifts/nearby` - Get shifts by location
- **Authorization**: Hirer role required for create/update/delete

#### **controllers/applicationController.js**
- **Purpose**: Job application workflow
- **Endpoints**:
  - `POST /api/applications` - Apply to shift (worker only)
  - `GET /api/applications/shift/:shiftId` - Get shift applicants (hirer)
  - `GET /api/applications/worker/my-applications` - Get worker applications
  - `PUT /api/applications/:id/status` - Update application status (hirer)
  - `DELETE /api/applications/:id` - Withdraw application (worker)
- **Status Flow**: pending → approved/rejected → completed

#### **controllers/bidController.js**
- **Purpose**: Bidding system for negotiated work
- **Endpoints**:
  - `POST /api/bids` - Submit bid on shift
  - `GET /api/bids/shift/:shiftId` - Get all bids for shift
  - `PUT /api/bids/:id/accept` - Accept bid (hirer)
  - `PUT /api/bids/:id/reject` - Reject bid (hirer)
- **Workflow**: Worker submits bid → Hirer accepts/rejects → Creates application if accepted

#### **controllers/notificationController.js**
- **Purpose**: Push notification management
- **Endpoints**:
  - `GET /api/notifications` - Get user notifications
  - `PUT /api/notifications/:id/read` - Mark as read
  - `PUT /api/notifications/mark-all-read` - Mark all as read
  - `DELETE /api/notifications/:id` - Delete notification

#### **controllers/reviewController.js**
- **Purpose**: Rating and review system
- **Endpoints**:
  - `POST /api/reviews` - Submit review after shift completion
  - `GET /api/reviews/user/:userId` - Get user's received reviews
  - `GET /api/reviews/shift/:shiftId` - Get shift-specific reviews
- **Validation**: Can only review after shift completion, one review per shift

#### **controllers/adminController.js**
- **Purpose**: Platform administration
- **Endpoints**:
  - `GET /api/admin/users` - List all users
  - `PUT /api/admin/users/:id/verify` - Verify user identity
  - `PUT /api/admin/users/:id/suspend` - Suspend user account
  - `GET /api/admin/dashboard-stats` - Platform statistics
- **Authorization**: Admin role required

#### **middlewares/authMiddleware.js**
- **Purpose**: Route protection and authorization
- **Exports**:
  - `protect()` - Verify JWT from cookie, attach `req.user`
  - `authorize(...roles)` - Check if user has required role
  - `isHirer()`, `isWorker()`, `isAdmin()` - Role-specific guards
- **Token Source**: Parses `token` cookie using `req.cookies.token`

#### **middlewares/errorMiddleware.js**
- **Purpose**: Centralized error handling
- **Handles**:
  - Mongoose validation errors
  - Duplicate key errors
  - Cast errors (invalid ObjectId)
  - JWT errors
  - Custom HttpError instances
- **Response**: Standardized JSON error format with status code and message

#### **utils/generateToken.js**
- **Purpose**: JWT token generation
- **Function**: `generateToken(user)` - Creates JWT with `id`, `email`, `role`
- **Expiration**: Configurable via `JWT_EXPIRE` env variable
- **Secret**: Uses `JWT_SECRET` from environment

#### **utils/sendEmail.js**
- **Purpose**: Email service with Nodemailer
- **Use Cases**:
  - OTP verification emails
  - Password reset emails
  - Application status notifications
  - Shift reminders
- **Configuration**: SMTP settings from environment variables

#### **utils/profileCompletion.js**
- **Purpose**: Calculate profile completion percentage
- **Logic**: Checks required fields (name, email, phone, location, bio, skills)
- **Returns**: Percentage value (0-100)

---

## 🎨 Frontend Architecture

### Directory Structure

```
frontend/
├── package.json                # Dependencies and scripts
├── .env                        # API URLs, Google OAuth keys
├── .gitignore                  # Git ignore rules
├── index.html                  # HTML entry point
├── vite.config.js              # Vite bundler configuration
├── eslint.config.js            # ESLint rules
├── node_modules/               # Installed dependencies
├── public/                     # Static assets
└── src/
    ├── main.jsx                # React app entry point
    ├── App.jsx                 # Root component with routing
    ├── App.css                 # Global styles
    ├── index.css               # TailwindCSS imports
    ├── assets/                 # Images, logos, icons
    ├── context/                # React Context providers
    │   ├── AuthContext.jsx     # User authentication state
    │   └── SocketContext.jsx   # Socket.IO connection management
    ├── middleware/             # Route guards
    │   └── ProtectedRoute.jsx  # Authentication-required routes
    ├── utils/                  # Utility functions
    │   ├── api.js              # Axios instance with interceptors
    │   └── nepalLocations.js   # Nepal provinces/districts data
    ├── components/             # Reusable components
    │   ├── admin/
    │   │   └── AdminLayout.jsx
    │   ├── auth/
    │   │   ├── HelperRegisterForm.jsx
    │   │   └── HirerRegisterForm.jsx
    │   ├── hirer/
    │   │   └── HirerLayout.jsx
    │   ├── worker/
    │   │   ├── BidModal.jsx
    │   │   └── WorkerLayout.jsx
    │   ├── landing/
    │   │   ├── Navbar.jsx
    │   │   ├── Hero.jsx
    │   │   ├── Features.jsx
    │   │   ├── HowItWorks.jsx
    │   │   ├── CTASection.jsx
    │   │   └── Footer.jsx
    │   └── ui/
    │       ├── PasswordToggle.jsx
    │       └── VerifiedBadge.jsx
    └── pages/                  # Page components
        ├── Home/
        │   └── Home.jsx
        ├── Login.jsx
        ├── auth/
        │   ├── RegisterPage.jsx
        │   ├── RegisterSelect.jsx
        │   ├── RegisterHelper.jsx
        │   ├── RegisterHirer.jsx
        │   ├── VerifyOtp.jsx
        │   ├── ForgotPassword.jsx
        │   └── ResetPassword.jsx
        ├── worker/
        │   ├── WorkerDashboard.jsx
        │   ├── WorkerProfile.jsx
        │   ├── CompleteProfile.jsx
        │   ├── FindShifts.jsx
        │   ├── AppliedShifts.jsx
        │   ├── MyShifts.jsx
        │   ├── WorkerActiveJobs.jsx
        │   ├── WorkerCompletedJobs.jsx
        │   ├── WorkerJobRequests.jsx
        │   ├── WorkerNearbyJobs.jsx
        │   ├── WorkerAvailability.jsx
        │   ├── WorkerEarnings.jsx
        │   ├── Wallet.jsx
        │   ├── WorkerRatings.jsx
        │   ├── WorkerNotifications.jsx
        │   ├── WorkerSupport.jsx
        │   ├── HelperVerification.jsx
        │   └── ChatWithHirer.jsx
        ├── hirer/
        │   ├── HirerDashboard.jsx
        │   ├── HirerProfile.jsx
        │   ├── HirerProfileEdit.jsx
        │   ├── PostShift.jsx
        │   ├── ManageJobs.jsx
        │   ├── ShiftDetails.jsx
        │   ├── ViewApplicants.jsx
        │   ├── Applicants.jsx
        │   ├── Workers.jsx
        │   ├── WorkerProfileView.jsx
        │   ├── HirerPayments.jsx
        │   ├── HirerVerification.jsx
        │   └── ChatWithWorker.jsx
        └── admin/
            ├── AdminDashboard.jsx
            ├── AdminUsers.jsx
            ├── AdminVerification.jsx
            ├── AdminHirerVerification.jsx
            ├── AdminFinancials.jsx
            └── AdminSettings.jsx
```

### Frontend File Descriptions

#### **main.jsx**
- **Purpose**: React application entry point
- **Responsibilities**:
  - Renders root React component
  - Wraps app with context providers (AuthProvider, SocketProvider)
  - Imports global styles (index.css, TailwindCSS)
- **Key Code**: `ReactDOM.createRoot(document.getElementById('root')).render(<App />)`

#### **App.jsx**
- **Purpose**: Root component with routing configuration
- **Responsibilities**:
  - Defines all application routes
  - Sets up role-based route protection
  - Implements route layouts (WorkerLayout, HirerLayout, AdminLayout)
- **Routes**:
  - Public: `/`, `/login`, `/register/*`, `/forgot-password`, `/reset-password`
  - Worker: `/worker/*` (dashboard, profile, find-shifts, chat, etc.)
  - Hirer: `/hirer/*` (dashboard, post-shift, applicants, chat, etc.)
  - Admin: `/admin/*` (users, verification, financials, settings)

#### **context/AuthContext.jsx**
- **Purpose**: Global authentication state management
- **State**:
  - `user` - Current user object (fullName, email, role, profilePicture)
  - `loading` - Authentication check in progress
  - `isAuthenticated` - Boolean login status
- **Methods**:
  - `login(email, password)` - Authenticate user
  - `logout()` - Clear session and cookies
  - `register(userData)` - Create new account
  - `updateUser(userData)` - Update user profile
- **Persistence**: Checks `/api/auth/me` on mount to restore session

#### **context/SocketContext.jsx**
- **Purpose**: Socket.IO connection lifecycle management
- **State**:
  - `socket` - Socket.IO client instance
  - `connected` - Connection status boolean
- **Lifecycle**:
  - Connects when user is authenticated
  - Disconnects on logout or component unmount
  - Auto-reconnects on connection loss
- **Configuration**: `withCredentials: true` for cookie authentication
- **Events**: Emits connection/disconnection events for debugging

#### **utils/api.js**
- **Purpose**: Axios HTTP client configuration
- **Base URL**: `http://localhost:5000/api` (from VITE_API_URL env)
- **Interceptors**:
  - Request: Attaches `withCredentials: true` for cookies
  - Response: Global error handling, token expiration redirect
- **Error Handling**: Parses backend error messages, shows toast notifications

#### **utils/nepalLocations.js**
- **Purpose**: Nepal geographical data
- **Data Structure**: 7 provinces → districts → municipalities → wards
- **Use Cases**: Location dropdowns in registration, shift posting, profile editing
- **Format**: Nested object hierarchy for province/district/municipality selection

#### **components/landing/Navbar.jsx**
- **Purpose**: Public landing page navigation
- **Features**:
  - Logo and branding
  - Navigation links (Home, Features, How It Works, About)
  - Login/Register buttons
  - Mobile responsive menu
- **State**: Menu open/close toggle for mobile

#### **components/landing/Hero.jsx**
- **Purpose**: Landing page hero section
- **Content**:
  - Main headline: "Find Shifts, Earn Flexibly"
  - Call-to-action buttons for workers and hirers
  - Background image/gradient
- **Actions**: Navigate to `/register/select` for role selection

#### **components/landing/Features.jsx**
- **Purpose**: Platform features showcase
- **Features Displayed**:
  - Real-time job matching
  - Secure payments
  - Verified users
  - Rating system
  - Mobile-friendly
- **UI**: Grid layout with icons and descriptions

#### **components/landing/HowItWorks.jsx**
- **Purpose**: Step-by-step process explanation
- **For Workers**: Register → Find Shifts → Apply → Work → Get Paid
- **For Hirers**: Register → Post Shift → Review Applicants → Hire → Rate
- **UI**: Timeline or numbered steps with illustrations

#### **components/worker/WorkerLayout.jsx**
- **Purpose**: Worker dashboard layout wrapper
- **Features**:
  - Sidebar navigation (Dashboard, Find Shifts, My Shifts, Profile, etc.)
  - Top header with notifications and profile dropdown
  - Logout button
  - Active route highlighting
- **Children**: Renders nested worker page components

#### **components/hirer/HirerLayout.jsx**
- **Purpose**: Hirer dashboard layout wrapper
- **Features**: Similar to WorkerLayout but with hirer-specific navigation
- **Navigation**: Dashboard, Post Shift, Manage Jobs, Workers, Profile

#### **components/admin/AdminLayout.jsx**
- **Purpose**: Admin panel layout wrapper
- **Navigation**: Dashboard, Users, Verification, Financials, Settings

#### **components/auth/HelperRegisterForm.jsx**
- **Purpose**: Worker registration form
- **Fields**:
  - Full Name, Email, Phone, Password
  - Location (Province, District, Municipality, Ward)
  - Skills, Experience, Hourly Rate
- **Validation**: Client-side form validation, password strength check
- **Submission**: Calls `register()` from AuthContext

#### **components/auth/HirerRegisterForm.jsx**
- **Purpose**: Hirer registration form
- **Fields**: Similar to worker form minus worker-specific fields
- **Additional**: Company name, business type (optional)

#### **components/worker/BidModal.jsx**
- **Purpose**: Worker bid submission modal
- **Fields**:
  - Bid amount (negotiated price)
  - Message to hirer (proposal/pitch)
- **Trigger**: Shown when worker clicks "Submit Bid" on shift details
- **Submission**: POST `/api/bids` with shiftId, bidAmount, message

#### **components/ui/PasswordToggle.jsx**
- **Purpose**: Reusable password show/hide toggle icon
- **UI**: Eye icon that toggles input type between "password" and "text"

#### **components/ui/VerifiedBadge.jsx**
- **Purpose**: Visual indicator for verified users
- **Display**: Checkmark badge next to user name
- **Conditional**: Only shown if `user.isVerified === true`

#### **pages/Login.jsx**
- **Purpose**: User login page
- **Fields**: Email, Password
- **Actions**:
  - Submit login form → `login()` from AuthContext
  - Google OAuth button → `/api/auth/google`
  - "Forgot Password?" link → `/forgot-password`
- **Redirect**: After login, redirect to role-based dashboard

#### **pages/auth/RegisterPage.jsx**
- **Purpose**: Registration flow container
- **Routes**:
  - `/register/select` - Role selection (worker/hirer)
  - `/register/helper` - Worker registration form
  - `/register/hirer` - Hirer registration form

#### **pages/auth/RegisterSelect.jsx**
- **Purpose**: Role selection page
- **UI**: Two cards - "I'm looking for work" vs "I need workers"
- **Navigation**: Redirects to appropriate registration form

#### **pages/auth/VerifyOtp.jsx**
- **Purpose**: OTP verification after registration
- **Flow**: User registers → receives OTP email → enters code → account activated
- **API**: POST `/api/auth/verify-otp` with email and OTP code

#### **pages/auth/ForgotPassword.jsx**
- **Purpose**: Initiate password reset flow
- **Action**: Enter email → sends OTP → redirect to reset password page
- **API**: POST `/api/auth/forgot-password`

#### **pages/auth/ResetPassword.jsx**
- **Purpose**: Set new password after OTP verification
- **Fields**: OTP code, new password, confirm password
- **API**: POST `/api/auth/reset-password`

#### **pages/worker/WorkerDashboard.jsx**
- **Purpose**: Worker home dashboard
- **Widgets**:
  - Upcoming shifts
  - Application status summary
  - Earnings this month
  - Profile completion percentage
  - Recent notifications
- **Charts**: Earnings over time (ApexCharts)

#### **pages/worker/FindShifts.jsx**
- **Purpose**: Browse available shifts
- **Features**:
  - Search by title/location
  - Filter by category, pay range, date range
  - Sort by pay, distance, date posted
  - Map view with shift markers (Leaflet/Google Maps)
- **Actions**: View shift details, apply, submit bid
- **API**: GET `/api/shifts` with query parameters

#### **pages/worker/AppliedShifts.jsx**
- **Purpose**: View worker's job applications
- **Status Tabs**: Pending, Approved, Rejected
- **Data**: Shift title, hirer name, applied date, status
- **Actions**:
  - Withdraw application (if pending)
  - Chat with hirer (if approved) - navigates to ChatWithHirer
  - Leave review (if completed)
- **API**: GET `/api/applications/worker/my-applications`

#### **pages/worker/MyShifts.jsx**
- **Purpose**: View worker's confirmed/upcoming shifts
- **Filters**: Active, Completed
- **Data**: Shift details, start time, hirer contact, payment info
- **Actions**: Chat with hirer, mark as completed, leave review
- **API**: GET `/api/shifts/worker/my-shifts`

#### **pages/worker/CompleteProfile.jsx**
- **Purpose**: Onboarding flow to complete worker profile
- **Steps**:
  1. Basic info (photo, bio)
  2. Skills and experience
  3. Availability and hourly rate
  4. Document upload (ID, certificates)
- **Progress Bar**: Shows completion percentage
- **API**: PUT `/api/users/profile`

#### **pages/worker/WorkerProfile.jsx**
- **Purpose**: View and edit worker profile
- **Sections**:
  - Profile photo, name, email, phone
  - Bio, skills, experience
  - Location, availability
  - Hourly rate, ratings
  - Verification status
- **Actions**: Edit profile, upload documents for verification

#### **pages/worker/ChatWithHirer.jsx**
- **Purpose**: Real-time chat interface for workers to message hirers
- **Features**:
  - Message history with scroll-to-bottom
  - Real-time message sending/receiving via Socket.IO
  - Typing indicators
  - Message timestamps
  - Read receipts
- **Socket Events**:
  - `join-chat` - Join chatId room (sorted user IDs)
  - `send-message` - Send message to hirer
  - `receive-message` - Receive messages from hirer
  - `leave-chat` - Leave room on unmount
- **State Management**:
  - Named handlers for proper cleanup (`handleReceiveMessage`, `handleMessageNotification`)
  - State reset on `hirerId` change
  - Duplicate message prevention
  - getChatId() double-check inside handlers
- **Chat ID Logic**: `chatId = [userId, hirerId].sort().join('_')` for consistency
- **API**: GET `/api/messages/:hirerId` for chat history
- **Access Control**: Only visible when application status is "approved"

#### **pages/hirer/HirerDashboard.jsx**
- **Purpose**: Hirer home dashboard
- **Widgets**:
  - Active shifts count
  - Total applicants
  - Hired workers count
  - Recent applications
  - Shift analytics
- **Charts**: Applications over time, shift categories breakdown

#### **pages/hirer/PostShift.jsx**
- **Purpose**: Create new job shift posting
- **Form Fields**:
  - Title, description, category
  - Location (province, district, municipality, ward)
  - Date range (start/end date), time range
  - Payment type (hourly/fixed), amount
  - Number of positions
  - Required skills
- **Validation**: Required fields, date/time validation, minimum pay
- **API**: POST `/api/shifts`

#### **pages/hirer/ManageJobs.jsx**
- **Purpose**: View and manage posted shifts
- **Tabs**: Active, Completed, Expired
- **Actions**:
  - Edit shift details
  - Delete shift
  - View applicants
  - Mark as completed
- **Data**: Shift title, applicants count, hired count, status, actions
- **API**: GET `/api/shifts/hirer/my-shifts`

#### **pages/hirer/ShiftDetails.jsx**
- **Purpose**: Detailed view of single shift
- **Sections**:
  - Shift information
  - Applicants list with profiles
  - Hired workers
  - Shift location on map
- **Actions**: View applicants, edit shift, chat with workers

#### **pages/hirer/ViewApplicants.jsx**
- **Purpose**: Review applicants for specific shift
- **Data Per Applicant**:
  - Worker profile photo, name, rating
  - Bio, skills, experience
  - Cover letter, expected pay
  - Application date
- **Actions**:
  - Approve application
  - Reject application
  - View full worker profile
  - Chat with worker (if approved)
- **API**: GET `/api/applications/shift/:shiftId`, PUT `/api/applications/:id/status`

#### **pages/hirer/ChatWithWorker.jsx**
- **Purpose**: Real-time chat interface for hirers to message workers
- **Features**: Identical to ChatWithHirer but from hirer perspective
- **Socket Events**: Same as worker chat (join-chat, send-message, receive-message, leave-chat)
- **State Management**: Mirrors worker chat - named handlers, state reset on `workerId` change, duplicate prevention
- **Chat ID Logic**: Same sorted user ID algorithm
- **API**: GET `/api/messages/:workerId` for chat history
- **Access Control**: Only visible when application status is "approved"
- **Sender Type**: Sends `senderType: 'hirer'` with messages

#### **pages/hirer/Workers.jsx**
- **Purpose**: Browse available workers
- **Features**:
  - Search by skills, location
  - Filter by rating, hourly rate, availability
  - Sort by rating, experience, rate
- **Actions**: View worker profile, send direct offer
- **API**: GET `/api/users?role=worker`

#### **pages/hirer/WorkerProfileView.jsx**
- **Purpose**: View detailed worker profile
- **Sections**:
  - Profile info, photo, verified badge
  - Skills, experience, bio
  - Ratings and reviews
  - Completed shifts count
  - Availability calendar
- **Actions**: Contact worker, send shift offer

#### **pages/admin/AdminDashboard.jsx**
- **Purpose**: Platform overview for admins
- **Metrics**:
  - Total users (workers/hirers)
  - Active shifts
  - Total applications
  - Platform revenue
  - Verification requests pending
- **Charts**: User growth, shift categories, revenue trends

#### **pages/admin/AdminUsers.jsx**
- **Purpose**: User management
- **Features**:
  - List all users with filters (role, status)
  - Search by name, email
  - Sort by registration date, activity
- **Actions**:
  - View user details
  - Suspend/unsuspend account
  - Ban user
  - View user activity logs
- **API**: GET `/api/admin/users`

#### **pages/admin/AdminVerification.jsx**
- **Purpose**: Worker verification requests management
- **Data**: Worker name, documents uploaded, verification status
- **Actions**:
  - Review documents (ID, certificates)
  - Approve verification
  - Reject with reason
  - Request additional documents
- **API**: GET `/api/admin/verification-requests`, PUT `/api/admin/verify-user/:id`

#### **pages/admin/AdminHirerVerification.jsx**
- **Purpose**: Hirer verification requests management
- **Similar to**: AdminVerification but for hirers (business documents)

#### **pages/admin/AdminFinancials.jsx**
- **Purpose**: Platform financial overview
- **Metrics**:
  - Total transactions
  - Platform fees collected
  - Pending payouts
  - Revenue by category
- **Charts**: Revenue over time, top earners, payout history

#### **pages/admin/AdminSettings.jsx**
- **Purpose**: Platform configuration
- **Settings**:
  - Platform fee percentage
  - Email templates
  - Featured categories
  - Verification requirements
  - Payment gateway settings

---

## 🔄 Data Flow & Architecture Patterns

### Architecture Pattern: MVC (Model-View-Controller)

```
Frontend (View) ←→ Backend (Controller) ←→ Database (Model)
     ↓                    ↓                      ↓
  React Pages      Express Controllers    Mongoose Models
```

### Request Flow Example: Worker Applies to Shift

1. **Frontend**: Worker clicks "Apply" on FindShifts.jsx
2. **API Call**: `POST /api/applications` via axios with shiftId, coverLetter
3. **Middleware**: `authMiddleware.protect()` verifies JWT cookie, attaches `req.user`
4. **Controller**: `applicationController.createApplication()` validates data
5. **Model**: Creates Application document in MongoDB
6. **Notification**: Creates Notification for hirer about new application
7. **Response**: Returns application object with 201 status
8. **Frontend**: Shows success toast, updates application list

### Real-time Chat Flow

```
Worker Browser                   Socket.IO Server                    Hirer Browser
     │                                  │                                  │
     │─────── join-chat (chatId) ──────>│                                  │
     │                                  │<───── join-chat (chatId) ────────│
     │                                  │   (both users in same room)       │
     │                                  │                                  │
     │── send-message ──────────────────>│                                  │
     │   (message text)                  │                                  │
     │                                  │                                  │
     │                                  │── Save to MongoDB ───>           │
     │                                  │                                  │
     │<────── receive-message ──────────│                                  │
     │   (message object)                │                                  │
     │                                  │                                  │
     │                                  │────── receive-message ─────────>│
     │                                  │   (message object)                │
     │                                  │                                  │
     │                                  │────── new-message-notification ─>│
     │                                  │   (sender info)                   │
```

### Authentication Flow

1. **Registration**: User fills form → POST `/api/auth/register` → User created with hashed password → OTP sent to email
2. **OTP Verification**: User enters OTP → POST `/api/auth/verify-otp` → User.isVerified = true
3. **Login**: User submits credentials → POST `/api/auth/login` → Password verified → JWT generated → Set HTTP-only cookie
4. **Protected Request**: Frontend makes API call → Cookie automatically sent → Middleware verifies token → Attaches `req.user`
5. **Logout**: User clicks logout → POST `/api/auth/logout` → Cookie cleared

### State Management

- **Global State**: React Context API (AuthContext, SocketContext)
- **Local State**: useState hooks in components
- **Server State**: Direct API calls with axios, no caching (future: React Query)
- **Real-time State**: Socket.IO event listeners update local state

---

## 🌐 Socket.IO Real-time Architecture

### Socket.IO Server Configuration (backend/src/config/socket.js)

**Authentication Strategy**: JWT from HTTP-only cookies
```javascript
// Parse cookie header, extract token, verify JWT, attach socket.userId
const cookies = socket.handshake.headers.cookie;
const token = cookies.match(/token=([^;]+)/)[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
socket.userId = decoded.id; // NOT decoded.userId (bug fix)
```

**Room Management**: Chat rooms based on sorted user IDs
```javascript
// Consistent chatId regardless of who initiates
const chatId = [userId1, userId2].sort().join('_');
socket.join(chatId);
```

**Key Events**:
- `connection` - New socket connected, log userId
- `join-chat` - User joins specific chatId room
- `leave-chat` - User leaves chatId room (cleanup)
- `send-message` - Broadcast message to room, save to DB
- `typing` - Notify other user typing started
- `stop-typing` - Notify typing stopped
- `disconnect` - Socket disconnected, cleanup

**Message Broadcasting**:
```javascript
// Save message to database
const message = await Message.create({ chatId, sender, receiver, message, senderType });

// Emit to room (both users)
io.to(chatId).emit('receive-message', { message });

// Notify receiver only (not sender)
socket.to(chatId).emit('new-message-notification', { sender: senderInfo });
```

### Socket.IO Client Configuration (frontend/src/context/SocketContext.jsx)

**Connection Management**:
```javascript
const socket = io(API_URL, {
  withCredentials: true, // Send cookies with connection
  autoConnect: false      // Manual connection control
});

// Connect when user authenticated
useEffect(() => {
  if (user) {
    socket.connect();
  } else {
    socket.disconnect();
  }
}, [user]);
```

**Event Listeners**: Set up in individual components (ChatWithWorker, ChatWithHirer)

**Cleanup Strategy**:
- Named handler functions for proper `socket.off()` removal
- `leave-chat` event on component unmount
- State reset when switching between chats

### Chat Component Pattern

**Common Structure** (both ChatWithWorker and ChatWithHirer):
```javascript
// 1. State
const [messages, setMessages] = useState([]);
const [newMessage, setNewMessage] = useState('');
const [otherUser, setOtherUser] = useState(null);

// 2. Named handlers (essential for cleanup)
const handleReceiveMessage = useCallback((data) => {
  const currentChatId = getChatId();
  if (data.message.chatId !== currentChatId) return; // Prevent cross-chat
  
  setMessages(prev => {
    if (prev.some(m => m._id === data.message._id)) return prev; // Dedup
    return [...prev, data.message];
  });
}, [userId, otherUserId]);

// 3. Socket event registration
useEffect(() => {
  if (!socket || !otherUserId) return;
  
  const chatId = getChatId();
  socket.emit('join-chat', { chatId });
  socket.on('receive-message', handleReceiveMessage);
  
  return () => {
    socket.off('receive-message', handleReceiveMessage);
    socket.emit('leave-chat', { chatId });
  };
}, [socket, otherUserId, handleReceiveMessage]);

// 4. State reset on user change
useEffect(() => {
  setMessages([]);
  setOtherUser(null);
  // Fetch fresh data
}, [otherUserId]);

// 5. Send message
const sendMessage = () => {
  const chatId = getChatId();
  socket.emit('send-message', {
    chatId,
    receiver: otherUserId,
    message: newMessage,
    senderType: 'worker' // or 'hirer'
  });
  setNewMessage('');
};
```

**Critical Bug Fixes Applied**:
1. ✅ Cookie-based auth instead of localStorage token
2. ✅ `decoded.id` instead of `decoded.userId`
3. ✅ Populate with `'fullName email'` instead of `'name email'`
4. ✅ Named handlers for proper socket.off() cleanup
5. ✅ getChatId() double-check in handlers
6. ✅ Duplicate message prevention
7. ✅ socket.to() for notifications (not io.to())
8. ✅ State reset on userId change
9. ✅ leave-chat event on unmount

---

## 🔐 Authentication & Authorization

### JWT Token Structure
```json
{
  "id": "user_mongodb_id",
  "email": "user@example.com",
  "role": "worker" // or "hirer" or "admin"
}
```

### Cookie Configuration (backend/src/utils/cookieOptions.js)
```javascript
{
  httpOnly: true,        // Prevent XSS attacks
  secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
  sameSite: 'strict',    // CSRF protection
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
}
```

### Authorization Middleware Flow
```
Request → authMiddleware.protect() → Check cookie → Verify JWT → req.user
                                          ↓
                                   authMiddleware.authorize('hirer')
                                          ↓
                                   Check req.user.role
                                          ↓
                                   Allow/Deny request
```

### Protected Routes (Frontend)
```jsx
<Route element={<ProtectedRoute allowedRoles={['worker']} />}>
  <Route path="/worker/dashboard" element={<WorkerDashboard />} />
</Route>
```

### Protected Routes (Backend)
```javascript
router.post('/shifts', protect, authorize('hirer'), shiftController.createShift);
router.put('/applications/:id/status', protect, authorize('hirer'), applicationController.updateStatus);
```

---

## 🗄️ Database Models & Relationships

### Entity Relationship Diagram

```
                    ┌─────────────┐
                    │    User     │
                    │ (worker/    │
                    │  hirer/     │
                    │  admin)     │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
      ┌───────────┐  ┌─────────┐  ┌──────────┐
      │   Shift   │  │  Bid    │  │ Message  │
      │ (posted by│  │         │  │          │
      │   hirer)  │  │         │  │          │
      └─────┬─────┘  └────┬────┘  └────┬─────┘
            │             │            │
            ▼             └────────────┘
    ┌──────────────┐           │
    │ Application  │◄──────────┘
    │ (worker to   │
    │   shift)     │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │   Review     │
    │ (after       │
    │  completion) │
    └──────────────┘
```

### Key Relationships

- **User → Shift**: One-to-Many (hirer posts many shifts)
- **Shift → Application**: One-to-Many (shift has many applicants)
- **User → Application**: One-to-Many (worker applies to many shifts)
- **User → Bid**: One-to-Many (worker submits many bids)
- **User ↔ Message**: Many-to-Many (users message each other)
- **Application → Review**: One-to-One (one review per completed shift)
- **User → Notification**: One-to-Many (user receives many notifications)
- **User → HelperProfile**: One-to-One (worker has extended profile)

---

## 🚀 API Routes Reference

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Create new account |
| POST | `/login` | Public | Login with credentials |
| POST | `/logout` | Private | Clear JWT cookie |
| POST | `/forgot-password` | Public | Send OTP for reset |
| POST | `/verify-otp` | Public | Verify OTP code |
| POST | `/reset-password` | Public | Reset password with token |
| GET | `/me` | Private | Get current user |
| PUT | `/profile` | Private | Update user profile |

### Shift Routes (`/api/shifts`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Private | List all shifts (with filters) |
| POST | `/` | Hirer | Create new shift |
| GET | `/:id` | Private | Get shift details |
| PUT | `/:id` | Hirer | Update shift |
| DELETE | `/:id` | Hirer | Delete shift |
| GET | `/hirer/my-shifts` | Hirer | Get hirer's posted shifts |
| GET | `/worker/my-shifts` | Worker | Get worker's accepted shifts |
| GET | `/nearby` | Private | Get shifts near location |

### Application Routes (`/api/applications`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Worker | Apply to shift |
| GET | `/shift/:shiftId` | Hirer | Get shift applicants |
| GET | `/worker/my-applications` | Worker | Get worker's applications |
| PUT | `/:id/status` | Hirer | Approve/reject application |
| DELETE | `/:id` | Worker | Withdraw application |

### Bid Routes (`/api/bids`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Worker | Submit bid |
| GET | `/shift/:shiftId` | Hirer | Get shift bids |
| PUT | `/:id/accept` | Hirer | Accept bid |
| PUT | `/:id/reject` | Hirer | Reject bid |

### Message Routes (`/api/messages`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/:userId` | Private | Get chat history with user |
| POST | `/` | Private | Send message (REST fallback) |
| PUT | `/mark-read/:chatId` | Private | Mark messages as read |
| GET | `/unread-count` | Private | Get unread message count |

**Note**: Primary message sending uses Socket.IO `send-message` event for real-time delivery.

### Notification Routes (`/api/notifications`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Private | Get user notifications |
| PUT | `/:id/read` | Private | Mark notification as read |
| PUT | `/mark-all-read` | Private | Mark all as read |
| DELETE | `/:id` | Private | Delete notification |

### Review Routes (`/api/reviews`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Private | Submit review |
| GET | `/user/:userId` | Public | Get user's reviews |
| GET | `/shift/:shiftId` | Private | Get shift reviews |

### Admin Routes (`/api/admin`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/users` | Admin | List all users |
| PUT | `/users/:id/verify` | Admin | Verify user |
| PUT | `/users/:id/suspend` | Admin | Suspend user |
| GET | `/dashboard-stats` | Admin | Platform statistics |
| GET | `/verification-requests` | Admin | Pending verifications |

---

## 📦 Key Dependencies

### Backend Dependencies
```json
{
  "express": "^5.2.1",           // Web framework
  "mongoose": "^9.0.0",          // MongoDB ODM
  "socket.io": "^4.8.3",         // Real-time communication
  "bcrypt": "^6.0.0",            // Password hashing
  "jsonwebtoken": "^9.0.2",      // JWT authentication
  "cookie-parser": "^2.0.0",     // Cookie parsing
  "multer": "^2.0.2",            // File uploads
  "nodemailer": "^7.0.11",       // Email service
  "dotenv": "^16.4.7",           // Environment variables
  "cors": "^3.0.2"               // CORS middleware
}
```

### Frontend Dependencies
```json
{
  "react": "^19.2.0",                      // UI library
  "react-dom": "^19.2.0",                  // DOM rendering
  "react-router-dom": "^7.10.1",           // Routing
  "socket.io-client": "^4.8.3",            // Socket.IO client
  "axios": "^1.13.2",                      // HTTP client
  "tailwindcss": "^4.1.17",                // CSS framework
  "@tailwindcss/vite": "^4.1.17",          // TailwindCSS Vite plugin
  "lucide-react": "^0.556.0",              // Icon library
  "react-hot-toast": "^2.6.0",             // Toast notifications
  "apexcharts": "^5.3.6",                  // Charts
  "react-apexcharts": "^1.9.0",            // React wrapper for charts
  "@react-google-maps/api": "^2.20.8",     // Google Maps
  "leaflet": "^1.9.4",                     // Map library
  "react-leaflet": "^5.0.0",               // React Leaflet
  "jwt-decode": "^4.0.0",                  // JWT decoding
  "@react-oauth/google": "^0.8.0",         // Google OAuth
  "vite": "^7.2.4"                         // Build tool
}
```

---

## 🔧 Environment Variables

### Backend `.env`
```bash
# Database
MONGO_URI=mongodb://localhost:27017/nepshift

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d

# Server
PORT=5000
NODE_ENV=development

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Frontend URL (CORS)
CLIENT_URL=http://localhost:5173
```

### Frontend `.env`
```bash
# API Base URL
VITE_API_URL=http://localhost:5000/api

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# Google Maps API (if using Google Maps)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

---

## 📝 Development Workflow

### Starting the Application

**Backend**:
```bash
cd backend
npm install
npm run dev  # Starts with nodemon on port 5000
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev  # Starts Vite dev server on port 5173
```

### Typical Development Scenario

1. **Create New Feature**: Shift Reminder Notifications
   
   a. **Backend**:
   - Create `backend/src/controllers/reminderController.js`
   - Add reminder logic to send notification 1 hour before shift
   - Create cron job or scheduled task
   - Add route in `backend/src/routes/notificationRoutes.js`
   
   b. **Frontend**:
   - Add notification bell icon in WorkerLayout/HirerLayout
   - Create notification dropdown component
   - Fetch notifications in real-time via Socket.IO event
   - Display toast when reminder received
   
   c. **Testing**:
   - Test API endpoint with Postman
   - Test Socket.IO event with Socket.IO client
   - Test UI notification display

2. **Database Changes**:
   - Modify Mongoose schema in `backend/src/models/`
   - Run migration if needed (manual or via migration tool)
   - Update controllers to handle new fields
   - Update frontend forms to capture new fields

3. **Bug Fix Example**: Message not sending
   - Check browser console for Socket.IO errors
   - Check backend terminal for Socket.IO connection logs
   - Verify JWT token in cookies (DevTools → Application → Cookies)
   - Check MongoDB for message document creation
   - Verify Socket.IO event handlers with console.log
   - Test chatId calculation on both frontend and backend

---

## 🧪 Testing Strategy

### Manual Testing Checklist

**Authentication Flow**:
- [ ] Register as worker
- [ ] Register as hirer
- [ ] Verify OTP
- [ ] Login with credentials
- [ ] Login with Google OAuth
- [ ] Forgot password flow
- [ ] Logout

**Worker Flow**:
- [ ] Complete profile
- [ ] Browse available shifts
- [ ] Filter shifts by location/category
- [ ] Apply to shift
- [ ] Submit bid on shift
- [ ] View application status
- [ ] Chat with hirer after approval
- [ ] Mark shift as completed
- [ ] Leave review for hirer

**Hirer Flow**:
- [ ] Post new shift
- [ ] Edit shift details
- [ ] View applicants
- [ ] Approve/reject applications
- [ ] Chat with worker after approval
- [ ] Mark shift as completed
- [ ] Leave review for worker

**Admin Flow**:
- [ ] View platform statistics
- [ ] Verify worker documents
- [ ] Verify hirer business
- [ ] Suspend user account
- [ ] View financial reports

**Real-time Chat**:
- [ ] Send message from worker to hirer
- [ ] Receive message on hirer side
- [ ] Send message from hirer to worker
- [ ] Receive message on worker side
- [ ] Message persistence after page refresh
- [ ] Chat isolation (no cross-chat contamination)
- [ ] Typing indicators
- [ ] Read receipts

---

## 🚧 Known Issues & Future Enhancements

### Known Issues
- `hirerProfileController_backup.js` suggests recent refactoring - cleanup needed
- `someRoute.js` in routes folder - purpose unclear, may need removal
- No automated tests (unit/integration/e2e)
- No error logging service (e.g., Sentry)
- No rate limiting on API endpoints
- No image compression before upload
- No database backup strategy documented

### Future Enhancements
- **Real-time Features**:
  - Online/offline user status indicators
  - Typing indicators in chat
  - Message read receipts
  - Push notifications (Firebase Cloud Messaging)
  - Voice/video chat integration

- **Payment Integration**:
  - eSewa payment gateway (Nepal)
  - Khalti payment gateway (Nepal)
  - Payment escrow system
  - Automated payouts to workers
  - Transaction history

- **Advanced Features**:
  - GPS-based shift matching
  - Calendar integration (Google Calendar, Apple Calendar)
  - Background check integration
  - Skill assessment tests
  - Worker availability calendar
  - Shift scheduling optimizer
  - Mobile app (React Native)

- **Analytics**:
  - Worker performance metrics
  - Hirer satisfaction scores
  - Platform usage analytics (Mixpanel/Google Analytics)
  - Revenue forecasting

- **Security**:
  - Two-factor authentication (2FA)
  - Rate limiting (express-rate-limit)
  - Input sanitization (express-validator)
  - CSRF protection
  - Content Security Policy (CSP)

- **DevOps**:
  - Docker containerization
  - CI/CD pipeline (GitHub Actions)
  - Automated testing (Jest, React Testing Library)
  - Production deployment (AWS/DigitalOcean)
  - Database backups automated
  - Monitoring and alerting (Datadog, New Relic)

---

## 📚 Code Conventions & Best Practices

### Backend
- **ES Modules**: Using `import/export` syntax (not `require`)
- **Async/Await**: All async operations use async/await, wrapped with asyncHandler
- **Error Handling**: Centralized error middleware, custom HttpError class
- **Validation**: Mongoose schema validation + controller-level validation
- **Security**: HTTP-only cookies, bcrypt hashing, JWT expiration
- **Naming**: camelCase for variables/functions, PascalCase for models/classes

### Frontend
- **Functional Components**: All components use React hooks (no class components)
- **State Management**: Context API for global state, useState for local
- **Props**: Destructuring in function parameters
- **Styling**: TailwindCSS utility classes, no inline styles
- **Routing**: React Router v6 with nested routes
- **API Calls**: Centralized axios instance in `utils/api.js`
- **Naming**: PascalCase for components, camelCase for functions/variables

### Socket.IO
- **Room Naming**: Sorted user IDs joined with underscore
- **Event Naming**: Kebab-case (e.g., `join-chat`, `send-message`)
- **Error Handling**: Try-catch blocks in all listeners
- **Cleanup**: Always remove listeners in useEffect cleanup function
- **Named Handlers**: Use named functions (not anonymous) for proper cleanup

---

## 🔍 Debugging Tips

### Backend Debugging
```javascript
// Add detailed logging in Socket.IO handlers
socket.on('send-message', async (data) => {
  console.log('📨 Message received from:', socket.userId);
  console.log('📨 Message data:', data);
  console.log('📨 ChatId:', data.chatId);
  // ... rest of handler
});
```

### Frontend Debugging
```javascript
// Log Socket.IO events
useEffect(() => {
  if (!socket) return;
  
  socket.on('connect', () => console.log('✅ Socket connected'));
  socket.on('disconnect', () => console.log('❌ Socket disconnected'));
  socket.on('receive-message', (data) => {
    console.log('📬 Message received:', data);
  });
}, [socket]);
```

### Common Issues & Solutions

**Issue**: "Invalid token" in Socket.IO connection
- **Solution**: Verify JWT cookie exists, check cookie parsing in socket.js

**Issue**: Messages not showing in chat
- **Solution**: Check chatId calculation, verify room join/leave, check MongoDB

**Issue**: Cross-chat contamination
- **Solution**: Implement proper cleanup (socket.off, leave-chat), reset state on userId change

**Issue**: Port 5000 already in use
- **Solution**: Kill existing Node process or change port in `.env`

**Issue**: MongoDB connection error
- **Solution**: Verify MongoDB is running, check `MONGO_URI` in `.env`

---

## 📖 Additional Resources

### Documentation Links
- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [Socket.IO Docs](https://socket.io/docs/v4/)
- [React Docs](https://react.dev/)
- [TailwindCSS Docs](https://tailwindcss.com/)
- [Vite Docs](https://vitejs.dev/)

### API Testing
- Use **Postman** for testing REST API endpoints
- Use **Socket.IO Client** browser extension for testing Socket.IO events

### Database Tools
- **MongoDB Compass** for GUI database management
- **Robo 3T** as alternative MongoDB client

---

## 👥 Contributors & Maintenance

**Project Maintainer**: Shristi Pokharel  
**Last Updated**: January 2025  
**Node Version**: v18+ recommended  
**npm Version**: v9+ recommended  

---

**End of Documentation**
