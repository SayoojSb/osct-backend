const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: function () {
        return !this.githubId;
      },
    },

    password: {
      type: String,
      required: function () {
        return !this.githubId;
      },
    },

    githubId: {
      type: String,
      unique: true,
      sparse: true,
    },

    username: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
