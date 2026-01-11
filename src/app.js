const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const authRoutes = require("./routes/authRoutes");
const contributionRoutes = require('./routes/contributionRoutes')
const githubAuthRoutes = require('./routes/githubAuth.routes')

const app = express();

// Trust proxy is required for secure cookies on platforms like Render/Heroku
app.set("trust proxy", 1);

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

app.use(
  session({
    secret: process.env.SESSION_SECRET || "osct_secret_key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL, // Ensure this env var fits your setup
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
      maxAge: 1000 * 60 * 5, // 5 minutes
    },
  })
);

app.get("/", (req, res) => {
  res.send("API running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/contributions", contributionRoutes)
app.use('/api/auth', githubAuthRoutes)

module.exports = app;
