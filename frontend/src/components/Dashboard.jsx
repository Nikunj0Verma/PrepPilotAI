import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const quickAccessItems = [
  {
    title: "AI Mock Interview",
    description:
      "Practice realistic interviews and receive instant AI feedback.",
    button: "Start Interview",
    href: "/interview-prep",
    icon: "fa-solid fa-microphone",
    accent: "from-sky-500 to-cyan-500",
  },
  {
    title: "Resume Analyzer",
    description:
      "Improve your resume with personalized analysis and suggestions.",
    button: "Analyze Resume",
    href: "/resume-analyzer",
    icon: "fa-solid fa-file-lines",
    accent: "from-violet-500 to-indigo-500",
  },
  {
    title: "Company Preparation",
    description:
      "Explore company insights and prepare for your dream organization.",
    button: "Explore Companies",
    href: "/company-prep",
    icon: "fa-solid fa-building",
    accent: "from-blue-500 to-indigo-500",
  },
  {
    title: "Progress Tracking",
    description:
      "Track your preparation journey, scores, and improvements.",
    button: "View Progress",
    href: "/progress",
    icon: "fa-solid fa-chart-line",
    accent: "from-emerald-500 to-teal-500",
  },
];

const getInterviewType = (interview) => {
  const type = interview.interviewType || interview.type || "Technical";

  return type
    .toString()
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getInterviewIcon = (type) => {
  const normalizedType = type.toLowerCase();

  if (normalizedType.includes("hr")) {
    return {
      icon: "fa-solid fa-user-tie",
      color: "bg-indigo-100 text-indigo-600",
    };
  }

  if (
    normalizedType.includes("behaviour") ||
    normalizedType.includes("behavior")
  ) {
    return {
      icon: "fa-solid fa-comments",
      color: "bg-cyan-100 text-cyan-600",
    };
  }

  return {
    icon: "fa-solid fa-code",
    color: "bg-blue-100 text-blue-600",
  };
};

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

const getScore = (interview) => {
  const score = interview?.evaluation?.overallScore;

  if (score === undefined || score === null || score === "") {
    return "Completed";
  }

  const numericScore = Number(score);

  if (Number.isNaN(numericScore)) {
    return score;
  }

  return `${Math.round(numericScore)}/100`;
};

const getResumeScore = (resume) => {
  const score =
    resume?.analysisResult?.overallScore ??
    resume?.analysis?.overallScore ??
    resume?.overallScore;

  if (score === undefined || score === null || score === "") {
    return "Pending";
  }

  const numericScore = Number(score);

  if (Number.isNaN(numericScore)) {
    return score;
  }

  return `${Math.round(numericScore)}/100`;
};

const isStarted = (interview) =>
  String(interview?.status || "").toLowerCase() === "started";

const isCompleted = (interview) => {
  const status = String(interview?.status || "").toLowerCase();
  return status === "completed";
};

const getTotalQuestions = (interview) => {
  if (Array.isArray(interview.questions)) {
    return interview.questions.length;
  }

  return Number(
    interview.totalQuestions ||
      interview.numberOfQuestions ||
      interview.questionCount ||
      0
  );
};

const getAttemptedQuestions = (interview) => {
  if (!Array.isArray(interview.questions)) {
    return 0;
  }

  return interview.questions.filter(
    (question) =>
      typeof question.answer === "string" &&
      question.answer.trim().length > 0
  ).length;
};

const Dashboard = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loadingInterviews, setLoadingInterviews] = useState(true);
  const [resumes, setResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const token = localStorage.getItem("token");

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

        setInterviews(data.interviews || []);
      } catch (error) {
        console.error("Error fetching interviews:", error);
      } finally {
        setLoadingInterviews(false);
      }
    };

    fetchInterviews();
  }, []);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/resume/my-resumes",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch resumes");
        }

        setResumes(data.resumes || []);
      } catch (error) {
        console.error("Error fetching resumes:", error);
      } finally {
        setLoadingResumes(false);
      }
    };

    fetchResumes();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setUserName(data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest("[data-menu-container]")) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleViewResult = (interviewId) => {
    setOpenMenuId(null);
    navigate(`/interview/${interviewId}/result`);
  };

  const handleResumeInterview = (interviewId) => {
    setOpenMenuId(null);
    navigate(`/interview/${interviewId}`);
  };

  const handleViewResumeResult = (resumeId) => {
    setOpenMenuId(null);
    navigate(`/resume/analyze/${resumeId}`);
  };

  const handleDeleteInterview = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this interview?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/resume/my-resumes/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete resume");
      }

      setResumes((previousResumes) =>
        previousResumes.filter(
          (resume) => (resume._id || resume.id) !== id
        )
      );

      setOpenMenuId(null);
    } catch (error) {
      console.error("Delete resume error:", error);
      alert(error.message);
    }
  };

  const handleDeleteResume = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume analysis?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/resume/my-resumes/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete resume");
      }

      setResumes((previousResumes) =>
        previousResumes.filter(
          (resume) => (resume._id || resume.id) !== id
        )
      );

      setOpenMenuId(null);
    } catch (error) {
      console.error("Delete resume error:", error);
      alert(error.message);
    }
  };

  const statCards = [
    {
      label: "Interviews",
      value: `${interviews.length}`,
      trend:
        interviews.length > 0
          ? `${interviews.filter(isCompleted).length} completed`
          : "No interviews yet",
      icon: "fa-solid fa-briefcase",
      color: "bg-sky-100 text-sky-600",
    },
    {
      label: "Avg Score",
      value:
        interviews.length > 0
          ? `${Math.round(
              interviews.reduce(
                (sum, interview) =>
                  sum + Number(interview.evaluation?.overallScore || 0),
                0
              ) / interviews.length
            )}%`
          : "N/A",
      trend:
        interviews.length > 0 ? "Keep improving" : "Start your first interview!",
      icon: "fa-solid fa-chart-column",
      color: "bg-violet-100 text-violet-600",
    },
    {
      label: "Streak",
      value:
        interviews.length > 0
          ? `${interviews.filter(isCompleted).length} days`
          : "0 days",
      trend:
        interviews.length > 0 ? "Keep it up" : "Start your streak!",
      icon: "fa-solid fa-fire",
      color: "bg-amber-100 text-amber-600",
    },
  ];

  const isLoading = loadingInterviews || loadingResumes;
  const hasNoActivity =
    !loadingInterviews &&
    !loadingResumes &&
    interviews.length === 0 &&
    resumes.length === 0;

  return (
    <div className="min-h-screen bg-[#eef4ff] text-slate-800">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-5 md:px-6 md:py-8">
        <section className="overflow-hidden rounded-[30px] bg-gradient-to-r from-[#0f172a] via-[#1d4ed8] to-[#22d3ee] p-5 text-white shadow-[0_16px_40px_rgba(29,78,216,0.3)] md:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100">
                Welcome back,
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
                {userName?.firstName || "there"}!
              </h1>

              <p className="mt-2 text-sm text-blue-50 md:text-base">
                Ready to improve your interview performance today?
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/interview-prep")}
              className="inline-flex cursor-pointer items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-sky-50"
            >
              Start Interview
              <i className="fa-solid fa-arrow-right ml-3" />
            </button>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="cursor-default rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_10px_25px_rgba(15,23,42,0.04)]"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.color}`}
                >
                  <i className={card.icon} />
                </div>

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
                  {card.trend}
                </span>
              </div>

              <div className="mt-4">
                <p className="text-sm text-slate-500">{card.label}</p>

                <h3 className="mt-1 text-2xl font-bold text-slate-900">
                  {card.value}
                </h3>
              </div>
            </div>
          ))}
        </section>

        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-900">
              Quick Access
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Continue your preparation from where you left off.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {quickAccessItems.map((item) => (
              <div
                key={item.title}
                className="group flex cursor-default flex-col rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_10px_25px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_40px_rgba(59,130,246,0.12)]"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${item.accent} text-xl text-white shadow-md`}
                >
                  <i className={item.icon} />
                </div>

                <h3 className="mt-4 text-xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>

                <button
                  type="button"
                  onClick={() => navigate(item.href)}
                  className="mt-5 inline-flex cursor-pointer items-center text-sm font-semibold text-blue-600 transition hover:text-indigo-600"
                >
                  {item.button}
                  <i className="fa-solid fa-arrow-right ml-2 text-xs" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-900">
              Recent Activity
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review your latest preparation activities.
            </p>
          </div>

          <div className="overflow-visible rounded-[24px] border border-slate-200 bg-white shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
            {isLoading && (
              <div className="cursor-default p-8 text-center text-slate-500">
                <i className="fa-solid fa-spinner fa-spin mr-2 text-blue-600" />
                Loading activities...
              </div>
            )}

            {hasNoActivity && (
              <div className="cursor-default p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-2xl text-sky-600">
                  <i className="fa-solid fa-chart-line" />
                </div>

                <p className="mt-4 text-lg font-semibold text-slate-800">
                  No activity yet
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Start your first mock interview or analyze a resume to see
                  your activity here.
                </p>
              </div>
            )}

            {!loadingInterviews &&
              interviews.map((interview, index) => {
                const interviewId = interview._id || interview.id;
                const type = getInterviewType(interview);
                const appearance = getInterviewIcon(type);
                const started = isStarted(interview);
                const completed = isCompleted(interview);
                const totalQuestions = getTotalQuestions(interview);
                const attemptedQuestions = Math.min(
                  getAttemptedQuestions(interview),
                  totalQuestions
                );
                const menuId = `interview-${interviewId}`;

                return (
                  <div
                    key={menuId || index}
                    className="relative flex flex-wrap items-center gap-4 border-b border-slate-200 p-4 md:p-5"
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${appearance.color}`}
                    >
                      <i className={appearance.icon} />
                    </div>

                    <div className="min-w-[180px] flex-1">
                      <h3 className="text-base font-semibold text-slate-900">
                        AI Mock Interview
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {type}
                        {interview.jobRole ? ` • ${interview.jobRole}` : ""}
                      </p>
                    </div>

                    {started ? (
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-600">
                          {attemptedQuestions}/{totalQuestions} attempted
                        </span>

                        <button
                          type="button"
                          onClick={() => handleResumeInterview(interviewId)}
                          className="inline-flex cursor-pointer items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          Resume
                          <i className="fa-solid fa-arrow-right ml-2" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-slate-500">
                          {formatTime(
                            interview.createdAt ||
                              interview.updatedAt ||
                              interview.date
                          )}
                        </p>

                        <p className="min-w-24 text-right text-sm font-bold text-slate-800">
                          <span className="text-slate-500">Score: </span>
                          {getScore(interview)}
                        </p>
                      </>
                    )}

                    <div
                      className="relative"
                      data-menu-container
                    >
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setOpenMenuId((previousId) =>
                            previousId === menuId ? null : menuId
                          );
                        }}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:text-blue-600"
                        aria-label="Interview actions"
                      >
                        <i className="fa-solid fa-ellipsis-vertical" />
                      </button>

                      {openMenuId === menuId && (
                        <div className="absolute right-0 top-11 z-50 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.16)]">
                          {completed && (
                            <button
                              type="button"
                              onClick={() => handleViewResult(interviewId)}
                              className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                            >
                              <i className="fa-solid fa-square-poll-vertical text-blue-500" />
                              Result
                            </button>
                          )}

                          {!completed && (
                            <button
                              type="button"
                              onClick={() => handleResumeInterview(interviewId)}
                              className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                            >
                              <i className="fa-solid fa-play text-green-500" />
                              Resume
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteInterview(interviewId)}
                            className="flex w-full cursor-pointer items-center gap-3 border-t border-slate-100 px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                          >
                            <i className="fa-solid fa-trash-can" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

            {!loadingResumes &&
              resumes.map((resume, index) => {
                const resumeId = resume._id || resume.id;
                const menuId = `resume-${resumeId}`;

                return (
                  <div
                    key={menuId || index}
                    className={`relative flex flex-wrap items-center gap-4 p-4 md:p-5 ${
                      index !== resumes.length - 1
                        ? "border-b border-slate-200"
                        : ""
                    }`}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                      <i className="fa-solid fa-file-lines" />
                    </div>

                    <div className="min-w-[180px] flex-1">
                      <h3 className="text-base font-semibold text-slate-900">
                        Resume Analysis
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {resume.companyName || "Company not specified"}
                        {resume.role ? ` • ${resume.role}` : ""}
                      </p>
                    </div>

                    <p className="text-sm text-slate-500">
                      {formatTime(resume.createdAt || resume.updatedAt)}
                    </p>

                    <p className="min-w-24 text-right text-sm font-bold text-slate-800">
                      <span className="text-slate-500">Score: </span>
                      {getResumeScore(resume)}
                    </p>

                    <div
                      className="relative"
                      data-menu-container
                    >
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setOpenMenuId((previousId) =>
                            previousId === menuId ? null : menuId
                          );
                        }}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-violet-200 hover:text-violet-600"
                        aria-label="Resume actions"
                      >
                        <i className="fa-solid fa-ellipsis-vertical" />
                      </button>

                      {openMenuId === menuId && (
                        <div className="absolute right-0 top-11 z-50 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.16)]">
                          <button
                            type="button"
                            onClick={() => handleViewResumeResult(resumeId)}
                            className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
                          >
                            <i className="fa-solid fa-square-poll-vertical text-violet-500" />
                            Result
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteResume(resumeId)}
                            className="flex w-full cursor-pointer items-center gap-3 border-t border-slate-100 px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                          >
                            <i className="fa-solid fa-trash-can" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;