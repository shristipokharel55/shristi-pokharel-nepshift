import { continueWithGoogleService } from "../services/googleAuthService.js";
import { getCookieOptions } from "../utils/cookieOptions.js";
import { HttpError } from "../utils/httpError.js";


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;


export const continueWithGoogle = async (req, res) => {
  const credential = req.body?.credential || req.body?.token;
  console.log(credential);
  if (!credential) throw new HttpError(400, "Google credential is required");

  const result = await continueWithGoogleService({ credential });
  
  // Set token in httpOnly cookie
  if (result.token) {
    res.cookie("token", result.token, getCookieOptions());
  }
  console.log(result.user);
  
  // Return user info without token (token is in cookie)
  res.json({
    message: result.message,
    user: result.user,
  });
};
