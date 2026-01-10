const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const contributionRoutes = require('./routes/contributionRoutes')
const githubAuthRoutes = require('./routes/githubAuth.routes')

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://open-source-contribution-tracker.netlify.app"
    ],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("API running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/contributions", contributionRoutes)
app.use('/api/auth', githubAuthRoutes)

module.exports = app;
