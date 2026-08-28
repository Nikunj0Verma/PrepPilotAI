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
          (question) => !question.answer?.trim(),
        );

        setCurrentQuestion(
          firstUnansweredIndex === -1
            ? interviewQuestions.length
            : firstUnansweredIndex,
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

  const isComplete =
    totalQuestions > 0 && currentQuestion >= totalQuestions;

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

    // Store the form before await because event.currentTarget becomes null later.
    const form = event.currentTarget;
    const answer = form.elements.answer.value.trim();

    if (!answer || submitting || !questions[currentQuestion]) {
      return;
    }

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

      // Clear the textbox after the answer is successfully submitted.
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
          evaluationData.message || "Failed to evaluate interview",
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
        className={`fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 px-3 py-5 backdrop-blur-sm sm:px-6 md:py-8 ${
          submitting ? "pointer-events-none select-none" : ""
        }`}
      >
        <div className="flex min-h-full items-center justify-center">
          <main className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-blue-900/80 bg-[#080d2d] text-white shadow-2xl shadow-slate-950/60">
            <header className="border-b border-white/10 px-5 py-4 sm:px-7">
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                aria-label="Close interview"
                className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm text-slate-400 transition hover:bg-red-500/20 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <i className="fa-solid fa-xmark" />
              </button>

              <div className="flex items-center gap-3 pr-12">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 text-sm shadow-lg shadow-blue-500/20">
                  <i className="fa-solid fa-microphone-lines" />
                </div>

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-cyan-300">
                    AI-powered preparation
                  </p>

                  <h1 className="text-base font-bold sm:text-lg">
                    AI Mock Interview
                  </h1>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-[10px] sm:text-xs">
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

            <section className="p-4 sm:p-6 md:p-7">
              {error && (
                <div className="mb-5 rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {totalQuestions === 0 && (
                <EmptyState onBack={() => navigate("/interview-prep")} />
              )}

              {totalQuestions > 0 && !isComplete && (
                <>
                  <div className="mb-5 rounded-xl border border-white/10 bg-[#101747] p-3 sm:p-4">
                    <div className="mb-2 flex items-center justify-between text-[11px] font-medium text-slate-300">
                      <span>
                        Question {currentQuestion + 1} of {totalQuestions}
                      </span>

                      <span>{Math.round(progress)}%</span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[#20285c]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-indigo-500/20 bg-gradient-to-br from-[#171b55] to-[#111542] p-5 sm:p-7">
                    <div className="mb-5 flex items-start gap-3">
                      <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-cyan-300">
                        <i className="fa-solid fa-robot" />
                      </div>

                      <div>
                        <p className="text-[10px] font-medium text-cyan-300">
                          AI Interviewer
                        </p>

                        <h2 className="mt-1 text-lg font-semibold leading-6 text-white sm:text-xl">
                          {questions[currentQuestion]?.question}
                        </h2>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                      <div className="mb-2">
                        <label
                          htmlFor="answer"
                          className="text-xs font-semibold text-slate-300"
                        >
                          Type Answer
                        </label>
                      </div>

                      <textarea
                        id="answer"
                        name="answer"
                        defaultValue={questions[currentQuestion]?.answer || ""}
                        placeholder="Type your answer here..."
                        rows={5}
                        disabled={submitting}
                        className="w-full resize-none rounded-lg border border-blue-400/20 bg-[#080d2d] p-4 text-sm leading-6 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                      />

                      <div className="mt-4 flex justify-end">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="cursor-pointer rounded-lg bg-gradient-to-r from-blue-500 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
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

                  <p className="mt-4 text-center text-[10px] text-slate-500">
                    <i className="fa-solid fa-lock mr-1" />
                    Your answer will be analyzed securely by our AI interviewer.
                  </p>
                </>
              )}

              {isComplete && (
                <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15 text-2xl text-green-400">
                    <i className="fa-solid fa-check" />
                  </div>

                  <h2 className="mt-5 text-2xl font-bold">
                    Interview Completed!
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Your answers have been evaluated successfully.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate(`/interview/${id}/result`)}
                    className="mt-6 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold transition hover:bg-blue-500"
                  >
                    View Result
                    <i className="fa-solid fa-arrow-right ml-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/interview-prep")}
                    className="mt-3 rounded-lg border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10"
                  >
                    Back to Interview Prep
                  </button>
                </div>
              )}
            </section>

            <footer className="border-t border-white/10 bg-[#060a25] px-5 py-3 text-center text-[10px] text-slate-500 sm:px-7">
              <i className="fa-solid fa-sparkles mr-1 text-violet-400" />
              Take your time, stay focused, and answer naturally.
            </footer>

            {showLeaveConfirm && !submitting && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#050923]/85 p-5 backdrop-blur-sm">
                <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111747] p-6 text-center shadow-2xl shadow-black/50">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/15 text-xl text-amber-400">
                    <i className="fa-solid fa-triangle-exclamation" />
                  </div>

                  <h2 className="mt-4 text-lg font-bold">Leave interview?</h2>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Your submitted answers have been saved. Do you want to
                    leave?
                  </p>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowLeaveConfirm(false)}
                      className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/10"
                    >
                      Continue
                    </button>

                    <button
                      type="button"
                      onClick={handleLeave}
                      className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold transition hover:bg-red-600"
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
    <div className="text-center text-white">
      <i className="fa-solid fa-spinner fa-spin text-3xl text-cyan-400" />

      <p className="mt-4 text-sm text-slate-400">
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
    <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#0b1238] p-8 text-center text-white shadow-2xl shadow-blue-950/60">
      <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cyan-400/10 ring-1 ring-cyan-400/30">
        <div className="absolute inset-0 animate-ping rounded-full bg-cyan-400/10" />

        <i className="fa-solid fa-spinner fa-spin relative text-3xl text-cyan-300" />
      </div>

      <h2 className="mt-6 text-2xl font-extrabold">
        Processing Answer...
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        Your answer is being submitted and analyzed. Please wait.
      </p>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-700">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500" />
      </div>
    </div>
  </div>
);

const EmptyState = ({ onBack }) => (
  <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
    <i className="fa-solid fa-circle-exclamation text-3xl text-amber-400" />

    <h2 className="mt-4 text-xl font-bold">No questions available</h2>

    <p className="mt-2 text-sm text-slate-400">
      This interview does not contain any questions.
    </p>

    <button
      type="button"
      onClick={onBack}
      className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-blue-500"
    >
      Back to Interview Prep
    </button>
  </div>
);

const InfoBadge = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-slate-300">
    <i className={`${icon} text-cyan-400`} />
    <span className="text-slate-500">{label}:</span>
    <span className="font-medium text-cyan-200">{value}</span>
  </div>
);

export default Interview;