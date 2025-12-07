import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import RegisterHelper from "./pages/auth/RegisterHelper";
import RegisterHirer from "./pages/auth/RegisterHirer";
import RegisterSelect from "./pages/auth/RegisterSelect";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyOTP from "./pages/auth/VerifyOtp";
import HelperDashboard from "./pages/helper/HelperDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        {/* Register selection page */}
        <Route path="/register" element={<RegisterSelect />} />
        {/* <Route path="/register/form" element={<RegisterPage />} />
        <Route path="/register/:role" element={<RegisterPage />} /> */}

        {/* Different Register Pages */}
        <Route path="/register/helper" element={<RegisterHelper />} />
        <Route path="/register/hirer" element={<RegisterHirer />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* redirect root / to /login */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/helper/dashboard" element={<HelperDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
