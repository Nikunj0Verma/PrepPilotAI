import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api/interview";

const Interview = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  useEffect(() => {
    const scrollY = window.scrollY;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const fetchInterview = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/start/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch interview");
        }

        const interviewData = data.interview;
        const interviewQuestions = interviewData.questions || [];

        setInterview(interviewData);

        const firstUnansweredIndex = interviewQuestions.findIndex(
          (question) => !question.answer?.trim()
        );

        setCurrentQuestion(
          firstUnansweredIndex === -1
            ? interviewQuestions.length
            : firstUnansweredIndex
        );
      } catch (fetchError) {
        console.error("Error fetching interview:", fetchError);
        setError(fetchError.message || "Failed to fetch interview");
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id]);

  useEffect(() => {
    document.body.style.overflow = submitting ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [submitting]);

  const questions = interview?.questions || [];
  const totalQuestions = questions.length;
  const isComplete = totalQuestions > 0 && currentQuestion >= totalQuestions;
  const progress = totalQuestions
    ? Math.min((currentQuestion / totalQuestions) * 100, 100)
    : 0;

  const handleClose = () => {
    if (submitting) return;

    if (isComplete) {
      navigate("/interview-prep");
      return;
    }

    setShowLeaveConfirm(true);
  };

  const handleLeave = () => {
    if (submitting) return;

    setShowLeaveConfirm(false);
    navigate("/interview-prep");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const answer = form.elements.answer.value.trim();

    if (!answer || submitting || !questions[currentQuestion]) return;

    try {
      setSubmitting(true);
      setError("");

      const token = localStorage.getItem("token");

      const answerResponse = await fetch(`${API_URL}/start/${id}/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          answer,
          questionIndex: currentQuestion,
        }),
      });

      const answerData = await answerResponse.json();

      if (!answerResponse.ok) {
        throw new Error(answerData.message || "Failed to submit answer");
      }

      form.reset();

      const isLastQuestion = currentQuestion === totalQuestions - 1;

      if (!isLastQuestion) {
        setInterview((previousInterview) => {
          if (!previousInterview) return previousInterview;

          const updatedQuestions = [...previousInterview.questions];

          updatedQuestions[currentQuestion] = {
            ...updatedQuestions[currentQuestion],
            answer,
          };

          return {
            ...previousInterview,
            questions: updatedQuestions,
          };
        });

        setCurrentQuestion((previous) => previous + 1);
        return;
      }

      const evaluationResponse = await fetch(`${API_URL}/${id}/evaluate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const evaluationData = await evaluationResponse.json();

      if (!evaluationResponse.ok) {
        throw new Error(
          evaluationData.message || "Failed to evaluate interview"
        );
      }

      setInterview(evaluationData.interview || interview);
      setCurrentQuestion(totalQuestions);
    } catch (submitError) {
      console.error("Interview submission error:", submitError);
      setError(submitError.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <>
      <div
        aria-busy={submitting}
        className={`fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 px-3 py-3 backdrop-blur-sm sm:px-6 md:py-4 ${
          submitting ? "pointer-events-none select-none" : ""
        }`}
      >
        <div className="flex min-h-full items-center justify-center">
          <main className="relative w-full max-w-5xl overflow-hidden rounded-[24px] border border-slate-700/70 bg-[#0d1324] text-slate-100 shadow-[0_30px_80px_rgba(15,23,42,0.7)]">
            <header className="border-b border-slate-700/60 bg-gradient-to-r from-[#101827] via-[#121d31] to-[#0d1426] px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                aria-label="Close interview"
                className="absolute right-5 top-4 flex h-9 w-9 items-center justify-center rounded-xl border border-slate-600/80 bg-slate-800/70 text-slate-300 transition hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <i className="fa-solid fa-xmark text-sm" />
              </button>

              <div className="flex items-center gap-3 pr-12">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-slate-100 ring-1 ring-slate-600/80">
                  <i className="fa-solid fa-microphone-lines text-base" />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300">
                    AI-powered prep
                  </p>
                  <h1 className="mt-1 text-lg font-semibold sm:text-xl">
                    AI Mock Interview
                  </h1>
                </div>
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
              </div>
            </header>

            <section className="p-4 sm:p-5 md:p-6">
              {error && (
                <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              {totalQuestions === 0 && (
                <EmptyState onBack={() => navigate("/interview-prep")} />
              )}

              {totalQuestions > 0 && !isComplete && (
                <>
                  <div className="mb-4 rounded-2xl border border-slate-700/70 bg-[#111c2f] p-4 shadow-inner shadow-slate-950/40">
                    <div className="mb-2 flex items-center justify-between text-[11px] font-medium text-slate-300">
                      <span>
                        Question {currentQuestion + 1} of {totalQuestions}
                      </span>
                      <span className="rounded-full bg-sky-500/10 px-2 py-1 text-sky-300">
                        {Math.round(progress)}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="rounded-[22px] border border-slate-700/70 bg-gradient-to-br from-[#121c2d] via-[#101a2f] to-[#0b1223] p-4 shadow-[0_20px_45px_rgba(15,23,42,0.35)] sm:p-6">
                    <div className="mb-4 flex items-start gap-4">
                      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-500/10 text-xl text-sky-300 ring-1 ring-sky-500/20">
                        <i className="fa-solid fa-robot" />
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-300">
                          AI Interviewer
                        </p>
                        <h2 className="mt-1 text-xl font-semibold leading-7 text-slate-100 sm:text-2xl">
                          {questions[currentQuestion]?.question}
                        </h2>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                      <div className="mb-2">
                        <label
                          htmlFor="answer"
                          className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-300"
                        >
                          Your Answer
                        </label>
                      </div>

                      <textarea
                        id="answer"
                        name="answer"
                        defaultValue={questions[currentQuestion]?.answer || ""}
                        placeholder="Type your answer here..."
                        rows={5}
                        disabled={submitting}
                        className="w-full resize-none rounded-2xl border border-slate-600/80 bg-[#0a1220] p-4 text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      />

                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-slate-400">
                          <i className="fa-solid fa-shield-halved mr-2 text-sky-300" />
                          Your answer is analyzed securely.
                        </p>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(37,99,235,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {submitting
                            ? "Processing..."
                            : currentQuestion === totalQuestions - 1
                              ? "Finish Interview"
                              : "Submit Answer"}
                          {!submitting && (
                            <i className="fa-solid fa-arrow-right ml-3" />
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              )}

              {isComplete && (
                <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-3xl text-emerald-400 ring-1 ring-emerald-500/20">
                    <i className="fa-solid fa-check" />
                  </div>

                  <h2 className="mt-4 text-3xl font-bold text-white">
                    Interview Completed
                  </h2>

                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                    Your answers have been evaluated successfully. You can now
                    review the result.
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/interview/${id}/result`, { replace: true })
                      }
                      className="rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
                    >
                      View Result
                      <i className="fa-solid fa-arrow-right ml-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/interview-prep")}
                      className="rounded-xl border border-slate-600/80 bg-slate-800/60 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700/70"
                    >
                      Back to Interview Prep
                    </button>
                  </div>
                </div>
              )}
            </section>

            <footer className="border-t border-slate-700/60 bg-[#0a1220] px-5 py-3 text-center text-[11px] text-slate-400 sm:px-7">
              <i className="fa-solid fa-sparkles mr-2 text-violet-400" />
              Take your time, stay focused, and answer naturally.
            </footer>

            {showLeaveConfirm && !submitting && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#050b16]/85 p-5 backdrop-blur-sm">
                <div className="w-full max-w-sm rounded-[26px] border border-slate-600/80 bg-[#111827] p-6 text-center shadow-2xl shadow-black/40">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-2xl text-amber-400 ring-1 ring-amber-500/20">
                    <i className="fa-solid fa-triangle-exclamation" />
                  </div>

                  <h2 className="mt-5 text-xl font-bold text-white">
                    Leave interview?
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Your submitted answers have been saved. Do you want to
                    leave?
                  </p>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowLeaveConfirm(false)}
                      className="flex-1 rounded-xl border border-slate-600/80 bg-slate-800/60 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700/70"
                    >
                      Continue
                    </button>

                    <button
                      type="button"
                      onClick={handleLeave}
                      className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
                    >
                      Leave
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {submitting && <SubmittingOverlay />}
    </>
  );
};

const LoadingState = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
    <div className="rounded-[26px] border border-slate-700/80 bg-[#0d1324] px-8 py-7 text-center text-white shadow-[0_20px_60px_rgba(15,23,42,0.5)]">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sky-500/10 ring-1 ring-sky-500/20">
        <i className="fa-solid fa-spinner fa-spin text-2xl text-sky-300" />
      </div>

      <p className="mt-4 text-sm text-slate-300">
        Preparing your interview...
      </p>
    </div>
  </div>
);

const SubmittingOverlay = () => (
  <div
    role="dialog"
    aria-modal="true"
    aria-label="Processing answer"
    className="fixed inset-0 z-[9999] flex cursor-wait items-center justify-center bg-slate-950/85 p-5 backdrop-blur-md"
  >
    <div className="w-full max-w-sm rounded-[28px] border border-slate-700/80 bg-[#0b1220] p-8 text-center text-white shadow-2xl shadow-slate-950/60">
      <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sky-500/10 ring-1 ring-sky-400/20">
        <div className="absolute inset-0 animate-ping rounded-full bg-sky-400/10" />
        <i className="fa-solid fa-spinner fa-spin relative text-3xl text-sky-300" />
      </div>

      <h2 className="mt-6 text-2xl font-extrabold">Processing Answer...</h2>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        Your answer is being submitted and analyzed. Please wait.
      </p>

      <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-slate-700">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500" />
      </div>
    </div>
  </div>
);

const EmptyState = ({ onBack }) => (
  <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
    <i className="fa-solid fa-circle-exclamation text-3xl text-amber-400" />

    <h2 className="mt-4 text-xl font-bold text-white">No questions available</h2>

    <p className="mt-2 text-sm text-slate-400">
      This interview does not contain any questions.
    </p>

    <button
      type="button"
      onClick={onBack}
      className="mt-5 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500"
    >
      Back to Interview Prep
    </button>
  </div>
);

const InfoBadge = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 rounded-xl border border-slate-600/80 bg-slate-800/50 px-3 py-2 text-slate-200">
    <i className={`${icon} text-sky-300`} />
    <span className="text-slate-400">{label}:</span>
    <span className="font-medium text-slate-100">{value}</span>
  </div>
);

export default Interview;