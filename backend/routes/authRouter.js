const express = require("express");
const { registerUser } = require("../controller/authController");
const authController = require("../controller/authController");

const authRouter = express.Router();
authRouter.post("/register", authController.registerUser);

module.exports = authRouter;