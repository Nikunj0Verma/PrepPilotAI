const Interview = require("../models/Interview");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

console.log("Gemini API key loaded:", !!process.env.GEMINI_API_KEY);

const interviewController = {
  details: async (req, res) => {
    try {
      const { interviewType, jobRole, experienceLevel, numberOfQuestions } =
        req.body;

        
        
        const interview = await Interview.create({
          userId: req.user.userId,
          interviewType,
          jobRole,
          experienceLevel,
          numberOfQuestions,
          questions: [],
        });

 const prompt = `
You are an expert interviewer specializing in technical, HR, and behavioural interviews.

Generate interview questions for the following interview:

Interview Type: ${interview.interviewType}
Job Role: ${interview.jobRole}
Experience Level: ${interview.experienceLevel}
Number of Questions: ${interview.numberOfQuestions}

Return ONLY valid JSON using exactly this structure:

{
  "questions": [
    {
      "question": "Question text",
      "answer": ""
    }
  ]
}

Rules:
- Generate exactly ${interview.numberOfQuestions} questions.
- Questions must be relevant to the selected interview type.
- Questions must be relevant to the selected job role.
- Questions must match the candidate's experience level.
- Questions should progressively assess the candidate's knowledge and suitability.
- Each question must be different and should not repeat another question.
- For technical interviews, focus on technologies, concepts, problem-solving, and role-specific knowledge.
- For HR interviews, focus on professional experience, teamwork, communication, motivation, and workplace situations.
- For behavioural interviews, focus on real-world situations, decision-making, teamwork, leadership, and problem-solving.
- Do not generate answers.
- The answer field must always be an empty string.
- Do not generate an evaluation object.
- Do not include question numbers or indexes.
- Return ONLY the JSON object. Do not include markdown, explanations, or extra text.
`;


      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });
            const generatedData = JSON.parse(response.text);

      interview.questions = generatedData.questions;

      await interview.save();
      res
        .status(201)
        .json({ message: "Interview created successfully", interview });
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
  getResult: async (req, res) => {
    try {
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

      res.status(200).json({
        interview,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  },

  evaluateInterview: async (req, res) => {
    try {
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

      const interviewText = interview.questions
        .map(
          (item, index) => `
Question ${index + 1}:
${item.question}

Candidate Answer:
${item.answer?.trim() || "No answer provided"}
`,
        )
        .join("\n");

      const prompt = `
You are an expert, technical, hr and behavioural interviewer.

Evaluate this interview.

Interview Type: ${interview.interviewType}
Job Role: ${interview.jobRole}
Experience Level: ${interview.experienceLevel}

${interviewText}

Return ONLY valid JSON using exactly this structure:

{
  "overallScore": 0,
  "performance": "Excellent",
  "summary": "Short overall feedback",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "areasToImprove": ["area 1", "area 2", "area 3"],
  "questionEvaluations": [
    {
      "questionNumber": 1,
      "overallScore": 0, 
      "communication": 0,
      "technicalDepth": 0,
      "relevance": 0,
      "feedback": "Detailed feedback"
    }
  ]
}

Rules:
- overallScore must be from 0 to 100.
- All question scores must be from 0 to 10.
- Include one question evaluation for every question.
- Do not include Markdown or code fences.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText =
        typeof response.text === "function" ? response.text() : response.text;

      const cleanedText = responseText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      const evaluation = JSON.parse(cleanedText);

      interview.evaluation = {
        overallScore: Number(evaluation.overallScore) || 0,
        performance: evaluation.performance || "Needs Improvement",
        summary: evaluation.summary || "",
        strengths: Array.isArray(evaluation.strengths)
          ? evaluation.strengths
          : [],
        areasToImprove: Array.isArray(evaluation.areasToImprove)
          ? evaluation.areasToImprove
          : [],
      };

      const questionEvaluations = evaluation.questionEvaluations || [];

      questionEvaluations.forEach((item) => {
        const questionIndex = Number(item.questionNumber) - 1;
        const question = interview.questions[questionIndex];

        if (!question) return;

        question.evaluation = {
          overallScore: Math.max(
            0,
            Math.min(10, Number(item.overallScore) || 0),
          ),
          communication: Math.max(
            0,
            Math.min(10, Number(item.communication) || 0),
          ),
          technicalDepth: Math.max(
            0,
            Math.min(10, Number(item.technicalDepth) || 0),
          ),
          relevance: Math.max(0, Math.min(10, Number(item.relevance) || 0)),
          feedback: item.feedback || "",
        };
      });

      interview.status = "completed";
      await interview.save();

      return res.status(200).json({
        message: "Interview evaluated successfully",
        interview,
        evaluation: interview.evaluation,
      });
    } catch (error) {
      console.error("Evaluation error:", error);

      return res.status(500).json({
        message: "Failed to evaluate interview",
        error: error.message,
      });
    }
  },
  deleteInterview: async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await Interview.findOneAndDelete({
      _id: id,
      userId: req.user.userId,
    });

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    res.status(200).json({
      message: "Interview deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
},
};

module.exports = interviewController;
