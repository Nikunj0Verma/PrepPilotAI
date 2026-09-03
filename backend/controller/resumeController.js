const Resume = require("../models/resume");
const { GoogleGenAI } = require("@google/genai");
const { PDFParse } = require("pdf-parse");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const resumeController = {
    details: async (req, res) => {
        try {
            const { company, role, level } = req.body;

            if (!company || !role || !level) {
                return res.status(400).json({
                    message: "Company, role and experience level are required.",
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    message: "Please upload a PDF resume.",
                });
            }
            const parser = new PDFParse({
    data: req.file.buffer,
});

const pdfData = await parser.getText();

const resumeText = pdfData.text?.trim();

await parser.destroy();

            if (!resumeText) {
                return res.status(400).json({
                    message: "Could not extract text from the resume.",
                });
            }

            const prompt = `
You are an expert resume analyzer specializing in technical, HR, and behavioral resumes.

Analyze the following resume specifically for the target opportunity.

Target Company: ${company}
Target Role: ${role}
Experience Level: ${level}

Resume:
${resumeText}

Return ONLY valid JSON using exactly this structure:

{
  "overallScore": 0,
  "atsScore": 0,
  "roleMatch": 0,
  "skillMatch": 0,
  "strengths": [],
  "weaknesses": [],
  "presentSkills": [],
  "missingSkills": [],
  "suggestions": [],
  "summary": ""
}

Rules:

- overallScore must be a number from 0 to 100.
- atsScore must be a number from 0 to 100.
- roleMatch must be a number from 0 to 100.
- skillMatch must be a number from 0 to 100.
- Analyze the resume specifically for the selected company, role and experience level.
- Evaluate the resume's technical skills, projects, education, experience and achievements.
- Evaluate how well the resume matches common requirements for the target role.
- Evaluate ATS-friendly formatting and keyword usage based only on the extracted resume text.
- Identify genuine strengths from the resume.
- Identify weaknesses that could reduce the candidate's chances.
- Identify relevant skills that appear to be missing.
- Provide practical and actionable improvement suggestions.
- Do not invent experience, skills or achievements that are not present in the resume.
- Keep strengths, weaknesses, missingSkills and suggestions concise.
- summary should be a concise overall assessment.
- Return exactly the JSON structure above.
- Do not include markdown.
- Do not include any text outside the JSON.
- Identify the relevant skills that are clearly present in the resume and return them in presentSkills.
- Only include skills that are actually supported by the resume text.
- Do not assume a skill is present merely because it is common for the target role.
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

            const cleanedText = responseText
                .replace(/^```json\s*/i, "")
                .replace(/^```\s*/i, "")
                .replace(/\s*```$/i, "")
                .trim();

            const analysisResult = JSON.parse(cleanedText);

            const resume = await Resume.create({
                userId: req.user.userId,
                companyName: company.trim(),
                role: role.trim(),
                level,
                resumeText,
                analysisResult,
            });

            return res.status(201).json({
                message: "Resume analyzed successfully",
                resume,
                analysis: analysisResult,
            });

        } catch (error) {
            console.error("Resume analysis error:", error);

            return res.status(500).json({
                message: "Failed to analyze resume",
                error: error.message,
            });
        }
    },

    getdetails: async (req, res) => {
        try {
            const resume = await Resume.findOne({
                _id: req.params.id,
                userId: req.user.userId,
            });

            if (!resume) {
                return res.status(404).json({
                    message: "Resume not found",
                });
            }

            return res.status(200).json({
                resume,
            });

        } catch (error) {
            return res.status(500).json({
                message: error.message,
            });
        }
    },
    getAllResumes: async (req, res) => {
        try {
            const resumes = await Resume.find({ userId: req.user.userId });

            return res.status(200).json({
                resumes,
            });
        } catch (error) {
            return res.status(500).json({
                message: error.message,
            });
        }
    },
    deleteResume: async (req, res) => {
        try {
            const resume = await Resume.findOneAndDelete({
                _id: req.params.id,
                userId: req.user.userId,
            });

            if (!resume) {
                return res.status(404).json({
                    message: "Resume not found",
                });
            }

            return res.status(200).json({
                message: "Resume deleted successfully",
            });
        } catch (error) {
            return res.status(500).json({
                message: error.message,
            });
        }
    },
};

module.exports = resumeController;