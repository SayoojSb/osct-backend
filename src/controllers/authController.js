const authService = require("../services/authService");
const generateToken = require("../utils/generateToken");

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const result = await authService.registerUser(
      username,
      email,
      password
    );

    if (result.error)
      return res.status(400).json({ message: result.error });

    res.status(201).json({ message: result.message });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const result = await authService.loginUser(email, password);

    if (result.error)
      return res.status(400).json({ message: result.error });

    const token = generateToken(result.user._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: result.user._id,
        username: result.user.username,
        email: result.user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
