import { continueWithGoogleService } from "../services/googleAuthService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getCookieOptions } from "../utils/cookieOptions.js";
import { HttpError } from "../utils/httpError.js";

/**
 * POST /api/auth/google
 * Body: { credential: string } (accepts legacy { token: string } too)
 */
export const continueWithGoogle = asyncHandler(async (req, res) => {
  const credential = req.body?.credential || req.body?.token;
  if (!credential) throw new HttpError(400, "Google credential is required");

  const result = await continueWithGoogleService({ credential });
  
  // Set token in httpOnly cookie
  if (result.token) {
    res.cookie("token", result.token, getCookieOptions());
  }
  
  // Return user info without token (token is in cookie)
  res.json({
    message: result.message,
    user: result.user,
  });
});
