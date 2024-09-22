import express from "express";
import AuthService from "../services/AuthService.js";
import CookieService from "../services/CookieService.js";
import { debug } from "console";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";

// Your client ID
const CLIENT_ID =
  "303195890971-l8gg6uuq4dn1khnjgeu1553tv5gaskh6.apps.googleusercontent.com";

async function verifyToken(token) {
  const googleCertsUrl = "https://www.googleapis.com/oauth2/v3/certs";
  const response = await fetch(googleCertsUrl);
  const certs = await response.json();

  // Verify the token with Google's public keys
  try {
    const decoded = jwt.verify(token, certs.keys[0].n, {
      audience: CLIENT_ID, // Specify your client ID here
    });

    debug("Token is valid:", decoded);
    return decoded;
  } catch (error) {
    debug("Invalid token:", error);
    return null;
  }
}

const AuthController = express.Router();

/**
 * /api/auth/login
 *
 * When logging in, generate an auth URL
 */
AuthController.get("/login", (req, res) => {
  const authService = new AuthService();
  const authUrl = authService.generateAuthUrl();
  return res.redirect(authUrl);
});

AuthController.get("/cookie", async (req, res, next) => {
  try {
    const { code } = req.query;
    const authService = new AuthService();
    debug("CODE FROM REDIRECT");
    debug(code);

    const { accessToken, refreshToken, idToken } =
      await authService.handleOAuthRedirect(code);

    res.cookie(
      CookieService.ID_TOKEN_COOKIE.name,
      idToken,
      CookieService.ID_TOKEN_COOKIE.cookie
    );
    res.cookie(
      CookieService.REFRESH_TOKEN_COOKIE.name,
      refreshToken,
      CookieService.REFRESH_TOKEN_COOKIE.cookie
    );
    res.cookie(
      CookieService.REFRESH_TOKEN_COOKIE_LOGOUT.name,
      refreshToken,
      CookieService.REFRESH_TOKEN_COOKIE_LOGOUT.cookie
    );

    return res.redirect("/profile");
  } catch (err) {
    console.error("Error handling redirect", err);
    return next(err);
  }
});

AuthController.post("/cookie", async (req, res, next) => {
  // Call this function when you receive a POST request with 'credential'
  verifyToken(req.body.credential);
  verifyToken(req.body.g_csrf_token);
  res.redirect("/");
});

AuthController.get("/refresh", async (req, res) => {
  console.log("Obtaining new ID token with the refresh token");
  // Get the refresh token, will only be present on /refresh call
  const refreshToken = req.cookies[CookieService.REFRESH_TOKEN_COOKIE.name];

  // Refresh token is not present
  if (!refreshToken) {
    console.log("Refresh token not found.");
    return res.sendStatus(401);
  }

  // Create a new ID token and set it on the cookie
  try {
    const authService = new AuthService();
    // Get a non-expired ID token, after refreshing if necessary
    const newIDToken = await authService.getNewIDToken(refreshToken);
    res.cookie(
      CookieService.ID_TOKEN_COOKIE.name,
      newIDToken,
      CookieService.ID_TOKEN_COOKIE.cookie
    );
    console.log("New ID token generated", newIDToken);
    return res.sendStatus(200);
    // Invalid refreshToken, clear cookie
  } catch (err) {
    console.log("Invalid refresh token");
    res.clearCookie(
      CookieService.REFRESH_TOKEN_COOKIE.name,
      CookieService.REFRESH_TOKEN_COOKIE.cookie
    );
    return res.sendStatus(401);
  }
});

AuthController.get("/logout", async (req, res, next) => {
  try {
    // Revoke refresh token access
    const refreshToken =
      req.cookies[CookieService.REFRESH_TOKEN_COOKIE_LOGOUT.name];
    const authService = new AuthService();
    await authService.revokeRefreshToken(refreshToken);

    // To clear a cookie you must have the same path specified.
    res.clearCookie(
      CookieService.ID_TOKEN_COOKIE.name,
      CookieService.ID_TOKEN_COOKIE.cookie
    );
    res.clearCookie(
      CookieService.REFRESH_TOKEN_COOKIE.name,
      CookieService.REFRESH_TOKEN_COOKIE.cookie
    );
    res.clearCookie(
      CookieService.REFRESH_TOKEN_COOKIE_LOGOUT.name,
      CookieService.REFRESH_TOKEN_COOKIE_LOGOUT.cookie
    );
    return res.redirect("/");
  } catch (err) {
    console.error("Error logging out", err);
    return next(err);
  }
});

export default AuthController;
