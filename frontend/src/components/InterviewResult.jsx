import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api/interview";
const WEBSITE_NAME = "PrepPilot AI";
const WEBSITE_TAGLINE = "Your AI-powered interview preparation companion";

const InterviewResult = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  useEffect(() => {
    const handleBeforePrint = () => {
      document.body.style.position = "static";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "visible";
      document.documentElement.style.overflow = "visible";
    };

    const handleAfterPrint = () => {
      document.body.style.position = "fixed";
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    };

    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/${id}/result`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ResultOverlay>
        <div className="flex min-h-[400px] flex-col items-center justify-center px-5 text-center">
          <i className="fa-solid fa-circle-exclamation text-3xl text-red-400" />

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
      <ResultOverlay>
        <header className="border-b border-slate-700/60 bg-gradient-to-r from-[#101827] via-[#121d31] to-[#0d1426] px-5 py-4 sm:px-7">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-300 ring-1 ring-sky-400/20">
                <i className="fa-solid fa-microchip" />
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-sky-300">
                  AI-powered prep
                </p>

                <h1 className="text-2xl font-bold text-slate-100">
                  Interview Result
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              aria-label="Close result"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-600/80 bg-slate-800/70 text-slate-300 transition hover:bg-red-500/10 hover:text-red-300"
            >
              <i className="fa-solid fa-xmark text-lg" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <InfoBadge
              icon="fa-solid fa-layer-group"
              label="Type"
              value={interview?.interviewType || "Technical"}
            />

            <InfoBadge
              icon="fa-solid fa-briefcase"
              label="Role"
              value={interview?.jobRole || "Not specified"}
            />

            <InfoBadge
              icon="fa-solid fa-chart-line"
              label="Level"
              value={interview?.experienceLevel || "Entry Level"}
            />

            <InfoBadge
              icon="fa-solid fa-list"
              label="Questions"
              value={questions.length}
            />
          </div>
        </header>

        <section className="space-y-4 p-4 sm:p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-700/80 bg-[#111c2f] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Overall Score
              </p>

              <div className="mt-3 flex items-end gap-2">
                <p className="text-5xl font-bold text-sky-300">{score}</p>
                <span className="pb-1 text-xl text-slate-400">/100</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700/80 bg-[#111c2f] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Overall Performance
              </p>

              <h3
                className={`mt-3 text-2xl font-bold ${
                  score >= 70
                    ? "text-emerald-400"
                    : score >= 50
                      ? "text-amber-400"
                      : "text-red-400"
                }`}
              >
                <i
                  className={`fa-solid ${
                    score >= 70
                      ? "fa-circle-check"
                      : score >= 50
                        ? "fa-triangle-exclamation"
                        : "fa-circle-xmark"
                  } mr-2`}
                />
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
            <h2 className="text-lg font-bold text-white">
              Question Performance
            </h2>

            <div className="mt-4 space-y-3">
              {questions.length === 0 ? (
                <p className="rounded-xl bg-[#0b1220] p-4 text-sm text-slate-400">
                  No question results are available.
                </p>
              ) : (
                questions.map((question, index) => {
                  const questionEvaluation = question.evaluation || {};
                  const isExpanded = expandedQuestion === index;

                  const questionScore = getScore(
                    questionEvaluation.overallScore,
                  );

                  return (
                    <div
                      key={question._id || index}
                      className="overflow-hidden rounded-xl border border-slate-700/80 bg-[#0b1220]"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedQuestion(isExpanded ? null : index)
                        }
                        aria-expanded={isExpanded}
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

                        <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-bold text-sky-300">
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
                                "No answer was submitted."
                              }
                            />

                            <DetailCard
                              title="AI Feedback"
                              content={
                                questionEvaluation.feedback ||
                                "No feedback available."
                              }
                            />
                          </div>

                          <div className="mt-4 grid gap-3 sm:grid-cols-3">
                            <ScoreBadge
                              label="Communication"
                              score={getScore(questionEvaluation.communication)}
                            />

                            <ScoreBadge
                              label="Technical Depth"
                              score={getScore(
                                questionEvaluation.technicalDepth,
                              )}
                            />

                            <ScoreBadge
                              label="Relevance"
                              score={getScore(questionEvaluation.relevance)}
                            />
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

      <div className="print-layout">
        <div className="print-sheet">
          <header className="print-header">
            <div className="print-brand-row">
              <div className="print-brand">
                <div className="print-logo">P</div>

                <div>
                  <p className="print-eyebrow">AI-POWERED PREPARATION</p>

                  <h1>{WEBSITE_NAME}</h1>
                </div>
              </div>

              <div className="print-result-date">
                <p>RESULT</p>
                <strong>
                  {formatDate(interview?.createdAt || new Date().toISOString())}
                </strong>
              </div>
            </div>

            <div className="print-title-card">
              <h2>Interview Result</h2>

              <div className="print-badges">
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

                <PrintBadge label="Questions" value={questions.length} />

                <PrintBadge
                  label="Date"
                  value={formatDate(
                    interview?.createdAt || new Date().toISOString(),
                  )}
                />
              </div>
            </div>
          </header>

          <main className="print-content">
            <section className="print-summary-grid">
              <div className="print-card print-score-card">
                <p className="print-card-label">Overall Score</p>

                <div className="print-score">
                  <span>{score}</span>
                  <small>/100</small>
                </div>
              </div>

              <div className="print-card">
                <p className="print-card-label">Overall Performance</p>

                <h3
                  className={
                    score >= 70
                      ? "print-success"
                      : score >= 50
                        ? "print-warning"
                        : "print-danger"
                  }
                >
                  {performance}
                </h3>

                <p className="print-description">
                  {evaluation.summary ||
                    "Keep practicing to improve your interview performance."}
                </p>
              </div>
            </section>

            <section className="print-card print-list-card">
              <h3 className="print-section-title print-success">
                <i className="fa-solid fa-circle-check" />
                Strengths
              </h3>

              <ul>
                {(Array.isArray(evaluation.strengths)
                  ? evaluation.strengths
                  : ["No strengths available."]
                ).map((item, index) => (
                  <li key={index}>
                    <i className="fa-solid fa-check" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="print-card print-list-card">
              <h3 className="print-section-title print-warning">
                <i className="fa-solid fa-circle-exclamation" />
                Areas to Improve
              </h3>

              <ul>
                {(Array.isArray(evaluation.weaknesses)
                  ? evaluation.weaknesses
                  : Array.isArray(evaluation.areasToImprove)
                    ? evaluation.areasToImprove
                    : ["No improvement areas available."]
                ).map((item, index) => (
                  <li key={index}>
                    <i className="fa-solid fa-check" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="print-questions">
              <h2 className="print-questions-title">Question Performances</h2>

              <div className="print-question-list">
                {questions.length === 0 ? (
                  <div className="print-empty">
                    No question results available.
                  </div>
                ) : (
                  questions.map((question, index) => {
                    const questionEvaluation = question.evaluation || {};

                    const questionScore = getScore(
                      questionEvaluation.overallScore,
                    );

                    const communication = getScore(
                      questionEvaluation.communication,
                    );

                    const technicalDepth = getScore(
                      questionEvaluation.technicalDepth,
                    );

                    const relevance = getScore(questionEvaluation.relevance);

                    return (
                      <article
                        key={question._id || index}
                        className="print-question"
                      >
                        <div className="print-question-header">
                          <span className="print-question-number">
                            {index + 1}
                          </span>

                          <p className="print-question-text">
                            {question.question ||
                              question.text ||
                              "Question unavailable"}
                          </p>

                          <span className="print-question-score">
                            {questionScore}/10
                          </span>
                        </div>

                        <div className="print-question-body">
                          <div className="print-answer-grid">
                            <div className="print-answer-section">
                              <h4>Your Answer</h4>

                              <div className="print-answer-box">
                                {question.answer?.trim() ||
                                  "No answer was submitted for this question."}
                              </div>
                            </div>

                            <div className="print-answer-section">
                              <h4>AI Feedback</h4>

                              <div className="print-answer-box">
                                {questionEvaluation.feedback ||
                                  "No detailed feedback is available for this question."}
                              </div>
                            </div>
                          </div>

                          {/* Scores */}
                          <div className="print-score-grid">
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
                      </article>
                    );
                  })
                )}
              </div>
            </section>
          </main>
          <footer className="print-report-footer">
            <strong>{WEBSITE_NAME}</strong>

            <span>Your AI-powered interview preparation companion</span>
          </footer>
        </div>
      </div>
    </>
  );
};

const ResultOverlay = ({ children }) => (
  <div className="result-overlay fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 px-3 py-3 backdrop-blur-sm sm:px-6 md:py-4">
    <div className="flex min-h-full items-center justify-center">
      <main className="relative my-3 w-full max-w-5xl overflow-hidden rounded-[24px] border border-slate-700/70 bg-[#0d1324] text-slate-100 shadow-[0_30px_80px_rgba(15,23,42,0.7)] sm:my-0">
        {children}
      </main>
    </div>
  </div>
);

const LoadingState = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-950/75 backdrop-blur-sm">
    <div className="rounded-[26px] border border-slate-700/80 bg-[#0d1324] px-8 py-7 text-center text-white shadow-[0_20px_60px_rgba(15,23,42,0.5)]">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sky-500/10 ring-1 ring-sky-500/20">
        <i className="fa-solid fa-spinner fa-spin text-2xl text-sky-300" />
      </div>

      <p className="mt-4 text-sm text-slate-300">Loading interview result...</p>
    </div>
  </div>
);

const InfoBadge = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 rounded-xl border border-slate-600/80 bg-slate-800/50 px-3 py-2 text-slate-200">
    <i className={`${icon} text-sky-300`} />
    <span className="text-slate-400">{label}:</span>
    <span className="font-medium text-slate-100">{value}</span>
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
  <div className="print-badge">
    <span>{label}:</span>
    <strong>{value}</strong>
  </div>
);

const PrintScoreBadge = ({ label, score }) => (
  <div className="print-score-badge">
    <div className="print-score-badge-top">
      <span>{label}</span>
      <strong>{score}/10</strong>
    </div>

    <div className="print-progress">
      <div
        style={{
          width: `${(score / 10) * 100}%`,
        }}
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
