const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()

router.get("/github", (req, res) => {
    const redirectUrl =
      "https://github.com/login/oauth/authorize" +
      `?client_id=${process.env.GITHUB_CLIENT_ID}` +
      `&scope=read:user`;
  
    res.redirect(redirectUrl);
  });
  

router.get('/github/callback', async(req,res)=>{
    try{
        const {code} = req?.query;
        console.log(req.query)
        if (!code) {
            return res.status(400).send("No code received");
          }
      
          // IMPORTANT: stop accidental reuse
          if (req.session?.githubUsed) {
            return res.status(400).send("OAuth already processed");
          }
        const params = new URLSearchParams({
            client_id : process.env.GITHUB_CLIENT_ID,
            client_secret : process.env.GITHUB_CLIENT_SECRET,
            code
        })

        const tokenRes = await fetch(
            "https://github.com/login/oauth/access_token",
            {
                method : "POST",
                headers : {
                    Accept : "application/json",
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body : params
            }
        )

        const tokenData = await tokenRes.json()

        // console.log("STEP 5 token response:", tokenData);

        // res.send("Step 5 works — check server logs");

        if (!tokenData.access_token) {
        console.error("No access token:", tokenData);
        return res.status(400).json(tokenData);
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
                githubId : githubUser.id,
                username : githubUser.login
            },
            process.env.JWT_SECRET,
            {expiresIn : '7d'}
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
    catch(err){
        console.error("GitHub OAuth error:", err);
        res.status(500).send("GitHub OAuth failed");
    }
})

module.exports = router