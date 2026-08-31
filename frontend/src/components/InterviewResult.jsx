import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const WEBSITE_NAME = "PrepPilot AI";
const WEBSITE_TAGLINE = "Practice smarter. Perform better.";

const InterviewResult = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedQuestion, setExpandedQuestion] = useState(0);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:5000/api/interview/${id}/result`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch interview result");
        }

        setInterview({
          ...data.interview,
          evaluation: data.interview?.evaluation || data.evaluation || {},
        });
      } catch (fetchError) {
        console.error("Error fetching result:", fetchError);
        setError(fetchError.message || "Failed to fetch interview result");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  const evaluation = interview?.evaluation || {};
  const questions = interview?.questions || [];
  const score = Number(evaluation.overallScore || 0);

  const performance =
    evaluation.performance ||
    (score >= 70 ? "Strong" : score >= 50 ? "Average" : "Needs Work");

  const performanceColor =
    score >= 70
      ? "text-emerald-400"
      : score >= 50
        ? "text-amber-400"
        : "text-red-400";

  const performanceIcon =
    score >= 70
      ? "fa-solid fa-circle-check"
      : score >= 50
        ? "fa-solid fa-triangle-exclamation"
        : "fa-solid fa-circle-xmark";

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <ResultLoadingState />;
  }

  if (error) {
    return (
      <ResultOverlay>
        <div className="flex min-h-[500px] flex-col items-center justify-center px-5 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-400 ring-1 ring-red-500/20">
            <i className="fa-solid fa-circle-exclamation text-2xl" />
          </div>

          <p className="mt-4 text-red-300">{error}</p>

          <button
            type="button"
            onClick={() => navigate("/interview-prep")}
            className="mt-5 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500"
          >
            Back to Interview Prep
          </button>
        </div>
      </ResultOverlay>
    );
  }

  return (
    <>
      <div className="screen-layout">
        <ResultOverlay>
          <header className="border-b border-slate-700/60 bg-[#0c1529] px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-500/10 text-sky-200 shadow-[0_8px_20px_rgba(56,189,248,0.18)]">
                  <i className="fa-solid fa-microchip text-base" />
                </div>

                <div className="space-y-1">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-sky-300">
                    AI-powered prep
                  </p>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-100">
                    Interview Result
                  </h1>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                aria-label="Close interview result"
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-600/80 bg-slate-800/70 text-slate-300 transition-all duration-200 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/30"
              >
                <i className="fa-solid fa-xmark text-lg" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <ResultBadge
                label="Type"
                value={interview?.interviewType || "Technical"}
              />
              <ResultBadge
                label="Role"
                value={interview?.jobRole || "Not specified"}
              />
              <ResultBadge
                label="Level"
                value={interview?.experienceLevel || "Entry Level"}
              />
              <ResultBadge label="Questions" value={questions.length} />
            </div>
          </header>

          <section className="space-y-4 p-4 sm:p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-700/80 bg-[#111c2f] p-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  Overall Score
                </p>

                <div className="mt-3 flex items-end gap-2">
                  <p className="text-5xl font-bold text-sky-300">{score}</p>
                  <span className="pb-1 text-xl font-medium text-slate-400">/100</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-700/80 bg-[#111c2f] p-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  Overall Performance
                </p>

                <h3
                  className={`mt-3 flex items-center gap-2 text-2xl font-bold ${performanceColor}`}
                >
                  <i className={`${performanceIcon}`} />
                  {performance}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {evaluation.summary ||
                    "Keep practicing to improve your interview performance."}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ResultSection
                title="Strengths"
                icon="fa-solid fa-circle-check"
                color="text-emerald-400"
                items={
                  Array.isArray(evaluation.strengths)
                    ? evaluation.strengths
                    : ["No strengths available."]
                }
              />

              <ResultSection
                title="Areas to Improve"
                icon="fa-solid fa-circle-exclamation"
                color="text-amber-400"
                items={
                  Array.isArray(evaluation.weaknesses)
                    ? evaluation.weaknesses
                    : Array.isArray(evaluation.areasToImprove)
                      ? evaluation.areasToImprove
                      : ["No improvement areas available."]
                }
              />
            </div>

            <section className="rounded-2xl border border-slate-700/80 bg-[#111c2f] p-4">
              <h3 className="text-lg font-bold text-white">Question Performance</h3>

              <div className="mt-4 space-y-3">
                {questions.length === 0 ? (
                  <p className="rounded-xl border border-slate-700/80 bg-[#0b1220] p-3 text-sm text-slate-400">
                    No question results are available.
                  </p>
                ) : (
                  questions.map((question, index) => {
                    const questionEvaluation = question.evaluation || {};
                    const isExpanded = expandedQuestion === index;

                    const questionScore = getScore(questionEvaluation.overallScore);

                    const communication = getScore(
                      questionEvaluation.communication
                    );
                    const technicalDepth = getScore(
                      questionEvaluation.technicalDepth
                    );
                    const relevance = getScore(questionEvaluation.relevance);

                    const feedback =
                      questionEvaluation.feedback ||
                      "No feedback available for this question.";

                    return (
                      <div
                        key={question._id || index}
                        className="overflow-hidden rounded-xl border border-slate-700/80 bg-[#0b1220]"
                      >
                        <button
                          type="button"
                          aria-expanded={isExpanded}
                          onClick={() =>
                            setExpandedQuestion(isExpanded ? null : index)
                          }
                          className="flex w-full items-center gap-3 p-3 text-left transition hover:bg-white/5"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-xs font-bold text-sky-300">
                            {index + 1}
                          </span>

                          <span className="flex-1 text-sm leading-6 text-slate-200">
                            {question.question ||
                              question.text ||
                              "Question unavailable"}
                          </span>

                          <span className="shrink-0 rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-bold text-sky-300">
                            {questionScore}/10
                          </span>

                          <i
                            className={`fa-solid fa-chevron-down text-slate-400 transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isExpanded && (
                          <div className="border-t border-slate-700/80 p-4">
                            <div className="grid gap-4 lg:grid-cols-2">
                              <DetailCard
                                title="Your Answer"
                                content={
                                  question.answer?.trim() ||
                                  "No answer was submitted for this question."
                                }
                              />

                              <DetailCard title="AI Feedback" content={feedback} />
                            </div>

                            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                              <ScoreBadge
                                label="Communication"
                                score={communication}
                              />
                              <ScoreBadge
                                label="Technical Depth"
                                score={technicalDepth}
                              />
                              <ScoreBadge label="Relevance" score={relevance} />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            <div className="no-print flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-5 py-2.5 text-sm font-semibold text-sky-200 transition hover:bg-sky-500/20"
              >
                <i className="fa-solid fa-file-pdf mr-2" />
                Print / Save as PDF
              </button>

              <button
                type="button"
                onClick={() => navigate("/interview-prep")}
                className="rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
              >
                <i className="fa-solid fa-rotate-right mr-2" />
                Take Another Interview
              </button>

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="rounded-xl border border-slate-600/80 bg-slate-800/60 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700/70"
              >
                <i className="fa-solid fa-chart-line mr-2" />
                Dashboard
              </button>
            </div>
          </section>
        </ResultOverlay>
      </div>

      <div className="print-layout">
        <div className="print-sheet mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-none">
          <header className="print-header border-b border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-600 to-indigo-600 text-xl font-bold text-white">
                  P
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-700">
                    AI-Powered Preparation
                  </p>
                  <h1 className="text-2xl font-extrabold text-slate-900">
                    {WEBSITE_NAME}
                  </h1>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Result
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {formatDate(interview?.createdAt || new Date().toISOString())}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-3xl font-bold text-slate-900">Interview Result</h2>

              <div className="mt-4 flex flex-wrap gap-2">
                <PrintBadge
                  label="Type"
                  value={interview?.interviewType || "Technical"}
                />
                <PrintBadge
                  label="Role"
                  value={interview?.jobRole || "Not specified"}
                />
                <PrintBadge
                  label="Level"
                  value={interview?.experienceLevel || "Entry Level"}
                />
                <PrintBadge label="Questions" value={questions.length || 0} />
                <PrintBadge
                  label="Date"
                  value={formatDate(
                    interview?.createdAt || new Date().toISOString()
                  )}
                />
              </div>
            </div>
          </header>

          <main className="space-y-6 p-6">
            <section className="grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-500">Overall Score</p>
                <p className="mt-2 text-5xl font-extrabold tracking-tight text-sky-700">
                  {score}
                  <span className="text-2xl font-semibold text-slate-600">/100</span>
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-500">
                  Overall Performance
                </p>
                <h3
                  className={`mt-2 text-3xl font-bold ${
                    score >= 70
                      ? "text-green-600"
                      : score >= 50
                        ? "text-amber-600"
                        : "text-red-600"
                  }`}
                >
                  {performance}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {evaluation.summary ||
                    "Keep practicing to improve your interview performance."}
                </p>
              </div>
            </section>

            <section className="grid gap-5 md:grid-cols-2">
              <PrintSection
                title="Strengths"
                icon="fa-solid fa-circle-check"
                color="text-green-600"
                items={
                  Array.isArray(evaluation.strengths)
                    ? evaluation.strengths
                    : ["No strengths available."]
                }
              />

              <PrintSection
                title="Areas to Improve"
                icon="fa-solid fa-circle-exclamation"
                color="text-amber-600"
                items={
                  Array.isArray(evaluation.weaknesses)
                    ? evaluation.weaknesses
                    : Array.isArray(evaluation.areasToImprove)
                      ? evaluation.areasToImprove
                      : ["No improvement areas available."]
                }
              />
            </section>

            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-2xl font-bold text-slate-900">
                Question Performances
              </h3>

              <div className="mt-5 space-y-4">
                {questions.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
                    No question results available.
                  </div>
                ) : (
                  questions.map((question, index) => {
                    const questionEvaluation = question.evaluation || {};
                    const questionScore = getScore(questionEvaluation.overallScore);
                    const communication = getScore(
                      questionEvaluation.communication
                    );
                    const technicalDepth = getScore(
                      questionEvaluation.technicalDepth
                    );
                    const relevance = getScore(questionEvaluation.relevance);

                    return (
                      <div
                        key={question._id || index}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                      >
                        <div className="flex items-start gap-3 border-b border-slate-200 p-4">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-700">
                            {index + 1}
                          </span>

                          <div className="flex-1">
                            <p className="text-base font-semibold leading-7 text-slate-900">
                              {question.question ||
                                question.text ||
                                "Question unavailable"}
                            </p>
                          </div>

                          <span className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">
                            {questionScore}/10
                          </span>
                        </div>

                        <div className="p-4 sm:p-5">
                          <div className="grid gap-4 md:grid-cols-2">
                            <PrintAnswerCard
                              title="Your Answer"
                              content={
                                question.answer?.trim() ||
                                "No answer was submitted for this question."
                              }
                            />

                            <PrintAnswerCard
                              title="AI Feedback"
                              content={
                                questionEvaluation.feedback ||
                                "No detailed feedback is available for this question."
                              }
                            />
                          </div>

                          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            <PrintScoreBadge
                              label="Overall Score"
                              score={questionScore}
                            />
                            <PrintScoreBadge
                              label="Communication"
                              score={communication}
                            />
                            <PrintScoreBadge
                              label="Technical Depth"
                              score={technicalDepth}
                            />
                            <PrintScoreBadge
                              label="Relevance"
                              score={relevance}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </main>

          <footer className="border-t border-slate-200 bg-slate-50 px-6 py-5 text-center">
            <p className="text-lg font-extrabold text-slate-900">{WEBSITE_NAME}</p>
            <p className="mt-1 text-sm text-slate-600">{WEBSITE_TAGLINE}</p>
          </footer>
        </div>
      </div>
    </>
  );
};

const ResultLoadingState = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
    <div className="rounded-[22px] border border-slate-700/80 bg-[#0d1324] px-8 py-7 text-center text-white shadow-[0_20px_60px_rgba(15,23,42,0.5)]">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sky-500/10 ring-1 ring-sky-500/20">
        <i className="fa-solid fa-spinner fa-spin text-2xl text-sky-300" />
      </div>

      <p className="mt-4 text-sm text-slate-300">Loading interview result...</p>
    </div>
  </div>
);

const ResultOverlay = ({ children }) => (
  <div className="print-container fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 px-3 py-4 backdrop-blur-sm sm:px-6">
    <div className="flex min-h-full items-center justify-center">
      <main className="w-full max-w-4xl overflow-hidden rounded-[24px] border border-slate-700/70 bg-[#0d1324] text-white shadow-[0_25px_70px_rgba(15,23,42,0.7)]">
        {children}
      </main>
    </div>
  </div>
);

const ResultBadge = ({ label, value }) => (
  <div className="flex items-center gap-2 rounded-xl border border-slate-600/80 bg-slate-800/50 px-3 py-2 text-xs text-slate-100 shadow-[0_8px_18px_rgba(15,23,42,0.2)]">
    <span className="text-slate-300">{label}:</span>
    <span className="font-semibold text-slate-100">{value}</span>
  </div>
);

const ResultSection = ({ title, icon, color, items }) => (
  <div className="rounded-2xl border border-slate-700/80 bg-[#111c2f] p-4">
    <h3 className="flex items-center gap-2 text-lg font-bold text-white">
      <i className={`${icon} ${color}`} />
      {title}
    </h3>

    <ul className="mt-4 space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3 text-sm text-slate-300">
          <i className={`fa-solid fa-check mt-1 ${color}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const DetailCard = ({ title, content }) => (
  <div>
    <h4 className="font-semibold text-sky-300">{title}</h4>
    <p className="mt-2 min-h-[100px] rounded-xl border border-slate-700/80 bg-[#0b1220] p-3 text-sm leading-6 text-slate-300">
      {content}
    </p>
  </div>
);

const ScoreBadge = ({ label, score }) => (
  <div className="rounded-xl border border-slate-700/80 bg-[#0b1220] p-3">
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-slate-400">{label}</span>
      <span className="text-sm font-bold text-sky-300">{score}/10</span>
    </div>

    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-700">
      <div
        className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500"
        style={{ width: `${score * 10}%` }}
      />
    </div>
  </div>
);

const PrintBadge = ({ label, value }) => (
  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
    <span className="text-slate-500">{label}: </span>
    <span className="font-semibold text-slate-800">{value}</span>
  </div>
);

const PrintSection = ({ title, icon, color, items }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
    <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900">
      <i className={`${icon} ${color}`} />
      {title}
    </h3>

    <ul className="mt-4 space-y-3">
      {items.length === 0 ? (
        <li className="text-sm text-slate-500">No information available.</li>
      ) : (
        items.map((item, index) => (
          <li key={index} className="flex gap-3 text-sm text-slate-700">
            <i className={`fa-solid fa-check mt-1 ${color}`} />
            <span>{item}</span>
          </li>
        ))
      )}
    </ul>
  </div>
);

const PrintAnswerCard = ({ title, content }) => (
  <div>
    <h4 className="font-semibold text-sky-700">{title}</h4>
    <p className="mt-2 min-h-[120px] rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
      {content}
    </p>
  </div>
);

const PrintScoreBadge = ({ label, score }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-3">
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="font-bold text-sky-700">{score}/10</span>
    </div>

    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
      <div
        className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500"
        style={{ width: `${(score / 10) * 100}%` }}
      />
    </div>
  </div>
);

const getScore = (value) => {
  const score = Number(value);

  if (Number.isNaN(score)) {
    return 0;
  }

  return Math.max(0, Math.min(10, score));
};

const formatDate = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export default InterviewResult;