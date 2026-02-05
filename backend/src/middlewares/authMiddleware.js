import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
  let token;

  // First, check for token in httpOnly cookie
  if (req.cookies?.token) {
    token = req.cookies.token;
  }
  // Fallback: check Authorization header (for backward compatibility)
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token)
    return res.status(401).json({ message: "Not authorized. No token." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Handle admin login from env variables (id is 'admin' string)
    if (decoded.id === 'admin' && decoded.role === 'admin') {
      req.user = {
        _id: 'admin',
        id: 'admin',
        email: decoded.email,
        role: 'admin',
        fullName: 'System Administrator'
      };
      return next();
    }

    req.user = await User.findById(decoded.id).select("-password");
    
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/**
 * Verify Admin Middleware
 * Checks if the authenticated user has admin role
 * Must be used after protect middleware
 */


export const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized. No user." });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: "Access denied. Admin privileges required." 
    });
  }

  next();
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission for this action" });
    }
    next();
  };
};

