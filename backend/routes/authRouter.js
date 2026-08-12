const express = require("express");
const { registerUser,loginUser,getCurrentUser } = require("../controller/authController");
const authController = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");

const authRouter = express.Router();
authRouter.post("/register", authController.registerUser);
authRouter.post("/login", authController.loginUser);
authRouter.get("/me", authMiddleware, authController.getCurrentUser);

module.exports = authRouter;