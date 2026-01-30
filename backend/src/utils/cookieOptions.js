// Cookie options for JWT token
export const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  
  return {
    httpOnly: true,           // Prevents JavaScript access (XSS protection)
    secure: isProduction,     // Only send over HTTPS in production
    sameSite: isProduction ? "strict" : "lax", // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: "/",
  };
};

// Clear cookie options (for logout)
export const getClearCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    path: "/",
  };
};
