import React from "react";

const features = [
  {
    title: "AI Mock Interviews",
    description:
      "Practice realistic interviews with instant feedback, smart follow-ups, and confidence-building questions.",
    icon: "🎤",
    accent: "from-blue-500 to-cyan-400",
    badge: "bg-blue-50 text-blue-700",
    AI: "AI-Powered",
  },
  {
    title: "AI Resume Analyzer",
    description:
      "Get actionable suggestions to improve your resume, highlight your strengths, and make it recruiter-friendly.",
    icon: "📄",
    accent: "from-violet-500 to-fuchsia-400",
    badge: "bg-violet-50 text-violet-700",
    AI: "ATS Optimized",
  },
  {
    title: "Progress Tracker",
    description:
      "Track your improvement over time with clear milestones, daily focus areas, and measurable growth insights.",
    icon: "📈",
    accent: "from-emerald-500 to-teal-400",
    badge: "bg-emerald-50 text-emerald-700",
    AI: "Track Progress",
  },
  {
    title: "Company Interview Prep",
    description:
      "Practice company-specific interview questions for Google, Amazon, Microsoft, TCS, Infosys and more.",
    icon: "🏢",
    accent: "from-amber-500 to-orange-400",
    badge: "bg-amber-50 text-amber-700",
    AI: "Company Focused",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="bg-gradient-to-br from-slate-50 via-white to-blue-50 py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
            Powerful Features
          </div>

          <h2 className="mt-6 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            Everything you need to prepare smarter and perform better
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            PrepPilot AI combines intelligent coaching, resume support, and
            progress tracking into one seamless experience.
          </p>

          <p className="mt-2 text-lg text-gray-600">
            Everything you need to prepare confidently for technical and HR interviews.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex h-full flex-col rounded-3xl border border-gray-200 bg-white p-8 shadow-lg shadow-blue-100 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex-1">
                <div
                  className={`inline-flex rounded-2xl bg-gradient-to-br ${feature.accent} p-4 text-3xl`}
                >
                  {feature.icon}
                </div>

                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {feature.description}
                </p>
              </div>

              <div className="mt-auto pt-6">
                <div
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold shadow-sm ${feature.badge}`}
                >
                  {feature.AI}
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
