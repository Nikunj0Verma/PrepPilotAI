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
        numberOfQuestions,
        questions:[
          {

            question:
            "Tell me",
            answer:"",
          },
          {

            question:
            "Your name",
            answer:"",
          },
          {

            question:
            "Your hobbies",
            answer:"",
          },
          {

            question:
            "Your education",
            answer:"",
          },
          {

            question:
            "Your strength",
            answer:"",
          }
            
        ]
        
      });
      res.status(201).json({ message: "Interview created successfully", interview });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  getdetails: async (req, res) => {
    try {
      const { id } = req.params;
      const interview = await Interview.findById(id);
      if (!interview) {
        return res.status(404).json({ message: "Interview not found" });
      }
      res.status(200).json({ interview });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  submitAnswer: async (req, res) => {
  try {
    const { answer } = req.body;
    const { questionIndex } = req.body;
    const { id } = req.params;

    const interview = await Interview.findOne({
      _id: id,
      userId: req.user.userId,
    });

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    interview.questions[questionIndex].answer = answer;
if (questionIndex === interview.questions.length - 1) {
  interview.status = "completed";
}
    await interview.save();

    res.status(200).json({
      message: "Answer saved successfully",
      interview,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
},
getMyInterviews: async (req, res) => {
  try {
    const interviews = await Interview.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({ interviews });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
},
};

module.exports = interviewController;