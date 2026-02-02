import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requiredRole }) {
  const location = useLocation();
  const { isAuthenticated, user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4FBFA]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A9287]"></div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Check role if required
  if (requiredRole) {
    const userRole = user.role;

    if (userRole !== requiredRole) {
      // Redirect to appropriate dashboard based on role
      if (userRole === "helper") {
        return <Navigate to="/worker/dashboard" replace />;
      } else if (userRole === "hirer") {
        return <Navigate to="/hirer/dashboard" replace />;
      } else if (userRole === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
      } else {
        return <Navigate to="/" replace />;
      }
    }
  }

  // Authenticated and authorized
  return children;
}
