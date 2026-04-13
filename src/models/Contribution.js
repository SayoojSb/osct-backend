const mongoose = require("mongoose");

const contributionSchema = new mongoose.Schema(
  {
    // Existing fields (UNCHANGED)
    title: { type: String, required: true },
    repoName: { type: String, required: true },
    description: { type: String, required: true },
    prLink: { type: String, required: true },
    status: { type: String, required: true },
    difficulty: { type: String, required: true },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🔽 NEW FIELDS (for GitHub auto-fetch)

    source: {
      type: String,
      enum: ["manual", "github"],
      default: "manual",
    },

    githubPrId: {
      type: Number,
    },

    githubPrNumber: {
      type: Number,
    },
  },
  { timestamps: true }
);

// 🚫 Prevent duplicate GitHub PR imports per user
// Only enforce uniqueness when githubPrId is NOT null
contributionSchema.index(
  { createdBy: 1, githubPrId: 1 },
  { 
    unique: true, 
    sparse: true,
    partialFilterExpression: { githubPrId: { $ne: null } }
  }
);

module.exports = mongoose.model("Contribution", contributionSchema);
