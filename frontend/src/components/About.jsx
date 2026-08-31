import React from "react";

const features = [
  {
    icon: "🎤",
    title: "AI Mock Interview",
    desc: "Practice realistic interview questions and improve your confidence.",
  },
  {
    icon: "📄",
    title: "AI Resume Analyzer",
    desc: "Get smart suggestions to make your resume stronger and job-ready.",
  },
  {
    icon: "🏢",
    title: "Company-Specific Practice",
    desc: "Prepare for the exact companies and roles you want to target.",
  },
  {
    icon: "📈",
    title: "Progress Tracking",
    desc: "Monitor your growth and focus on the areas that need attention.",
  },
];

const steps = [
  {
    title: "Create Account",
    desc: "Sign up quickly and create your personal prep profile.",
  },
  {
    title: "Upload Resume",
    desc: "Share your resume for AI-powered insights and analysis.",
  },
  {
    title: "Select Interview",
    desc: "Pick the interview type, role, or company you want to practice.",
  },
  {
    title: "Start AI Interview",
    desc: "Begin a smart mock interview session tailored to you.",
  },
  {
    title: "Get Personalized Feedback",
    desc: "Receive actionable tips on clarity and confidence.",
  },
  {
    title: "Track Progress",
    desc: "Review your learning journey and keep improving step by step.",
  },
];

const About = () => {
  return (
    <section
      id="about"
      className="bg-gradient-to-br from-[#f8fbff] via-[#f5f7ff] to-[#eef2ff] px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[30px] border border-blue-100 bg-white/80 p-8 shadow-[0_22px_60px_rgba(37,99,235,0.08)] backdrop-blur-xl sm:p-10 lg:p-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-[#2563EB] shadow-sm">
              About PrepPilot AI
            </div>

            <h2 className="mt-6 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Built to help you prepare smarter and interview better.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              PrepPilot AI is a smart interview preparation platform built to
              help students and professionals prepare faster, better, and with
              more confidence.
            </p>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              It brings together AI-powered mock interviews, resume analysis,
              company-specific practice, and progress tracking in one simple
              experience.
            </p>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              Whether you are preparing for your first interview or aiming for a
              bigger opportunity, PrepPilot AI supports you at every stage.
            </p>
          </div>

          <div className="mt-16">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-[#2563EB]" />
              <h3 className="text-2xl font-bold text-slate-900">
                Why PrepPilot AI?
              </h3>
            </div>

            <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-[24px] border border-slate-200 bg-gradient-to-br from-[#f8fbff] to-[#eef2ff] p-6 shadow-[0_10px_25px_rgba(15,23,42,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_35px_rgba(37,99,235,0.10)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-2xl shadow-lg shadow-blue-100">
                    <span>{feature.icon}</span>
                  </div>

                  <h4 className="mt-4 text-lg font-semibold text-slate-900">
                    {feature.title}
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-[#7C3AED]" />
              <h3 className="text-2xl font-bold text-slate-900">How It Works</h3>
            </div>

            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              From creating your account to receiving expert-style guidance,
              PrepPilot AI turns interview preparation into a smooth and
              interactive experience.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {steps.map((step, index) => (
                <React.Fragment key={step.title}>
                  <div className="group relative h-full rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_25px_rgba(15,23,42,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_35px_rgba(37,99,235,0.10)]">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-sm font-bold text-white shadow-md">
                        {index + 1}
                      </div>

                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Step
                      </span>
                    </div>

                    <h4 className="mt-4 text-lg font-semibold text-slate-900">
                      {step.title}
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {step.desc}
                    </p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;