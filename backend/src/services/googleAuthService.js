import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { HttpError } from "../utils/httpError.js";

const SALT_ROUNDS = 10;

const getGoogleClientId = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) throw new HttpError(500, "Google client ID not configured on server");
  return clientId;
};

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new HttpError(500, "JWT secret not configured on server");
  return secret;
};

const getJwtExpiresIn = () => process.env.JWT_EXPIRES_IN || "7d";

/**
 * Verifies a Google ID token (credential) and returns normalized identity.
 */
const verifyGoogleIdToken = async ({ credential }) => {
  if (!credential) throw new HttpError(400, "Google credential is required");

  const clientId = getGoogleClientId();
  const client = new OAuth2Client(clientId);

  let ticket;
  try {
    ticket = await client.verifyIdToken({ idToken: credential, audience: clientId });
  } catch {
    throw new HttpError(401, "Invalid Google credential");
  }

  const payload = ticket.getPayload();
  const email = payload?.email;
  const name = payload?.name;
  const googleId = payload?.sub;
  const picture = payload?.picture;
  const emailVerified = payload?.email_verified;

  if (!email) throw new HttpError(400, "Google account has no email");
  if (!googleId) throw new HttpError(400, "Google account missing subject identifier");

  return { email, name, googleId, picture, emailVerified };
};

/**
 * Upserts a user for Google login and returns (user, jwtToken).
 * Business rules:
 * - If user exists, attach googleId if missing.
 * - If user doesn't exist, create one with default role "helper".
 * - Because your schema requires `location`, set it to "unknown" for Google-created users.
 */
export const continueWithGoogleService = async ({ credential }) => {
  const { email, name, googleId, emailVerified } = await verifyGoogleIdToken({ credential });

  let user = await User.findOne({ email });

  if (!user) {
    const randomPassword = cryptoRandomPassword();
    const hashed = await bcrypt.hash(randomPassword, SALT_ROUNDS);

    user = await User.create({
      fullName: name || email.split("@")[0],
      email,
      password: hashed,
      role: "helper",
      location: "unknown",
      googleId,
      isVerified: false

    });
  } else {
    let changed = false;

    if (!user.googleId) {
      user.googleId = googleId;
      changed = true;
    }

    // // If they came from password signup, keep their existing isVerified.
    // if (emailVerified && !user.isVerified) {
    //   user.isVerified = false;
    //   changed = true;
    // }

    if (changed) await user.save();
  }

  const jwtToken = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    getJwtSecret(),
    { expiresIn: getJwtExpiresIn() },
  );

  return {
    message: "Google login successful",
    token: jwtToken,
    user: { id: user._id, fullName: user.fullName, role: user.role, email: user.email },
  };
};

const cryptoRandomPassword = () => {
  // Avoid bringing extra dependencies; this is only for satisfying the required password field.
  // Not used for login when using Google.
  return Math.random().toString(36).slice(-10);
};
