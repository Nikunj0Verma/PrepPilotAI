import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const questions = [
  "Tell me about yourself and your experience with frontend development.",
  "What is the difference between state and props in React?",
  "How do you optimize the performance of a React application?",
  "Explain how you would make a website responsive.",
  "Tell me about a challenging project you worked on.",
];

const Interview = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const[totalQuestion,settotalQuestion]=useState(null);
  const [answer, setAnswer] = useState("");
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  
  useEffect(() => {
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
                
        setInterview(data.interview);
        console.log(data.interview);
        settotalQuestion(data?.interview.numberOfQuestions);
      } catch (error) {
        console.error("Error fetching interview:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id]);

  const progress =
  totalQuestion > 0
    ? ((currentQuestion + 1) / totalQuestion) * 100
    : 0;

  const handleSubmit = async (event) => {
    event.preventDefault();
  if (!answer.trim()) {
      return;
    }
    
    try {
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
            answer,
            questionIndex: currentQuestion,
          }),
        },
      );


      const data = await response.json();
      setAnswer("");

    if (currentQuestion < totalQuestion - 1) {
      setCurrentQuestion((previous) => previous + 1);
    } else {
      setCurrentQuestion(totalQuestion);
    }
    } catch (error) {
        console.error("Error submitting answer:", error);
    }
  };
  const isComplete = currentQuestion >= totalQuestion;

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <section className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 shadow-2xl shadow-blue-200">
        <div className="border-b border-white/10 px-6 py-5 text-white md:px-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-sm text-cyan-300">
                AI Mock Interview
              </p>
              <p className="mt-2 font-mono text-sm text-blue-100">
                <span className="text-cyan-300">•</span> Interview Type:{" "}
                {interview?.interviewType || "Technical"}
              </p>
              <p className="mt-1 font-mono text-sm text-blue-200">
                <span className="text-cyan-300">•</span> Job Role:{" "}
                {interview?.jobRole || "Frontend Developer"}
              </p>
              <p className="mt-1 font-mono text-sm text-blue-200"></p>
              <p className="mt-1 font-mono text-sm text-blue-200">
                <span className="text-cyan-300">•</span> Experience Level:{" "}
                {interview?.experienceLevel || "Intermediate"}
              </p>
              <p className="mt-1 font-mono text-sm text-blue-200"></p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-cyan-300">
              <i className="fa-regular fa-copy" />
            </div>
          </div>
        </div>

        <div className="px-6 py-8 md:px-10 md:py-12">
          {!isComplete ? (
            <>
              <div className="mb-8">
                <div className="flex items-center justify-between font-mono text-sm text-blue-100">
                  <span>
                    Question {currentQuestion + 1} of {totalQuestion}
                  </span>
                  <span>
                    {Math.round(
                      progress
                    )}
                    %
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
                <p className="font-mono text-base leading-8 text-white md:text-lg">
                  {interview?.questions?.[currentQuestion]?.question}
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <textarea
                  onChange={(event) => setAnswer(event.target.value)}
                  value={answer}
                  placeholder="Type your answer here..."
                  rows={5}
                  className="w-full resize-none rounded-xl border border-blue-300/30 bg-slate-950/50 p-4 font-mono text-sm leading-6 text-white outline-none placeholder:text-blue-200/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                />

                <button
                  type="submit"
                  className="mt-8 inline-flex items-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-3 font-mono text-sm font-semibold text-white transition hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {currentQuestion === totalQuestion-1
                    ? "Finish Interview"
                    : "Submit Answer"}
                  <i className="fa-solid fa-arrow-right ml-3" />
                </button>
              </form>
            </>
          ) : (
            <div className="py-10 text-center text-white">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-400/20 text-2xl text-cyan-300">
                <i className="fa-solid fa-check" />
              </div>
              <h2 className="mt-5 text-2xl font-bold">Interview Completed</h2>
              <p className="mt-2 text-blue-100">
                Your answers have been submitted successfully.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Interview;
