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

const shortDate = (value) => {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
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

const getInterviewIconText = (interview) => {
  const type = getInterviewType(interview).toLowerCase();

  if (type.includes("technical")) return "T";
  if (type.includes("behavior")) return "B";
  if (type.includes("manager")) return "M";
  if (type.includes("hr")) return "H";
  if (type.includes("system")) return "S";
  if (type.includes("design")) return "D";
  if (type.includes("product")) return "P";
  if (type.includes("data")) return "D";

  return (type.charAt(0) || "I").toUpperCase();
};

const getTypeGradient = (interview) => {
  const type = getInterviewType(interview).toLowerCase();

  if (type.includes("technical")) return "from-blue-600 to-indigo-500";
  if (type.includes("behavior")) return "from-emerald-500 to-teal-500";
  if (type.includes("manager")) return "from-violet-500 to-purple-500";
  if (type.includes("hr")) return "from-amber-500 to-orange-500";
  if (type.includes("design")) return "from-pink-500 to-rose-500";
  if (type.includes("product")) return "from-cyan-500 to-sky-500";

  return "from-slate-600 to-slate-500";
};

const getPerformanceLabel = (score) => {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Good";
  if (score >= 40) return "Improving";
  return "Needs work";
};

const getPerformanceTone = (score) => {
  if (score >= 80)
    return {
      badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
    };
  if (score >= 60)
    return {
      badge: "bg-blue-100 text-blue-700 border-blue-200",
      dot: "bg-blue-500",
    };
  if (score >= 40)
    return {
      badge: "bg-amber-100 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
    };

  return {
    badge: "bg-rose-100 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  };
};

const ProgressChart = ({ interviews }) => {
  const chartWidth = 760;
  const chartHeight = 280;
  const padding = { top: 18, right: 18, bottom: 42, left: 42 };
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;

  const points = interviews.map((interview, index) => {
    const x =
      interviews.length === 1
        ? padding.left + graphWidth / 2
        : padding.left + (index / (interviews.length - 1)) * graphWidth;

    const y =
      padding.top + graphHeight - (getScore(interview) / 100) * graphHeight;

    return {
      x,
      y,
      score: getScore(interview),
      interview,
    };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${
    chartHeight - padding.bottom
  } L ${points[0].x} ${chartHeight - padding.bottom} Z`;

  const getY = (score) =>
    padding.top + graphHeight - (score / 100) * graphHeight;

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="h-auto min-w-[620px] w-full"
        role="img"
        aria-label="Interview score performance chart"
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="50%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          <linearGradient id="areaGradient" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(99,102,241,0.35)" />
            <stop offset="100%" stopColor="rgba(99,102,241,0.02)" />
          </linearGradient>
        </defs>

        <rect
          x="0"
          y="0"
          width={chartWidth}
          height={chartHeight}
          rx="18"
          fill="#f8fafc"
        />

        {[0, 25, 50, 75, 100].map((value) => {
          const y = getY(value);

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
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                fill="#64748b"
                fontSize="11"
              >
                {value}
              </text>
            </g>
          );
        })}

        {points.map((point, index) => (
          <line
            key={`guide-${index}`}
            x1={point.x}
            x2={point.x}
            y1={padding.top}
            y2={chartHeight - padding.bottom}
            stroke="#f1f5f9"
          />
        ))}

        {points.length > 1 && (
          <>
            <path d={areaPath} fill="url(#areaGradient)" />
            <path
              d={linePath}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}

        {points.map((point, index) => (
          <g key={`${point.interview._id || index}-${point.score}`}>
            <circle
              cx={point.x}
              cy={point.y}
              r="7"
              fill="#fff"
              stroke="#4f46e5"
              strokeWidth="3"
            />

            <circle
              cx={point.x}
              cy={point.y}
              r="12"
              fill="transparent"
              stroke="rgba(79,70,229,0.15)"
              strokeWidth="1"
            />

            <text
              x={point.x}
              y={point.y - 14}
              textAnchor="middle"
              fill="#1f2937"
              fontSize="11"
              fontWeight="700"
            >
              {point.score}
            </text>

            <text
              x={point.x}
              y={chartHeight - 18}
              textAnchor="middle"
              fill="#64748b"
              fontSize="10"
            >
              {shortDate(point.interview.createdAt || point.interview.updatedAt)}
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
              interview.status === "completed" &&
              Number(interview?.evaluation?.overallScore) > 0
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
        momentum:
          "Your progress will appear here once you complete more interview rounds.",
        focus:
          "Focus on one clear interview strategy first: structure, examples, and confident closing.",
      };
    }

    const scores = interviews.map(getScore);
    const averageScore =
      scores.reduce((sum, score) => sum + score, 0) / scores.length;

    const typeGroups = interviews.reduce((acc, interview) => {
      const type = getInterviewType(interview);
      if (!acc[type]) acc[type] = [];
      acc[type].push(getScore(interview));
      return acc;
    }, {});

    const strongestType = Object.entries(typeGroups).sort((a, b) => {
      const avgA =
        a[1].reduce((sum, score) => sum + score, 0) / a[1].length;
      const avgB =
        b[1].reduce((sum, score) => sum + score, 0) / b[1].length;

      return avgB - avgA;
    })[0];

    const strongestTypeAvg =
      strongestType[1].reduce((sum, score) => sum + score, 0) /
      strongestType[1].length;

    const recentScores = scores.slice(-Math.min(3, scores.length));
    const previousScores = scores.slice(0, Math.min(3, scores.length));

    const recentAvg =
      recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
    const previousAvg =
      previousScores.length > 0
        ? previousScores.reduce((sum, score) => sum + score, 0) /
          previousScores.length
        : recentAvg;

    const scoreTrend = recentAvg - previousAvg;

    const weakestInterview = [...interviews].sort(
      (a, b) => getScore(a) - getScore(b)
    )[0];

    return {
      strong: `Your best-performing interviews are ${strongestType[0].toLowerCase()} rounds, averaging ${Math.round(
        strongestTypeAvg
      )}% across those attempts.`,
      momentum: `Your recent performance is ${
        scoreTrend >= 0 ? "improving" : "slightly below"
      } earlier sessions (${Math.round(recentAvg)}% vs ${Math.round(
        previousAvg
      )}%), suggesting ${
        scoreTrend >= 0
          ? "your preparation is compounding."
          : "you may need a more targeted practice session."
      }`,
      focus: `Your lowest score currently comes from ${getInterviewType(
        weakestInterview
      ).toLowerCase()} interviews. Focus on tightening your structure, using stronger STAR examples, and ending with a confident summary to move closer to ${Math.round(
        averageScore + 10
      )}% overall.`,
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

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)] md:p-8">
            <div className="flex items-center gap-3 text-emerald-700">
              <i className="fa-solid fa-thumbs-up" />
              <h3 className="font-bold text-slate-900">Strong Areas</h3>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">
              {insights.strong}
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)] md:p-8">
            <div className="flex items-center gap-3 text-violet-700">
              <i className="fa-solid fa-chart-line" />
              <h3 className="font-bold text-slate-900">Momentum</h3>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">
              {insights.momentum}
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)] md:p-8">
            <div className="flex items-center gap-3 text-amber-700">
              <i className="fa-solid fa-bullseye" />
              <h3 className="font-bold text-slate-900">Focus Area</h3>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">
              {insights.focus}
            </p>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-[0_12px_30px_rgba(37,99,235,0.2)] md:p-8">
          <i className="fa-solid fa-lightbulb text-3xl text-cyan-200" />
          <h2 className="mt-5 text-2xl font-bold">Keep practicing</h2>
          <p className="mt-3 text-sm leading-7 text-blue-100">
            Consistent practice is the best way to improve your confidence and
            interview score.
          </p>
          <button
            type="button"
            onClick={() => navigate("/interview-prep")}
            className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 cursor-pointer"
          >
            Start an Interview
            <i className="fa-solid fa-arrow-right ml-3" />
          </button>
        </section>

        <section className="rounded-[30px] border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-6 md:flex-row md:items-end md:justify-between md:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Archive
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Interview History
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                {interviews.length} sessions
              </span>
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                Latest first
              </span>
            </div>
          </div>

          <div className="grid gap-4 p-4 md:p-6">
            {interviews.length === 0 ? (
              <div className="rounded-[22px] border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-500">
                No interview history found.
              </div>
            ) : (
              [...interviews] 
                .map((interview, index) => {
                  const interviewId = interview._id || interview.id;
                  const score = getScore(interview);
                  const type = getInterviewType(interview);
                  const performance = getPerformanceLabel(score);
                  const colorClasses = getPerformanceTone(score);
                  const iconText = getInterviewIconText(interview);
                  const iconGradient = getTypeGradient(interview);

                  return (
                    <div
                      key={interviewId || index}
                      className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50 p-4 transition-all duration-200 hover:border-blue-200 hover:bg-white hover:shadow-[0_12px_24px_rgba(59,130,246,0.08)]"
                    >

                      <div className="flex flex-col gap-4 pl-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${iconGradient} text-lg font-bold text-white shadow-md`}
                          >
                            {iconText}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate text-lg font-bold text-slate-900">
                                {interview.jobRole || "Interview"}
                              </h3>
                              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                                {type}
                              </span>
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                              <span className="inline-flex items-center gap-2">
                                <i className="fa-regular fa-calendar text-blue-500" />
                                {formatDate(interview.createdAt || interview.updatedAt)}
                              </span>

                              <span className="inline-flex items-center gap-2">
                                <i className="fa-solid fa-circle-play text-violet-500" />
                                Attempt #{interviews.length - index}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-start gap-3 md:items-end">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold ${colorClasses.badge}`}
                            >
                              <span
                                className={`h-2 w-2 rounded-full ${colorClasses.dot}`}
                              />
                              {performance}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/interview/${interviewId}/result`)
                              }
                              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 cursor-pointer"
                            >
                              View result
                              <i className="fa-solid fa-arrow-right text-xs" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Progress;