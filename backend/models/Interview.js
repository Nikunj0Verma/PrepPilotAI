const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    interviewType: {
      type: String,
      required: true,
    },
    jobRole: {
      type: String,
      required: true,
    },
    experienceLevel: {
      type: String,
      required: true,
    },
    numberOfQuestions: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "started",
    },
    questions: [
      {
        question: {
          type: String,
          required: true,
        },

        answer: {
          type: String,
          default: "",
        },

        evaluation: {
          overallScore: {
            type: Number,
            default: null,
          },

          communication: {
            type: Number,
            default: null,
          },

          technicalDepth: {
            type: Number,
            default: null,
          },

          relevance: {
            type: Number,
            default: null,
          },

          feedback: {
            type: String,
            default: "",
          },
        },
      },
    ],
    evaluation: {
      overallScore: {
        type: Number,
        default: null,
      },

      performance: {
        type: String,
        default: "",
      },

      summary: {
        type: String,
        default: "",
      },

      strengths: {
        type: [String],
        default: [],
      },

      areasToImprove: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Interview", interviewSchema);
