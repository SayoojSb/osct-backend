const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()

const crypto = require('crypto');

router.get("/github", (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');

  // Store state in a signed cookie (httpOnly, secure)
  res.cookie('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    maxAge: 1000 * 60 * 5, // 5 mins
    sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax'
  });

  const redirectUrl =
    "https://github.com/login/oauth/authorize" +
    `?client_id=${process.env.GITHUB_CLIENT_ID}` +
    `&state=${state}` +
    `&scope=read:user`;

  res.redirect(redirectUrl);
});


router.get('/github/callback', async (req, res) => {
  try {
    const { code, state } = req?.query;
    const cookieState = req.signedCookies?.oauth_state;

    if (!code) {
      return res.redirect(`${process.env.HOST_URL}/login?error=no_code`);
    }

    // Verify state matches (CSRF protection + Double Request protection)
    if (!state || !cookieState || state !== cookieState) {
      console.warn("GitHub OAuth: State mismatch. Possible CSRF or double request.");
      // Clear cookie just in case
      res.clearCookie('oauth_state');
      return res.redirect(`${process.env.HOST_URL}/login?error=invalid_state`);
    }

    // Clear state cookie immediately to prevent reuse
    res.clearCookie('oauth_state', {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax'
    });

    // Clear state cookie immediately to prevent reuse
    res.clearCookie('oauth_state', {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax'
    });

    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code
    })

    console.log(params)

    const tokenRes = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params
      }
    )

    console.log(tokenRes)

    const tokenData = await tokenRes.json()

    console.log(tokenData)

    // console.log("STEP 5 token response:", tokenData);

    // res.send("Step 5 works — check server logs");

    if (!tokenData.access_token) {
      console.error("No access token:", tokenData);
      return res.redirect(`${process.env.HOST_URL}/login?error=bad_verification`);
    }

    const accessToken = tokenData.access_token;

    // fetching github user
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const githubUser = await userRes.json();

    const token = jwt.sign(
      {
        githubId: githubUser.id,
        username: githubUser.login
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    console.log("STEP 6 GitHub user:", {
      id: githubUser.id,
      login: githubUser.login,
      name: githubUser.name,
      public_repos: githubUser.public_repos,
    });

    const hostUrl = (process.env.HOST_URL || "").trim();
    if (!hostUrl) {
      console.error("HOST_URL is not defined.");
      return res.status(500).send("Configuration error: HOST_URL missing");
    }

    const finalRedirectUrl = `${hostUrl}/auth/success?token=${token}`;
    console.log("REDIRECTING TO FINAL:", finalRedirectUrl);

    // redirecting to frontend
    return res.redirect(finalRedirectUrl);


  }
  catch (err) {
    console.error("GitHub OAuth error:", err);
    res.redirect(`${process.env.HOST_URL}/login?error=server_error`);
  }
})

module.exports = router