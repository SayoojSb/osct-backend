const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const crypto = require("crypto");

/**
 * STEP 1: Redirect user to GitHub OAuth
 * - Generate state (CSRF protection)
 * - Store state in signed cookie
 * - Optionally store redirect_uri (frontend origin)
 */
router.get("/github", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  const redirectUri = req.query.redirect_uri;

  // Store frontend origin (if provided)
  if (redirectUri) {
    res.cookie("oauth_redirect", redirectUri, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      signed: true,
      maxAge: 1000 * 60 * 5, // 5 minutes
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
  }

  // ALWAYS store OAuth state
  res.cookie("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    maxAge: 1000 * 60 * 5, // 5 minutes
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  const redirectUrl =
    "https://github.com/login/oauth/authorize" +
    `?client_id=${process.env.GITHUB_CLIENT_ID}` +
    `&state=${state}` +
    `&scope=read:user`;

  return res.redirect(redirectUrl);
});

/**
 * STEP 2: GitHub OAuth callback
 * - Verify state
 * - Exchange code for access token
 * - Fetch GitHub user
 * - Create / find user
 * - Issue JWT
 * - Redirect back to correct frontend
 */
router.get("/github/callback", async (req, res) => {
  try {
    const { code, state } = req.query;
    const cookieState = req.signedCookies?.oauth_state;
    const redirectFromCookie = req.signedCookies?.oauth_redirect;

    if (!code) {
      return res.redirect(`${process.env.HOST_URL}/login?error=no_code`);
    }

    // CSRF protection
    if (!state || !cookieState || state !== cookieState) {
      console.warn("GitHub OAuth: State mismatch.");
      res.clearCookie("oauth_state");
      return res.redirect(`${process.env.HOST_URL}/login?error=invalid_state`);
    }

    // Clear state cookie after verification
    res.clearCookie("oauth_state", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    // Exchange code for access token
    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    });

    const tokenRes = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      }
    );

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error("No access token:", tokenData);
      return res.redirect(`${process.env.HOST_URL}/login?error=bad_verification`);
    }

    const accessToken = tokenData.access_token;

    // Fetch GitHub user
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const githubUser = await userRes.json();

    let user = await User.findOne({ githubId: githubUser.id });

    if (!user) {
      user = await User.create({
        githubId: githubUser.id,
        username: githubUser.login,
      });
    }

    // Issue JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Decide redirect target
    const baseRedirectUrl =
      redirectFromCookie || (process.env.HOST_URL || "").trim();

    if (!baseRedirectUrl) {
      console.error("No redirect URL available.");
      return res
        .status(500)
        .send("Configuration error: redirect URL missing");
    }

    // Clear redirect cookie after use
    res.clearCookie("oauth_redirect", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    const finalRedirectUrl = `${baseRedirectUrl}/auth/success?token=${token}`;
    console.log("REDIRECTING TO FINAL:", finalRedirectUrl);

    return res.redirect(finalRedirectUrl);
  } catch (err) {
    console.error("GitHub OAuth error:", err);
    return res.redirect(`${process.env.HOST_URL}/login?error=server_error`);
  }
});

module.exports = router;
