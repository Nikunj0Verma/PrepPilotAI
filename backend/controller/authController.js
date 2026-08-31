const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = {
          registerUser: async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body || {};

      if (!firstName || !lastName || !email || !password) {
       return res.status(400).json({ message: "All fields are required" });
      }

      const normalizedEmail = email.toLowerCase().trim();

      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        password: hashedPassword,
      });

      return res.status(201).json({ message: "User created successfully", user: { _id: newUser._id, email: newUser.email } });
    } catch (error) {
      console.error("registerUser error:", error);
      return res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  },

    loginUser: async (req, res) => {
    try {
      const { email, password } = req.body || {};
      const user = await User.findOne({ email: email?.toLowerCase().trim() });

      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.error("loginUser error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
    getCurrentUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = authController;
