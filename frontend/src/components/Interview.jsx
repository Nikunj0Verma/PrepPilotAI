// filepath: d:\Users\NIKUNJ\OneDrive\Codes\Projects\PrepPilot AI\frontend\src\components\Interview.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Interview = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalQuestion, setTotalQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    const fetchInterview = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:5000/api/interview/start/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch interview");
        }
        const interviewData = data.interview;

        setInterview(interviewData);
        setTotalQuestion(interviewData.questions?.length || 0);

        const firstUnansweredIndex = interviewData.questions.findIndex(
          (q) => !q.answer || !q.answer.trim(),
        );

        const startIndex =
          firstUnansweredIndex === -1
            ? interviewData.questions.length
            : firstUnansweredIndex;

        setCurrentQuestion(startIndex);
      } catch (fetchError) {
        console.error("Error fetching interview:", fetchError);
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id]);

  const questions = interview?.questions || [];
  const isComplete = totalQuestion > 0 && currentQuestion >= totalQuestion;

  const progress = totalQuestion
    ? ((currentQuestion + 1) / totalQuestion) * 100
    : 0;

  const handleClose = () => {
    setShowLeaveConfirm(true);
  };

  const handleContinue = () => {
    setShowLeaveConfirm(false);
  };

  const handleLeave = () => {
    setShowLeaveConfirm(false);
    navigate("/interview-prep");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!answer.trim() || submitting) return;

    try {
      setSubmitting(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/interview/start/${id}/answer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            answer: answer.trim(),
            questionIndex: currentQuestion,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit answer");
      }

      setAnswer("");

      if (currentQuestion < totalQuestion - 1) {
        setCurrentQuestion((previous) => previous + 1);
      } else {
        setCurrentQuestion(totalQuestion);
      }
    } catch (submitError) {
      console.error("Error submitting answer:", submitError);
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 px-3 py-5 backdrop-blur-sm sm:px-6 md:py-8">
      <div className="flex min-h-full items-center justify-center">
        <main className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-blue-900/80 bg-[#080d2d] text-white shadow-2xl shadow-slate-950/60">
          <header className="border-b border-white/10 px-5 py-4 sm:px-7">
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close interview"
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm text-slate-400 transition hover:bg-red-500/20 hover:text-red-300"
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
            {loading && (
              <div className="flex min-h-[380px] flex-col items-center justify-center">
                <i className="fa-solid fa-spinner fa-spin text-3xl text-cyan-400" />
                <p className="mt-4 text-sm text-slate-400">
                  Preparing your interview...
                </p>
              </div>
            )}

            {!loading && error && (
              <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
                <i className="fa-solid fa-circle-exclamation text-3xl text-red-400" />
                <p className="mt-4 text-sm text-red-300">{error}</p>

                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-5 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold transition hover:bg-blue-500"
                >
                  Back to Interview Prep
                </button>
              </div>
            )}

            {!loading && !error && !isComplete && (
              <>
                <div className="mb-5 rounded-xl border border-white/10 bg-[#101747] p-3 sm:p-4">
                  <div className="mb-2 flex items-center justify-between text-[11px] font-medium text-slate-300">
                    <span>
                      Question {currentQuestion + 1} of {totalQuestion}
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

                      <h2 className="mt-1 text-lg font-semibold leading-5 text-white sm:text-xl">
                        {questions[currentQuestion]?.question ||
                          "Answer the interview question below."}
                      </h2>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="answer"
                        className="text-xs font-semibold text-slate-300"
                      >
                        Type Answer
                      </label>

                      <span className="text-[10px] text-slate-500">
                        {answer.length} characters
                      </span>
                    </div>

                    <textarea
                      id="answer"
                      value={answer}
                      onChange={(event) => setAnswer(event.target.value)}
                      placeholder="Type your answer here..."
                      rows={5}
                      className="w-full resize-none rounded-lg border border-blue-400/20 bg-[#080d2d] p-4 text-sm leading-6 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                    />

                    {error && (
                      <p className="mt-2 text-xs text-red-400">{error}</p>
                    )}

                    <div className="mt-4 flex justify-end">
                      <button
                        type="submit"
                        disabled={!answer.trim() || submitting}
                        className="rounded-lg bg-gradient-to-r from-blue-500 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {submitting
                          ? "Submitting..."
                          : currentQuestion === totalQuestion - 1
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

            {!loading && !error && isComplete && (
              <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15 text-2xl text-green-400">
                  <i className="fa-solid fa-check" />
                </div>

                <h2 className="mt-5 text-2xl font-bold">
                  Interview Completed!
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Your answers have been submitted successfully.
                </p>

                <button
                  type="button"
                  onClick={handleLeave}
                  className="mt-6 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold transition hover:bg-blue-500"
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

          {showLeaveConfirm && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#050923]/85 p-5 backdrop-blur-sm">
              <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111747] p-6 text-center shadow-2xl shadow-black/50">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/15 text-xl text-amber-400">
                  <i className="fa-solid fa-triangle-exclamation" />
                </div>

                <h2 className="mt-4 text-lg font-bold text-white">
                  Leave interview?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Your current progress have been saved. Do you want to leave
                  this interview?
                </p>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={handleContinue}
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                  >
                    Continue
                  </button>

                  <button
                    type="button"
                    onClick={handleLeave}
                    className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
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
  );
};

const InfoBadge = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-slate-300">
    <i className={`${icon} text-cyan-400`} />
    <span className="text-slate-500">{label}:</span>
    <span className="font-medium text-cyan-200">{value}</span>
  </div>
);

export default Interview;
