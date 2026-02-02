import {
    Route,
    BrowserRouter as Router,
    Routes
} from "react-router-dom";
import ProtectedRoute from "./middleware/ProtectedRoute";
import Home from "./pages/Home/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import RegisterHelper from "./pages/auth/RegisterHelper";
import RegisterHirer from "./pages/auth/RegisterHirer";
import RegisterSelect from "./pages/auth/RegisterSelect";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyOTP from "./pages/auth/VerifyOtp";

// Worker Dashboard Pages
import CompleteProfile from "./pages/worker/CompleteProfile";
import FindShifts from "./pages/worker/FindShifts";
import HelperVerification from "./pages/worker/HelperVerification";
import MyShifts from "./pages/worker/MyShifts";
import Wallet from "./pages/worker/Wallet";
import WorkerAvailability from "./pages/worker/WorkerAvailability";
import WorkerDashboard from "./pages/worker/WorkerDashboard";
import WorkerNotifications from "./pages/worker/WorkerNotifications";
import WorkerProfile from "./pages/worker/WorkerProfile";
import WorkerSupport from "./pages/worker/WorkerSupport";

// Hirer Dashboard Pages
import Applicants from "./pages/hirer/Applicants";
import HirerDashboard from "./pages/hirer/HirerDashboard";
import HirerPayments from "./pages/hirer/HirerPayments";
import HirerProfile from "./pages/hirer/HirerProfile";
import ManageJobs from "./pages/hirer/ManageJobs";
import PostShift from "./pages/hirer/PostShift";

// Admin Dashboard Pages
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminFinancials from "./pages/admin/AdminFinancials";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminVerification from "./pages/admin/AdminVerification";


function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page is now the HOME route */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        {/* Register selection page */}
        <Route path="/register" element={<RegisterSelect />} />

        {/* Different Register Pages */}
        <Route path="/register/helper" element={<RegisterHelper />} />
        <Route path="/register/hirer" element={<RegisterHirer />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Helper dashboard now redirects to Worker Dashboard */}
        <Route
          path="/helper/dashboard"
          element={
            <ProtectedRoute requiredRole="helper">
              <WorkerDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================================== */}
        {/* WORKER DASHBOARD ROUTES */}
        {/* ================================== */}
        <Route
          path="/worker/dashboard"
          element={
            <ProtectedRoute requiredRole="helper">
              <WorkerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker/profile"
          element={
            <ProtectedRoute requiredRole="helper">
              <WorkerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker/schedule"
          element={
            <ProtectedRoute requiredRole="helper">
              <WorkerAvailability />
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker/find-shifts"
          element={
            <ProtectedRoute requiredRole="helper">
              <FindShifts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker/my-shifts"
          element={
            <ProtectedRoute requiredRole="helper">
              <MyShifts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker/wallet"
          element={
            <ProtectedRoute requiredRole="helper">
              <Wallet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker/notifications"
          element={
            <ProtectedRoute requiredRole="helper">
              <WorkerNotifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker/support"
          element={
            <ProtectedRoute requiredRole="helper">
              <WorkerSupport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker/complete-profile"
          element={
            <ProtectedRoute requiredRole="helper">
              <CompleteProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker/verification"
          element={
            <ProtectedRoute requiredRole="helper">
              <HelperVerification />
            </ProtectedRoute>
          }
        />

        {/* ================================== */}
        {/* HIRER DASHBOARD ROUTES */}
        {/* ================================== */}
        <Route
          path="/hirer/dashboard"
          element={
            <ProtectedRoute requiredRole="hirer">
              <HirerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hirer/post-shift"
          element={
            <ProtectedRoute requiredRole="hirer">
              <PostShift />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hirer/manage-jobs"
          element={
            <ProtectedRoute requiredRole="hirer">
              <ManageJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hirer/applicants"
          element={
            <ProtectedRoute requiredRole="hirer">
              <Applicants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hirer/payments"
          element={
            <ProtectedRoute requiredRole="hirer">
              <HirerPayments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hirer/profile"
          element={
            <ProtectedRoute requiredRole="hirer">
              <HirerProfile />
            </ProtectedRoute>
          }
        />

        {/* ================================== */}
        {/* ADMIN DASHBOARD ROUTES */}
        {/* ================================== */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="verification" element={<AdminVerification />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="financials" element={<AdminFinancials />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route index element={<AdminDashboard />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
