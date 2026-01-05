import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children, requiredRole }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  // 1. Check if token exists
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  try {
    // 2. Decode token
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // 3. Check expiration
    if (decoded.exp < currentTime) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // 4. Check Role (if requiredRole is provided)
    if (requiredRole) {
       // Ideally the role in the token matches the structure you expect (e.g. decoded.role or decoded.user.role)
       // Adjust based on your actual token structure.
       // Based on Login.jsx: localStorage.setItem("role", res.data.user?.role || res.data.role);
       // We should rely on the token's role claim for better security than localStorage.
       // Assuming the token has a 'role' field.
       
       const userRole = decoded.role || decoded.user?.role;
       
       if (userRole !== requiredRole) {
         // unauthorized role
         if (userRole === "helper") {
            return <Navigate to="/helper/dashboard" replace />;
         } else if (userRole === "hirer") {
            // hirer dashboard doesn't exist yet based on file search, but we route there if it did
            // strictly following requirements: "Redirect to... The correct dashboard"
             return <Navigate to="/hirer/dashboard" replace />;
         } else {
             // Fallback
             return <Navigate to="/" replace />;
         }
       }
    }

    // 5. Auth & Role OK
    return children;

  } catch (error) {
    // Token invalid
    console.error("Invalid token:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
}
