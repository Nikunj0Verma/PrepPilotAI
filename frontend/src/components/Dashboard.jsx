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
  },
  {
    title: "Resume Analyzer",
    description:
      "Improve your resume with personalized analysis and suggestions.",
    button: "Analyze Resume",
    href: "/resume-analyzer",
    icon: "fa-solid fa-file-lines",
  },
  {
    title: "Company Preparation",
    description:
      "Explore company insights and prepare for your dream organization.",
    button: "Explore Companies",
    href: "/company-prep",
    icon: "fa-solid fa-building",
  },
  {
    title: "Progress Tracking",
    description: "Track your preparation journey, scores, and improvements.",
    button: "View Progress",
    href: "/progress",
    icon: "fa-solid fa-chart-line",
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
      color: "text-indigo-600 bg-indigo-100",
    };
  }

  if (
    normalizedType.includes("behaviour") ||
    normalizedType.includes("behavior")
  ) {
    return {
      icon: "fa-solid fa-comments",
      color: "text-cyan-600 bg-cyan-100",
    };
  }

  return {
    icon: "fa-solid fa-code",
    color: "text-blue-600 bg-blue-100",
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

const isStarted = (interview) =>
  interview.status?.toLowerCase() === "started"

const isCompleted = (interview) => {
  const status = String(interview?.status || "").toLowerCase();

  return (
    status === "completed"
  );
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
      if (!event.target.closest("[data-menu-button]")) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleViewResult = (interviewId) => {
    navigate(`/interview/${interviewId}/result`);
    setOpenMenuId(null);
  };

  const handleResumeInterview = (interviewId) => {
    navigate(`/interview/${interviewId}`);
    setOpenMenuId(null);
  };

  const handleDeleteInterview = async (id) => {
  try {
    const confirmed = window.confirm(
      "Are you sure you want to delete this interview?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/interview/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete interview");
    }

    setInterviews((prev) =>
      prev.filter((interview) => interview._id !== id)
    );

  } catch (error) {
    console.error("Delete interview error:", error);
    alert(error.message);
  }
};

  return (
    <div className="space-y-6 p-4 md:p-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 p-5 text-white shadow-xl shadow-blue-200 md:p-7">
        <p className="text-sm font-medium text-blue-100">Welcome back,</p>

        <h1 className="mt-1 text-2xl font-bold md:text-3xl">
          {userName?.firstName || "there"}!
        </h1>

        <p className="mt-2 text-sm text-blue-50 md:text-base">
          Ready to improve your interview performance today?
        </p>

        <a
          href="/interview-prep"
          className="mt-4 inline-flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-blue-600 shadow-lg transition hover:scale-105 hover:bg-blue-50"
        >
          Start Interview
          <i className="fa-solid fa-arrow-right ml-3" />
        </a>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-900">Quick Access</h2>
          <p className="mt-1 text-gray-500">
            Continue your preparation from where you left off.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {quickAccessItems.map((item) => (
            <div
              key={item.title}
              className="flex flex-col rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl text-blue-600">
                <i className={item.icon} />
              </div>

              <h3 className="mt-4 text-lg font-bold text-gray-900">
                {item.title}
              </h3>

              <p className="mt-2 flex-1 text-sm leading-6 text-gray-500">
                {item.description}
              </p>

              <a
                href={item.href}
                className="mt-5 inline-flex items-center font-semibold text-blue-600 transition hover:text-indigo-600"
              >
                {item.button}
                <i className="fa-solid fa-arrow-right ml-2 text-sm" />
              </a>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
          <p className="mt-1 text-gray-500">
            Review your latest preparation activities.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
          {loadingInterviews && (
            <div className="p-8 text-center text-gray-500">
              <i className="fa-solid fa-spinner fa-spin mr-2 text-blue-600" />
              Loading activities...
            </div>
          )}

          {!loadingInterviews && interviews.length === 0 && (
            <div className="p-8 text-center">
              <i className="fa-solid fa-chart-line text-3xl text-blue-300" />
              <p className="mt-3 font-semibold text-gray-700">
                No interview activity yet
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Start your first mock interview to see your activity here.
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

              return (
                <div
                  key={interviewId || index}
                  className={`flex flex-wrap items-center gap-4 p-5 ${
                    index !== interviews.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${appearance.color}`}
                  >
                    <i className={appearance.icon} />
                  </div>

                  <div className="min-w-[180px] flex-1">
                    <h3 className="font-semibold text-gray-900">
                      AI Mock Interview
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
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
                        onClick={() => navigate(`/interview/${interviewId}`)}
                        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        Resume
                        <i className="fa-solid fa-arrow-right ml-2" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-gray-500">
                        {formatTime(
                          interview.createdAt ||
                            interview.updatedAt ||
                            interview.date
                        )}
                      </p>

                      <p className="min-w-24 text-right font-bold text-blue-600">
                        <span className="text-black">Score: </span>
                        {getScore(interview)}
                      </p>
                    </>
                  )}

                  <div className="relative">
                    <button
                      type="button"
                      data-menu-button
                      onClick={(event) => {
                        event.stopPropagation();
                        setOpenMenuId((prev) =>
                          prev === interviewId ? null : interviewId
                        );
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:text-blue-600"
                      aria-label="Interview actions"
                    >
                      <i className="fa-solid fa-ellipsis-vertical" />
                    </button>

                    {openMenuId === interviewId && (
                      <div
                        className="absolute right-0 top-11 z-20 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {completed ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleViewResult(interviewId)}
                              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                            >
                              <i className="fa-solid fa-square-poll-vertical text-blue-500" />
                              Result
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteInterview(interviewId)}
                              className="flex w-full items-center gap-3 border-t border-slate-100 px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                            >
                              <i className="fa-solid fa-trash-can" />
                              Delete
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleResumeInterview(interviewId)}
                              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                            >
                              <i className="fa-solid fa-play text-green-500" />
                              Resume
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteInterview(interviewId)}
                              className="flex w-full items-center gap-3 border-t border-slate-100 px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                            >
                              <i className="fa-solid fa-trash-can" />
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;