
import React from "react";

const PublicNavbar = () => {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 lg:px-8">
        <a
          href="/"
          className="group flex cursor-pointer items-center gap-3 text-xl font-semibold tracking-tight text-slate-900 transition hover:scale-[1.01]"
        >
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 shadow-[0_10px_25px_rgba(59,130,246,0.35)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.45),_transparent_40%)]" />
            <span className="relative text-lg font-black text-white">P</span>
          </div>

          <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 bg-clip-text text-transparent">
            PrepPilot AI
          </span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          <a
            href="#features"
            className="group relative cursor-pointer text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            <span className="relative after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 group-hover:after:w-full">
              Features
            </span>
          </a>

          <a
            href="#about"
            className="group relative cursor-pointer text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            <span className="relative after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 group-hover:after:w-full">
              About
            </span>
          </a>

          <a
            href="#contact"
            className="group relative cursor-pointer text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            <span className="relative after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 group-hover:after:w-full">
              Contact
            </span>
          </a>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="cursor-pointer rounded-full border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
          >
            Login
          </a>

          <a
            href="/signup"
            className="cursor-pointer rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(59,130,246,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(59,130,246,0.45)]"
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;