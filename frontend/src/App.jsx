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
import WorkerActiveJobs from "./pages/worker/WorkerActiveJobs";
import WorkerAvailability from "./pages/worker/WorkerAvailability";
import WorkerCompletedJobs from "./pages/worker/WorkerCompletedJobs";
import WorkerDashboard from "./pages/worker/WorkerDashboard";
import WorkerEarnings from "./pages/worker/WorkerEarnings";
import WorkerJobRequests from "./pages/worker/WorkerJobRequests";
import WorkerNearbyJobs from "./pages/worker/WorkerNearbyJobs";
import WorkerNotifications from "./pages/worker/WorkerNotifications";
import WorkerProfile from "./pages/worker/WorkerProfile";
import WorkerRatings from "./pages/worker/WorkerRatings";
import WorkerSupport from "./pages/worker/WorkerSupport";


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
          path="/worker/availability"
          element={
            <ProtectedRoute requiredRole="helper">
              <WorkerAvailability />
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker/nearby-jobs"
          element={
            <ProtectedRoute requiredRole="helper">
              <WorkerNearbyJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker/job-requests"
          element={
            <ProtectedRoute requiredRole="helper">
              <WorkerJobRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker/active-jobs"
          element={
            <ProtectedRoute requiredRole="helper">
              <WorkerActiveJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker/completed-jobs"
          element={
            <ProtectedRoute requiredRole="helper">
              <WorkerCompletedJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker/earnings"
          element={
            <ProtectedRoute requiredRole="helper">
              <WorkerEarnings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker/ratings"
          element={
            <ProtectedRoute requiredRole="helper">
              <WorkerRatings />
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

        {/* Hirer Dashboard Route - Placeholder since component is missing */}
        <Route
          path="/hirer/dashboard"
          element={
            <ProtectedRoute requiredRole="hirer">
              <div className="p-8 text-center">Hirer Dashboard Coming Soon...</div>
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
