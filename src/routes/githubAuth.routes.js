const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()

router.get("/github", (req, res) => {
  req.session.githubAuthInProgress = true;
  console.log("Initialize Session:", req.sessionID);

  req.session.save((err) => {
    if (err) {
      console.error("Session save error:", err);
      return res.status(500).send("Session error");
    }

    const redirectUrl =
      "https://github.com/login/oauth/authorize" +
      `?client_id=${process.env.GITHUB_CLIENT_ID}` +
      `&scope=read:user`;

    res.redirect(redirectUrl);
  });
});


router.get('/github/callback', async (req, res) => {
  try {
    const { code } = req?.query;

    if (!code) {
      return res.redirect(`${process.env.HOST_URL}/login?error=no_code`);
    }

    console.log("Callback Session ID:", req.sessionID);
    console.log("Callback Session Data:", req.session);

    if (!req.session.githubAuthInProgress) {
      console.warn("GitHub OAuth: State mismatch or double request blocked. Session data:", req.session);
      // Redirect to login instead of showing JSON error
      return res.redirect(`${process.env.HOST_URL}/login?error=double_request`);
    }

    // Clear session immediately to prevent reuse
    delete req.session.githubAuthInProgress;
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

    console.log("REDIRECTING TO:", process.env.HOST_URL);

    // redirecting to frontend
    res.redirect(
      `${process.env.HOST_URL}/auth/success?token=${token}`
    );


  }
  catch (err) {
    console.error("GitHub OAuth error:", err);
    res.redirect(`${process.env.HOST_URL}/login?error=server_error`);
  }
})

module.exports = router