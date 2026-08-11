import React from "react"

const DashboardPreview = () => {
  return (
    <div className="relative mx-auto w-full max-w-xl h-[500px] ">
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-blue-400/30 via-indigo-400/20 to-cyan-400/30 blur-3xl" />
      <div className="relative mt-20 overflow-hidden rounded-[2rem] border border-white/80 bg-white p-4 shadow-2xl shadow-blue-200">
        <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">PrepPilot AI</p>
              <h3 className="text-lg font-semibold">Study Dashboard</h3>
            </div>
            <div className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300">
              Live
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl bg-slate-900/70 p-4">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Weekly Progress</span>
                <span className="font-semibold text-emerald-400">+18%</span>
              </div>
              <div className="mt-4 flex h-28 items-end gap-2">
                {[40, 65, 55, 80, 72, 90, 85].map((height, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-t-xl bg-gradient-to-t from-blue-500 to-cyan-400"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl bg-white/10 p-3">
                <p className="text-sm text-slate-400">Today's focus</p>
                <p className="mt-1 text-lg font-semibold">Math Revision</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3">
                <p className="text-sm text-slate-400">AI tutor</p>
                <p className="mt-1 text-lg font-semibold">3 new hints</p>
              </div>
              <div className="rounded-2xl bg-blue-500/20 p-3">
                <p className="text-sm text-blue-200">Next milestone</p>
                <p className="mt-1 text-lg font-semibold">Mock test ready</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-20 lg:py-28">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/70 via-transparent to-indigo-100/70" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center rounded-full border border-blue-200 bg-white/70 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm backdrop-blur">
            Prepare Smarter with AI
          </div>

          <h1 className="mt-6 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Ace Every Interview{" "}
            <span className="text-blue-600 text-[34px]">with AI</span>
          </h1>

          <div className="mt-6 space-y-2 text-lg text-gray-600">
            <p>Practice mock interviews, improve your resume, and</p>
            <p>receive personalized AI feedback to land your dream job.</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/signup"
              className="inline-flex items-center rounded-full bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition hover:bg-blue-700"
            >
              Get Started
            </a>
            <a
              href="#features"
              className="inline-flex items-center rounded-full border border-blue-600 px-6 py-3 text-lg font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
            >
              Watch Demo
            </a>
          </div>
          <div className="mt-6 space-y-3 text-lg text-gray-600"> 
            <p><i className="fa-solid fa-check text-[#7d6bc3]"></i> AI Resume Analysis</p>
            <p><i className="fa-solid fa-check text-[#7d6bc3]"></i> Personalized Interview Practice</p>
            <p><i className="fa-solid fa-check text-[#7d6bc3]"></i> Real-time Feedback</p>
          </div>
        </div>

        <div className="w-full">
          <DashboardPreview />
        </div>
      </div>
      
    </section>
  )
}

export default HeroSection