const express = require("express");
const inerViewControllers = require("../controller/interviewController");
const authMiddleware = require("../middleware/authMiddleware");

const interviewRouter = express.Router();
interviewRouter.post("/start",authMiddleware, inerViewControllers.details);
interviewRouter.get("/start/:id",authMiddleware, inerViewControllers.getdetails);
interviewRouter.post("/start/:id/answer",authMiddleware, inerViewControllers.submitAnswer);
interviewRouter.get("/my-interviews",authMiddleware, inerViewControllers.getMyInterviews);


module.exports = interviewRouter;