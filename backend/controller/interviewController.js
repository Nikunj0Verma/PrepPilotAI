const Interview = require("../models/Interview");

const interviewController = {
  details: async (req, res) => {
    try {
      const { interviewType, jobRole, experienceLevel, numberOfQuestions } = req.body;
      const interview = await Interview.create({
        userId: req.user.userId,
        interviewType,
        jobRole,
        experienceLevel,
        numberOfQuestions
      });
      res.status(201).json({ message: "Interview created successfully", interview });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = interviewController;