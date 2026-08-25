const express = require("express");
const inerViewControllers = require("../controller/interViewController");
const authMiddleware = require("../middleware/authMiddleware");

const interviewRouter = express.Router();
interviewRouter.post("/start",authMiddleware, inerViewControllers.details);
interviewRouter.get("/start/:id",authMiddleware, inerViewControllers.getdetails);
interviewRouter.post("/start/:id/answer",authMiddleware, inerViewControllers.submitAnswer);


module.exports = interviewRouter;