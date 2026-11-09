import jwt from "jsonwebtoken";
import { createRemoteJWKSet, jwtVerify } from "jose";

let jwks;
const oauthEnabled = () =>
  Boolean(process.env.OAUTH_JWKS_URI && process.env.OAUTH_ISSUER);

async function verifyOAuth(token) {
  jwks ??= createRemoteJWKSet(new URL(process.env.OAUTH_JWKS_URI));
  const { payload } = await jwtVerify(token, jwks, {
    issuer: process.env.OAUTH_ISSUER,
    audience: process.env.OAUTH_AUDIENCE || undefined,
  });
  return payload;
}

/**
 * Protects a route. Accepts:
 *  1) the local JWT returned by POST /api/auth/login
 *  2) an OAuth 2.0 / OIDC access token (if OAUTH_* env vars are set)
 * Expected header: Authorization: Bearer <token>
 */
export async function protect(req, res, next) {
  const [scheme, token] = (req.headers.authorization || "").split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Authentication required: missing Bearer token" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
    req.user = { id: payload.id, email: payload.email, provider: "local" };
    return next();
  } catch {
    /* not a valid local token, try OAuth below */
  }

  if (oauthEnabled()) {
    try {
      const payload = await verifyOAuth(token);
      req.user = { id: payload.sub, email: payload.email, provider: "oauth2" };
      return next();
    } catch {
      /* fall through */
    }
  }

  return res.status(401).json({ message: "Invalid or expired token" });
}
