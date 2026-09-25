const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendResetEmail = require("../utils/sendEmail");

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

      return res
        .status(201)
        .json({
          message: "User created successfully",
          user: { _id: newUser._id, email: newUser.email },
        });
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
  userProfile: async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phnumber,
        targetrole,
        experiencelevel,
        preferredcompany,
        skills,
      } = req.body || {};

      if (!firstName || !lastName || !email) {
        return res.status(400).json({
          message: "First name, last name, and email are required",
        });
      }

      const normalizedEmail = email.toLowerCase().trim();

      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: req.user.userId },
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Email is already in use",
        });
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user.userId,
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: normalizedEmail,
          phnumber: phnumber?.trim() || "",
          targetrole: targetrole?.trim() || "",
          experiencelevel: experiencelevel?.trim() || "",
          preferredcompany: preferredcompany?.trim() || "",
          skills: Array.isArray(skills)
            ? skills.join(", ")
            : skills?.trim() || "",
        },
        {
          new: true,
          runValidators: true,
        },
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Update profile error:", error);
      return res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  },
  forgotpassword: async (req, res) => {
    try {
      const { Enterredemail } = req.body || {};
      if (!Enterredemail) {
        return res.status(400).json({
          message: "Please enter your email!!",
        });
      }
      const normalizedEmail = Enterredemail.toLowerCase().trim();

      const existingUser = await User.findOne({
        email: normalizedEmail,
      });

      if (!existingUser) {
        return res.status(200).json({
          message:
            "If an account exists with this email, a reset link has been sent.",
        });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      await User.findByIdAndUpdate(existingUser._id, {
            resetPasswordToken: hashedToken,
            resetPasswordExpires: new Date(
                Date.now() + 15 * 60 * 1000
            ),
        });
      const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
        console.log(resetUrl);
      await sendResetEmail(existingUser.email, resetUrl);

      return res.status(200).json({
        message:
          "If an account exists with this email, a reset link has been sent.",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      return res.status(500).json({
        message: "Server error",
      });
    }
  },

  resetpassword: async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Reset link is invalid or has expired"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        return res.status(200).json({
            message: "Password reset successfully"
        });

    } catch (error) {
        console.error("Reset password error:", error);

        return res.status(500).json({
            message: "Unable to reset password"
        });
    }
},
changePassword: async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
    });

  } catch (error) {
    console.error("Change password error:", error);

    return res.status(500).json({
      message: "Unable to change password",
    });
  }
},
};

module.exports = authController;
