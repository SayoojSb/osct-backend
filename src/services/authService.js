const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.registerUser = async (username, email, password) => {

  const existing = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existing) {
    return {
      error:
        existing.email === email
          ? "Email already registered"
          : "Username already taken",
    };
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashed });
  await user.save();

  return { message: "User created successfully"};
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) return { error: "Invalid credentials" };

  const match = await bcrypt.compare(password, user.password);
  if (!match) return { error: "Invalid credentials" };

  return { user };
};
