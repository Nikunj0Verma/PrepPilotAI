const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phnumber: {
      type: String,
      default: "",
      trim: true,
    },
    targetrole: {
      type: String,
      default: "",
      trim: true,
    },
    experiencelevel: {
      type: String,
      default: "",
      trim: true,
    },
    preferredcompany: {
      type: String,
      default: "",
      trim: true,
    },
    skills: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);