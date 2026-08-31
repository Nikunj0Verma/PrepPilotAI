import React from "react";

const features = [
  {
    title: "AI Mock Interviews",
    description:
      "Practice realistic interviews with instant AI feedback, smart follow-ups, and confidence-building guidance.",
    icon: "🎤",
    accent: "from-[#2563EB] to-[#22D3EE]",
    badge: "bg-blue-50 text-blue-700 border border-blue-100",
    aiLabel: "AI-Powered",
  },
  {
    title: "AI Resume Analyzer",
    description:
      "Get actionable suggestions to improve your resume, highlight key strengths, and make it recruiter-ready.",
    icon: "📄",
    accent: "from-[#7C3AED] to-[#A855F7]",
    badge: "bg-violet-50 text-violet-700 border border-violet-100",
    aiLabel: "ATS Optimized",
  },
  {
    title: "Progress Tracker",
    description:
      "Monitor your growth with milestones, skill scores, and clear indicators of improvement over time.",
    icon: "📈",
    accent: "from-[#10B981] to-[#14B8A6]",
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    aiLabel: "Track Progress",
  },
  {
    title: "Company Interview Prep",
    description:
      "Practice company-specific interview questions for top employers like Google, Amazon, Microsoft, TCS, and Infosys.",
    icon: "🏢",
    accent: "from-[#F59E0B] to-[#F97316]",
    badge: "bg-amber-50 text-amber-700 border border-amber-100",
    aiLabel: "Company Focused",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="bg-gradient-to-br from-[#f8fbff] via-white to-[#eef2ff] py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center rounded-full border border-blue-200 bg-white/90 px-4 py-2 text-sm font-semibold text-[#2563EB] shadow-sm">
            Powerful Features
          </div>

          <h2 className="mt-6 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to prepare smarter and perform better
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            PrepPilot AI brings together intelligent interview practice,
            resume support, and progress tracking in one seamless experience.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group flex h-full flex-col rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-[0_20px_45px_rgba(37,99,235,0.12)]"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.accent} text-2xl shadow-[0_12px_25px_rgba(37,99,235,0.2)]`}
                >
                  <span>{feature.icon}</span>
                </div>

                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${feature.badge}`}
                >
                  {feature.aiLabel}
                </span>
              </div>

              <div className="mt-6 flex-1">
                <h3 className="text-xl font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {feature.description}
                </p>
              </div>

              <div className="mt-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#2563EB]">
                  <span className="h-2 w-2 rounded-full bg-[#2563EB]" />
                  Learn more
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;