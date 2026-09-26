# PrepPilot AI

### AI-Powered Career Preparation Platform

PrepPilot AI is a full-stack AI-powered career preparation platform designed to help students and job seekers prepare for technical interviews, analyze their resumes, and plan their preparation for specific companies and roles.

The platform combines modern web technologies with Generative AI to provide personalized interview practice, resume analysis, and company-focused preparation.

---

## Features

### AI Mock Interview
- Configure interviews based on:
  - Interview type
  - Job role
  - Experience level
  - Number of questions
- AI-generated interview questions using Gemini
- Answer questions one by one
- AI-based answer evaluation
- Per-question feedback
- Overall interview score
- Strengths and areas for improvement
- Interview history

### Resume Analyzer
- Upload resume in PDF format
- Select target company and role
- Analyze resume using AI
- Overall resume score
- ATS score
- Role match score
- Skill match analysis
- Present and missing skills
- Strengths and weaknesses
- AI-powered improvement suggestions

### Company Preparation
- Select target company and role
- AI-generated company overview
- Important technical skills
- Technical interview topics
- HR interview preparation
- 4-week preparation roadmap
- AI-generated preparation tips

### Dashboard
- Centralized preparation dashboard
- Recent interviews
- Resume analysis history
- Company preparation history
- Scores and preparation status
- Quick access to previous activities

### User Profile
- Update personal information
- Target role
- Experience level
- Preferred company
- Skills

### Authentication & Security
- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Forgot password functionality
- Email-based password reset
- Secure reset-token handling
- Change password functionality

---

## Tech Stack

### Frontend
- React.js
- JavaScript
- Tailwind CSS
- React Router
- React Toastify

### Backend
- Node.js
- Express.js
- REST APIs
- JWT Authentication
- bcrypt

### Database
- MongoDB
- Mongoose

### AI
- Google Gemini API

### Other Tools
- Git
- GitHub
- Nodemailer
- PDF processing
- Vercel
- Render

---

## How It Works

```text
User
  |
  v
React Frontend
  |
  v
Express.js REST API
  |
  +------------------+
  |                  |
  v                  v
MongoDB          Gemini API
  |                  |
  +--------+---------+
           |
           v
     Personalized
        Results
