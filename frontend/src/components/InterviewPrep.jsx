import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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

const interviewConfig = {
  technical: {
    icon: "fa-solid fa-code",
    iconStyle: "bg-blue-100 text-blue-600",
    label: "Technical Interview",
  },
  hr: {
    icon: "fa-solid fa-user-tie",
    iconStyle: "bg-indigo-100 text-indigo-600",
    label: "HR Interview",
  },
  behavioural: {
    icon: "fa-solid fa-comments",
    iconStyle: "bg-cyan-100 text-cyan-600",
    label: "Behavioural Interview",
  },
  default: {
    icon: "fa-solid fa-clipboard-question",
    iconStyle: "bg-slate-100 text-slate-600",
    label: "Interview",
  },
};

const InterviewPrep = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [recentInterviews, setRecentInterviews] = useState([]);
  const [interviewType, setInterviewType] = useState("technical");
  const [jobRole, setJobRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Entry Level");
  const [numberOfQuestions, setNumberOfQuestions] = useState("5");
  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState("");

  useEffect(() => {
    document.body.style.overflow = isStarting ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isStarting]);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(
          "http://localhost:5000/api/interview/my-interviews",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch interviews");
        }

        const mappedInterviews = (data.interviews || [])
          .filter((item) => item && item.interviewType)
          .sort(
            (a, b) =>
              new Date(b.createdAt || b.updatedAt) -
              new Date(a.createdAt || a.updatedAt)
          )
          .slice(0, 3)
          .map((item) => {
            const typeKey = (item.interviewType || "default").toLowerCase();
            const config = interviewConfig[typeKey] || interviewConfig.default;

            const scoreValue =
              item?.evaluation?.overallScore !== undefined
                ? Number(item.evaluation.overallScore)
                : Number(item?.score || 0);

            return {
              ...item,
              _id: item._id || `${item.interviewType}-${item.createdAt}`,
              icon: config.icon,
              iconStyle: config.iconStyle,
              label: config.label,
              score: Number.isFinite(scoreValue) ? scoreValue : 0,
            };
          });

        setRecentInterviews(mappedInterviews);
      } catch (error) {
        console.error("Error fetching interviews:", error);
        setRecentInterviews([]);
      }
    };

    fetchInterviews();
  }, []);

  const formatTime = (dateValue) => {
    if (!dateValue) return "Recently";

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "Recently";

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    }

    const days = Math.floor(hours / 24);
    if (days < 30) {
      return `${days} day${days === 1 ? "" : "s"} ago`;
    }

    const months = Math.floor(days / 30);
    return `${months} month${months === 1 ? "" : "s"} ago`;
  };

  const capitalizeFirstLetter = (str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isStarting) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setStartError("Please log in before starting an interview.");
      return;
    }

    if (!jobRole.trim()) {
      setStartError("Please enter a job role.");
      return;
    }

    try {
      setIsStarting(true);
      setStartError("");

      const response = await fetch("http://localhost:5000/api/interview/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          interviewType,
          jobRole: jobRole.trim(),
          experienceLevel,
          numberOfQuestions: Number(numberOfQuestions),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to start interview");
      }

      const interviewId = data.interview?._id || data.interview?.id;

      if (!interviewId) {
        throw new Error("Interview ID was not returned by the server.");
      }

      setIsStarting(false);

      navigate(`/interview/${interviewId}`, {
        state: {
          backgroundLocation: location,
        },
      });
    } catch (error) {
      console.error("Error starting interview:", error);

      setStartError(
        error.message || "Unable to generate questions. Please try again."
      );

      setIsStarting(false);
    }
  };

  return (
    <>
      <div
        inert={isStarting ? "" : undefined}
        aria-busy={isStarting}
        className={`space-y-8 p-4 md:p-8 ${
          isStarting ? "pointer-events-none select-none blur-[1px]" : ""
        }`}
      >
        <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-[#0f172a] via-[#1d4ed8] to-[#22d3ee] p-6 text-white shadow-[0_18px_45px_rgba(29,78,216,0.28)] md:p-8">
          <div className="relative z-10 max-w-3xl">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl backdrop-blur-sm ring-1 ring-white/20">
              <i className="fa-solid fa-microphone-lines" />
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
              AI-powered preparation
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
              AI Mock Interview
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50 md:text-base">
              Practice realistic interview questions tailored to your goals.
              Build confidence, improve your answers, and get smart feedback
              that helps you perform at your best.
            </p>
          </div>

          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-28 right-12 h-72 w-72 rounded-full bg-cyan-300/10" />
        </section>

        {startError && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700 shadow-sm">
            <i className="fa-solid fa-circle-exclamation" />
            <span>{startError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <section>
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-slate-900">
                Choose Interview Type
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Select the interview style you want to practice.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {interviewTypes.map((type) => {
                const isSelected = interviewType === type.id;

                return (
                  <button
                    key={type.id}
                    type="button"
                    disabled={isStarting}
                    onClick={() => setInterviewType(type.id)}
                    className={`rounded-[24px] border p-5 text-left transition-all duration-300 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60 ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 shadow-[0_18px_40px_rgba(59,130,246,0.12)]"
                        : "border-slate-200 bg-white shadow-[0_10px_25px_rgba(15,23,42,0.04)] hover:border-blue-300 hover:shadow-[0_16px_35px_rgba(59,130,246,0.10)]"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
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
                        <i className="fa-solid fa-check text-[10px]" />
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-slate-900">
                      {type.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {type.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)] md:p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-slate-900">
                Interview Configuration
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Customize your session based on the role and level you want to
                practice.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <label
                  htmlFor="jobRole"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Job Role
                </label>

                <div className="relative">
                  <i className="fa-solid fa-briefcase absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />

                  <input
                    id="jobRole"
                    type="text"
                    required
                    disabled={isStarting}
                    value={jobRole}
                    onChange={(event) => setJobRole(event.target.value)}
                    placeholder="e.g. Frontend Developer"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="experienceLevel"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Experience Level
                </label>

                <div className="relative">
                  <i className="fa-solid fa-chart-line absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />

                  <select
                    id="experienceLevel"
                    disabled={isStarting}
                    value={experienceLevel}
                    onChange={(event) => setExperienceLevel(event.target.value)}
                    className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option>Entry Level</option>
                    <option>Mid Level</option>
                    <option>Senior Level</option>
                    <option>Lead / Manager</option>
                  </select>

                  <i className="fa-solid fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="numberOfQuestions"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Number of Questions
                </label>

                <div className="relative">
                  <i className="fa-solid fa-list-ol absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />

                  <select
                    id="numberOfQuestions"
                    disabled={isStarting}
                    value={numberOfQuestions}
                    onChange={(event) => setNumberOfQuestions(event.target.value)}
                    className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="5">5 Questions</option>
                    <option value="10">10 Questions</option>
                    <option value="15">15 Questions</option>
                    <option value="20">20 Questions</option>
                  </select>

                  <i className="fa-solid fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-[22px] bg-blue-50 p-5 sm:flex-row">
              <div className="flex items-center gap-3 text-sm text-blue-800">
                <i className="fa-solid fa-circle-info text-lg text-blue-600" />
                <span>
                  Your AI interview will be personalized to your selected role.
                </span>
              </div>

              <button
                type="submit"
                disabled={isStarting}
                className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-blue-600 px-7 py-3 font-semibold text-white shadow-[0_12px_25px_rgba(59,130,246,0.35)] transition hover:scale-[1.02] hover:bg-indigo-600 disabled:cursor-not-allowed disabled:scale-100 disabled:bg-blue-400 sm:w-auto"
              >
                {isStarting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-3" />
                    Generating Questions...
                  </>
                ) : (
                  <>
                    Start Interview
                    <i className="fa-solid fa-arrow-right ml-3" />
                  </>
                )}
              </button>
            </div>
          </section>
        </form>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)] md:p-8">
          <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Recent Interviews
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review your previous attempts and performance.
              </p>
            </div>

            <span className="w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
              {recentInterviews.length} Attempts
            </span>
          </div>

          {recentInterviews.length === 0 ? (
            <div className="rounded-[22px] border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
              No interview history found yet.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {recentInterviews.map((interview) => (
                <div
                  key={interview._id}
                  className="rounded-[22px] border border-slate-100 bg-slate-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg ${interview.iconStyle}`}
                    >
                      <i className={interview.icon} />
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {interview.score}%
                      </p>
                      <p className="text-xs font-medium text-slate-500">Score</p>
                    </div>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {capitalizeFirstLetter(interview.label)}
                  </h3>

                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <i className="fa-regular fa-clock text-blue-500" />
                    Attempted{" "}
                    {formatTime(
                      interview.createdAt || interview.updatedAt || interview.date
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {isStarting && <GeneratingOverlay />}
    </>
  );
};

const GeneratingOverlay = () => (
  <div
    role="dialog"
    aria-modal="true"
    aria-label="Generating interview questions"
    className="fixed inset-0 z-[9999] flex cursor-wait items-center justify-center bg-slate-950/85 p-5 backdrop-blur-md"
  >
    <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#0b1238] p-8 text-center text-white shadow-2xl">
      <i className="fa-solid fa-spinner fa-spin text-4xl text-cyan-300" />

      <h2 className="mt-6 text-2xl font-extrabold">Preparing Your Interview</h2>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        Gemini is generating your personalized interview questions. Please
        wait...
      </p>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-700">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
      </div>

      <p className="mt-3 text-xs text-slate-500">
        This may take a few seconds...
      </p>
    </div>
  </div>
);

export default InterviewPrep;