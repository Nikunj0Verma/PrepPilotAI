const express = require("express");
const multer = require("multer");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});
const resumeController = require("../controller/resumeController");
const authMiddleware = require("../middleware/authMiddleware");

const resumeRouter = express.Router();
resumeRouter.post("/analyze", authMiddleware, upload.single("resume"), resumeController.details);
resumeRouter.get("/analyze/:id", authMiddleware, resumeController.getdetails);
resumeRouter.get("/my-resumes", authMiddleware, resumeController.getAllResumes);
resumeRouter.delete("/my-resumes/:id", authMiddleware, resumeController.deleteResume);


module.exports = resumeRouter; 