const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    resumeText: {
      type: String,
      required: true,
    },
    analysisResult: {
    overallScore: {
        type: Number,
        default: 0,
    },
    atsScore: {
        type: Number,
        default: 0,
    },
    roleMatch: {
        type: Number,
        default: 0,
    },
    skillMatch: {
        type: Number,
        default: 0,
    },
    strengths: {
        type: [String],
        default: [],
    },
    weaknesses: {
        type: [String],
        default: [],
    },
    presentSkills: {
        type: [String],
        default: [],
    },
    missingSkills: {
        type: [String],
        default: [],
    },
    suggestions: {
        type: [String],
        default: [],
    },
    summary: {
        type: String,
        default: "",
    },
},
  },
  {
    timestamps: true,
  },
);

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;
