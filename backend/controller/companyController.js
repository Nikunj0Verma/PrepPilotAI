const Company=require("../models/company");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const CompanyController = {
  details: async (req, res) => {
  try {
    const { name, role, level } = req.body;

    const company = await Company.create({
      userId: req.user.userId,
      name,
      role,
      level,
    });

    res.status(201).json(company);
  } catch (error) {
    console.error("Company details error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
},
    analysis: async (req, res) => {
    try {
        const { id } = req.params;
        const companyAnalysis = await Company.findById(id);

if (!companyAnalysis) {
  return res.status(404).json({
    message: "Company preparation not found",
  });
}
        const prompt = `
You are an expert career advisor and interview preparation specialist.

Create a personalized interview preparation guide for the candidate based on the following target:

Company: ${companyAnalysis.name}
Job Role: ${companyAnalysis.role}
Experience Level: ${companyAnalysis.level}

Your task is to analyze the target company, role, and experience level and create a practical preparation plan that helps the candidate prepare for technical, interview, and HR rounds.

Return ONLY valid JSON using exactly this structure:

{
  "companyOverview": "",
  "importantSkills": [],
  "technicalTopics": [],
  "interviewTopics": [],
  "hrPreparation": [],
  "preparationRoadmap": [
    {
      "week": 1,
      "focus": "",
      "topics": []
    },
    {
      "week": 2,
      "focus": "",
      "topics": []
    },
    {
      "week": 3,
      "focus": "",
      "topics": []
    },
    {
      "week": 4,
      "focus": "",
      "topics": []
    }
  ],
  "aiTips": []
}

Rules:

- companyOverview should provide a concise and useful overview of the company relevant to interview preparation.
- importantSkills should contain the most important technical and professional skills for the selected role and experience level.
- technicalTopics should contain the key technical subjects the candidate should study for the selected role.
- InterviewTopics should contain important interview areas and topics the candidate should prepare for.
- HRPreparation should contain important HR and behavioral preparation areas or questions.
- preparationRoadmap must contain exactly 4 weeks.
- Each week must contain:
  - week: the week number.
  - focus: the main preparation objective for that week.
  - topics: a list of specific subjects or activities to study.
- AITips should contain practical, actionable advice that can improve the candidate's interview preparation and performance.
- Tailor all recommendations to the selected company, role, and experience level.
- Prioritize the most relevant topics instead of producing a generic list.
- Do not claim that any particular interview question is guaranteed to be asked.
- Do not invent confidential, internal, or unverifiable company information.
- Do not assume the candidate has skills that were not specified.
- Keep the content concise, practical, and suitable for a student or job candidate.
- Use plain text inside all JSON strings.
- All arrays must contain strings except preparationRoadmap, which must contain the specified objects.
- Return valid JSON only.
- Do not use markdown.
- Do not include any explanation before or after the JSON.
- ALL fields in the JSON structure are mandatory.
- Never omit any field, even if there is limited information.
- interviewTopics MUST contain relevant interview topics.
- hrPreparation MUST contain relevant HR and behavioral preparation points.
- aiTips MUST contain practical and actionable preparation tips.
- importantSkills, technicalTopics, interviewTopics, hrPreparation, and aiTips MUST always be arrays of strings.
- preparationRoadmap MUST always contain exactly 4 objects.
- Each roadmap object MUST contain week, focus, and topics.
- Do not return null for any field.
- Do not rename any field.
- Return all fields exactly as specified.
`;

const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const responseText =
  typeof response.text === "function"
    ? response.text()
    : response.text;

const generatedData = JSON.parse(responseText);
  companyAnalysis.analysis = generatedData;
  await companyAnalysis.save();
  res.json(companyAnalysis);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  },

    getdetails: async (req, res) => {
  try {
    const company = await Company.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!company) {
      return res.status(404).json({
        message: "Company preparation not found",
      });
    }

    return res.status(200).json({
      company,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
},
  getAllcompanies: async (req, res) => {
    try {
        const companies = await Company.find({ userId: req.user.userId });
        res.json(companies);
    } catch (error) {   
        res.status(500).json({ message: error.message });
    }
  },
  deleteCompany: async (req, res) => {
    try {
        const { id } = req.params;
        const company = await Company.findOneAndDelete({ _id: id, userId: req.user.userId });
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        res.json({ message: "Company deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    },
};

module.exports = CompanyController;