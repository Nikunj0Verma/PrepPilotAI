import React from "react";


const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#f8fbff] via-white to-[#eef2ff] py-20 lg:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.10),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(124,58,237,0.08),_transparent_30%)]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="max-w-2xl">
          <div className="inline-flex cursor-pointer items-center rounded-full border border-blue-200 bg-white/90 px-4 py-2 text-sm font-semibold text-[#2563EB] shadow-sm backdrop-blur">
            Prepare Smarter with AI
          </div>

          <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            <span className="block">Prepare Smarter.</span>
            <span className="block text-[#2563EB]">Interview Better.</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            AI-powered interview practice, resume analysis, and company
            preparation — all in one place.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/signup"
              className="inline-flex cursor-pointer items-center rounded-full bg-[#2563EB] px-6 py-3 text-lg font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,0.35)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#1d4ed8]"
            >
              Get Started
            </a>

            <a
              href="#features"
              className="inline-flex cursor-pointer items-center rounded-full border border-[#2563EB] bg-white px-6 py-3 text-lg font-semibold text-[#2563EB] transition duration-200 hover:-translate-y-0.5 hover:bg-[#2563EB] hover:text-white"
            >
              Watch Demo
            </a>
          </div>

          <div className="mt-7 flex items-center gap-3 text-base font-medium text-slate-700">
            <span className="h-5 w-1 rounded-full bg-gradient-to-b from-[#2563EB] to-[#7C3AED]" />
            <span className="tracking-wide">
              AI-powered • Personalized • Built for job seekers
            </span>
          </div>

          <div className="mt-8 space-y-3 text-lg text-slate-600">
            <p className="flex items-center gap-3">
              <i className="fa-solid fa-check text-[#7C3AED]" />
              AI Mock Interviews
            </p>
            <p className="flex items-center gap-3">
              <i className="fa-solid fa-check text-[#7C3AED]" />
              Resume Analysis
            </p>
            <p className="flex items-center gap-3">
              <i className="fa-solid fa-check text-[#7C3AED]" />
              Company Preparation
            </p>
          </div>
        </div>

        <div className="w-full">
          <img className="rounded-4xl border-1" src="images/image.png" alt="" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;