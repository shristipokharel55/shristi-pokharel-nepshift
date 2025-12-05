import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./pages/Login";
import RegisterSelect from "./pages/auth/RegisterSelect";
import RegisterPage from "./pages/auth/RegisterPage";
import RegisterHelper from "./pages/auth/RegisterHelper";
import RegisterHirer from "./pages/auth/RegisterHirer";

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

        {/* redirect root / to /login */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
