const mongoose = require("mongoose");
console.log("Loaded MONGO_URL =", process.env.MONGO_URL);

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URL, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log("MongoDB connected");
    }
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

module.exports = connectDB;
