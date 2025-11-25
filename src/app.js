const express = require("express");
const cors = require("cors");
// require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-netlify-site.netlify.app"
    ],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("API running...");
});

app.use("/api/auth", authRoutes);

module.exports = app;
