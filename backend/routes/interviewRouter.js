const express = require("express");
const inerViewControllers = require("../controller/interViewController");
const authMiddleware = require("../middleware/authMiddleware");

const interviewRouter = express.Router();
interviewRouter.post("/start",authMiddleware, inerViewControllers.details);

module.exports = interviewRouter;