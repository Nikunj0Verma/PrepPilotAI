import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const formatDate = (value) => {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getScore = (interview) => {
  const score = Number(interview?.evaluation?.overallScore);
  return Number.isFinite(score) ? Math.round(score) : 0;
};

const getInterviewType = (interview) => {
  const type = interview?.interviewType || interview?.type || "Technical";

  return type
    .toString()
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const ProgressChart = ({ interviews }) => {
  const chartWidth = 760;
  const chartHeight = 280;
  const padding = { top: 24, right: 24, bottom: 48, left: 44 };
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;

  const points = interviews.map((interview, index) => {
    const x =
      interviews.length === 1
        ? padding.left + graphWidth / 2
        : padding.left + (index / (interviews.length - 1)) * graphWidth;

    const y =
      padding.top + graphHeight - (getScore(interview) / 100) * graphHeight;

    return { x, y, score: getScore(interview), interview };
  });

  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="h-auto min-w-[620px] w-full"
        role="img"
        aria-label="Interview score performance chart"
      >
        {[0, 25, 50, 75, 100].map((value) => {
          const y =
            padding.top + graphHeight - (value / 100) * graphHeight;

          return (
            <g key={value}>
              <line
                x1={padding.left}
                x2={chartWidth - padding.right}
                y1={y}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray="5 5"
              />
              <text
                x={padding.left - 12}
                y={y + 4}
                textAnchor="end"
                fill="#64748b"
                fontSize="12"
              >
                {value}
              </text>
            </g>
          );
        })}

        <text
          x="14"
          y={chartHeight / 2}
          transform={`rotate(-90 14 ${chartHeight / 2})`}
          textAnchor="middle"
          fill="#64748b"
          fontSize="12"
        >
          Score
        </text>

        <text
          x={chartWidth / 2}
          y={chartHeight - 8}
          textAnchor="middle"
          fill="#64748b"
          fontSize="12"
        >
          Date
        </text>

        {points.length > 1 && (
          <path
            d={path}
            fill="none"
            stroke="#2563eb"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {points.map((point, index) => (
          <g key={`${point.interview._id || index}-${point.score}`}>
            <circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill="#ffffff"
              stroke="#2563eb"
              strokeWidth="4"
            />
            <text
              x={point.x}
              y={chartHeight - 22}
              textAnchor="middle"
              fill="#64748b"
              fontSize="11"
            >
              {formatDate(
                point.interview.createdAt || point.interview.updatedAt
              )}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

const Progress = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/interview/my-interviews",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch progress data.");
        }

        const completedInterviews = (data.interviews || [])
          .filter(
            (interview) =>
              interview.status === "completed" ||
              interview.evaluation?.overallScore !== undefined
          )
          .sort(
            (a, b) =>
              new Date(a.createdAt || a.updatedAt) -
              new Date(b.createdAt || b.updatedAt)
          );

        setInterviews(completedInterviews);
      } catch (error) {
        console.error("Progress fetch error:", error);
        setInterviews([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const progressStats = useMemo(() => {
    const scores = interviews.map(getScore).filter((score) => score > 0);
    const average =
      scores.length > 0
        ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
        : 0;

    return {
      interviews: interviews.length,
      average,
      best: scores.length > 0 ? Math.max(...scores) : 0,
      completed: interviews.filter(
        (interview) => interview.status === "completed"
      ).length,
    };
  }, [interviews]);

  const insights = useMemo(() => {
    if (!interviews.length) {
      return {
        strong: "Complete your first interview to unlock personalized insights.",
        improve: "Practice regularly to build confidence and improve your score.",
      };
    }

    const sorted = [...interviews].sort((a, b) => getScore(b) - getScore(a));
    const strongestType = getInterviewType(sorted[0]);
    const weakest = [...interviews].sort((a, b) => getScore(a) - getScore(b))[0];

    return {
      strong: `Your strongest performance is in ${strongestType.toLowerCase()} interviews, with a best score of ${getScore(sorted[0])}%.`,
      improve: `Focus on ${getInterviewType(
        weakest
      ).toLowerCase()} interviews to improve your current score of ${getScore(
        weakest
      )}%.`,
    };
  }, [interviews]);

  const statCards = [
    {
      label: "Interviews",
      value: progressStats.interviews,
      icon: "fa-solid fa-microphone",
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Avg Score",
      value: `${progressStats.average}%`,
      icon: "fa-solid fa-chart-line",
      color: "bg-violet-100 text-violet-600",
    },
    {
      label: "Best Score",
      value: `${progressStats.best}%`,
      icon: "fa-solid fa-trophy",
      color: "bg-amber-100 text-amber-600",
    },
    {
      label: "Completed",
      value: progressStats.completed,
      icon: "fa-solid fa-circle-check",
      color: "bg-emerald-100 text-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#eef4ff] p-4 text-slate-800 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-[#0f172a] via-[#1d4ed8] to-[#22d3ee] p-6 text-white shadow-[0_18px_45px_rgba(29,78,216,0.28)] md:p-8">
          <div className="relative z-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
              Track your growth
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
              Your Progress
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50 md:text-base">
              Review your interview performance, discover your strengths, and
              identify where you can improve.
            </p>
          </div>

          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-28 right-12 h-72 w-72 rounded-full bg-cyan-300/10" />
        </section>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_25px_rgba(15,23,42,0.04)]"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}
              >
                <i className={card.icon} />
              </div>
              <p className="mt-5 text-sm text-slate-500">{card.label}</p>
              <h2 className="mt-1 text-3xl font-bold text-slate-900">
                {isLoading ? "—" : card.value}
              </h2>
            </div>
          ))}
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)] md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Performance Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Monitor how your interview scores change over time.
            </p>
          </div>

          {isLoading ? (
            <div className="flex h-72 items-center justify-center text-slate-500">
              <i className="fa-solid fa-spinner fa-spin mr-2 text-blue-600" />
              Loading performance...
            </div>
          ) : interviews.length === 0 ? (
            <div className="flex h-72 items-center justify-center rounded-2xl bg-slate-50 text-center text-sm text-slate-500">
              Complete an interview to see your performance chart.
            </div>
          ) : (
            <ProgressChart interviews={interviews} />
          )}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)] md:p-8">
            <h2 className="text-2xl font-bold text-slate-900">AI Insights</h2>
            <p className="mt-1 text-sm text-slate-500">
              Personalized guidance based on your interview history.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-emerald-50 p-5">
                <div className="flex items-center gap-3 text-emerald-700">
                  <i className="fa-solid fa-thumbs-up" />
                  <h3 className="font-bold">Strong Areas</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-emerald-900">
                  {insights.strong}
                </p>
              </div>

              <div className="rounded-2xl bg-amber-50 p-5">
                <div className="flex items-center gap-3 text-amber-700">
                  <i className="fa-solid fa-bullseye" />
                  <h3 className="font-bold">Improve</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-amber-900">
                  {insights.improve}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-[0_12px_30px_rgba(37,99,235,0.2)] md:p-8">
            <i className="fa-solid fa-lightbulb text-3xl text-cyan-200" />
            <h2 className="mt-5 text-2xl font-bold">Keep practicing</h2>
            <p className="mt-3 text-sm leading-7 text-blue-100">
              Consistent practice is the best way to improve your confidence and
              interview score.
            </p>
            <button
              type="button"
              onClick={() => navigate("/interview-prep")}
              className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Start an Interview
              <i className="fa-solid fa-arrow-right ml-3" />
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Interview History
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Review your previous interview attempts.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="border-y border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Score</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 text-right font-semibold">View</th>
                </tr>
              </thead>

              <tbody>
                {interviews.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      No interview history found.
                    </td>
                  </tr>
                ) : (
                  interviews
                    .slice()
                    .reverse()
                    .map((interview, index) => {
                      const interviewId = interview._id || interview.id;

                      return (
                        <tr
                          key={interviewId || index}
                          className="border-b border-slate-100 last:border-0"
                        >
                          <td className="px-6 py-5 font-semibold text-slate-900">
                            {interview.jobRole || "Interview"}
                          </td>
                          <td className="px-6 py-5 text-slate-500">
                            {getInterviewType(interview)}
                          </td>
                          <td className="px-6 py-5">
                            <span className="rounded-full bg-blue-50 px-3 py-1.5 font-bold text-blue-600">
                              {getScore(interview)}%
                            </span>
                          </td>
                          <td className="px-6 py-5 text-slate-500">
                            {formatDate(
                              interview.createdAt || interview.updatedAt
                            )}
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/interview/${interviewId}/result`)
                              }
                              className="font-semibold text-blue-600 transition hover:text-indigo-600"
                            >
                              View
                              <i className="fa-solid fa-arrow-right ml-2 text-xs" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Progress;