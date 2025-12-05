import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./pages/Login";
import RegisterSelect from "./pages/auth/RegisterSelect";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Register selection page */}
        <Route path="/register" element={<RegisterSelect />} />
        <Route path="/register/:role" element={<RegisterPage />} />

        {/* redirect root / to /login */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
