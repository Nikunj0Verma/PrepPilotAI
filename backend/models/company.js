const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
    {
        name: {
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
        analysis: {
            companyOverview: {
                type: String,
                default: "",
            },
            importantSkills: {
                type: [String],
                default: [],
            },
            technicalTopics: {
                type: [String],
                default: [],
            },
            interviewTopics: {
                type: [String],
                default: [],
            },
            hrPreparation: {
                type: [String],
                default: [],
            },
             preparationRoadmap: [
                {
                    week: {
                        type: Number,
                        required: true,
                    },

                    focus: {
                        type: String,
                        required: true,
                    },

                    topics: {
                        type: [String],
                        default: [],
                    },
                },
            ],
            aiTips: {
                type: [String],
                default: [],
            },
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true, 
        },
    },
    { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);

module.exports = Company;