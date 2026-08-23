import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const recentInterviews = [
  {
    type: "Technical Interview",
    score: "86%",
    time: "2 days ago",
    icon: "fa-solid fa-code",
    iconStyle: "bg-blue-100 text-blue-600",
  },
  {
    type: "HR Interview",
    score: "78%",
    time: "5 days ago",
    icon: "fa-solid fa-user-tie",
    iconStyle: "bg-indigo-100 text-indigo-600",
  },
    {
        type: "Behavioural Interview",
        score: "91%",
        time: "8 days ago",
        icon: "fa-solid fa-comments",
        iconStyle: "bg-cyan-100 text-cyan-600",
    },
];

const interviewTypes = [
  {
    id: "technical",
    title: "Technical Interview",
    description: "Test your technical knowledge and problem-solving skills.",
    icon: "fa-solid fa-code",
  },
  {
    id: "hr",
    title: "HR Interview",
    description: "Prepare for common HR and introductory interview questions.",
    icon: "fa-solid fa-user-tie",
  },
  {
    id: "behavioural",
    title: "Behavioural Interview",
    description: "Practice questions about your experiences and soft skills.",
    icon: "fa-solid fa-comments",
  },
];

const InterviewPrep = () => {
  const navigate = useNavigate();

  const [interviewType, setInterviewType] = useState("technical");
  const [jobRole, setJobRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Entry Level");
  const [numberOfQuestions, setNumberOfQuestions] = useState("5");

  const handleSubmit = async (event) => {
  event.preventDefault();

  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      "http://localhost:5000/api/interview/start",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          interviewType,
          jobRole,
          experienceLevel,
          numberOfQuestions,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to start interview");
    }

    console.log("Interview created:", data);

    navigate(`/interview/${data.interview._id}`);
  } catch (error) {
    console.error("Error starting interview:", error);
  }
};

  return (
    <div className="space-y-8 p-4 md:p-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 p-6 text-white shadow-xl shadow-blue-200 md:p-10">
        <div className="relative z-10 max-w-3xl">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur-sm">
            <i className="fa-solid fa-microphone-lines" />
          </div>

          <p className="text-sm font-semibold uppercase tracking-wider text-blue-100">
            AI-powered preparation
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-5xl">
            AI Mock Interview
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50 md:text-base">
            Practice realistic interview questions tailored to your goals. Build
            confidence, improve your answers, and receive intelligent feedback
            to help you perform your best.
          </p>
        </div>

        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 right-24 h-72 w-72 rounded-full bg-cyan-300/10" />
      </section>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-gray-900">
              Choose Interview Type
            </h2>
            <p className="mt-1 text-gray-500">
              Select the type of interview you want to practice.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {interviewTypes.map((type) => {
              const isSelected = interviewType === type.id;

              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setInterviewType(type.id)}
                  className={`rounded-2xl border p-5 text-left transition-all duration-300 hover:-translate-y-1 ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-100"
                      : "border-blue-100 bg-white shadow-sm hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      <i className={type.icon} />
                    </div>

                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-300 bg-white text-transparent"
                      }`}
                    >
                      <i className="fa-solid fa-check text-xs" />
                    </span>
                  </div>

                  <h3 className="mt-4 font-bold text-gray-900">{type.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {type.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-gray-900">
              Interview Configuration
            </h2>
            <p className="mt-1 text-gray-500">
              Customize your interview session according to your needs.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label
                htmlFor="jobRole"
                className="block text-sm font-semibold text-gray-700"
              >
                Job Role
              </label>

              <div className="relative">
                <i className="fa-solid fa-briefcase absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />

                <input
                  id="jobRole"
                  type="text"
                  required
                  value={jobRole}
                  onChange={(event) => setJobRole(event.target.value)}
                  placeholder="e.g. Frontend Developer"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="experienceLevel"
                className="block text-sm font-semibold text-gray-700"
              >
                Experience Level
              </label>

              <div className="relative">
                <i className="fa-solid fa-chart-line absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />

                <select
                  id="experienceLevel"
                  value={experienceLevel}
                  onChange={(event) => setExperienceLevel(event.target.value)}
                  className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                >
                  <option>Entry Level</option>
                  <option>Mid Level</option>
                  <option>Senior Level</option>
                  <option>Lead / Manager</option>
                </select>

                <i className="fa-solid fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="numberOfQuestions"
                className="block text-sm font-semibold text-gray-700"
              >
                Number of Questions
              </label>

              <div className="relative">
                <i className="fa-solid fa-list-ol absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />

                <select
                  id="numberOfQuestions"
                  value={numberOfQuestions}
                  onChange={(event) => setNumberOfQuestions(event.target.value)}
                  className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="5">5 Questions</option>
                  <option value="10">10 Questions</option>
                  <option value="15">15 Questions</option>
                  <option value="20">20 Questions</option>
                </select>

                <i className="fa-solid fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400" />
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl bg-blue-50 p-5 sm:flex-row">
            <div className="flex items-center gap-3 text-sm text-blue-800">
              <i className="fa-solid fa-circle-info text-lg text-blue-600" />
              <span>
                Your AI interview will be personalized to your choices.
              </span>
            </div>

            <button
              type="submit"
              className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-blue-600 px-7 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:scale-105 hover:bg-indigo-600 sm:w-auto"
            >
              Start Interview
              <i className="fa-solid fa-arrow-right ml-3" />
            </button>
          </div>
        </section>
      </form>

      <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Recent Interviews
            </h2>
            <p className="mt-1 text-gray-500">
              Review your previous interview attempts and scores.
            </p>
          </div>

          <span className="w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
            {recentInterviews.length} Attempts
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {recentInterviews.map((interview) => (
            <div
              key={`${interview.type}-${interview.time}`}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg ${interview.iconStyle}`}
                >
                  <i className={interview.icon} />
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    {interview.score}
                  </p>
                  <p className="text-xs font-medium text-gray-500">Score</p>
                </div>
              </div>

              <h3 className="mt-5 font-bold text-gray-900">
                {interview.type}
              </h3>

              <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <i className="fa-regular fa-clock text-blue-500" />
                Attempted {interview.time}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default InterviewPrep;
