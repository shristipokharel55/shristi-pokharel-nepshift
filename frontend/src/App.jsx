import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import RegisterHelper from "./pages/auth/RegisterHelper";
import RegisterHirer from "./pages/auth/RegisterHirer";
import RegisterSelect from "./pages/auth/RegisterSelect";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyOTP from "./pages/auth/VerifyOtp";
import HelperDashboard from "./pages/helper/HelperDashboard";
import ProtectedRoute from "./middleware/ProtectedRoute";

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

        <Route
          path="/helper/dashboard"
          element={
            <ProtectedRoute requiredRole="helper">
              <HelperDashboard />
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

