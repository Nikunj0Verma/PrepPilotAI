import React from 'react'

const PublicNavbar = () => {
  return (
    <nav className="w-full border-b border-gray-200 bg-white fixed z-50 top-0 backdrop-blur-md bg-white/50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <a
          href="/"
          className="flex items-center gap-3 text-xl font-semibold tracking-tight text-gray-900 transition hover:scale-[1.02]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 text-lg font-black text-white shadow-lg shadow-blue-200">
            P
          </div>
          
          <span className="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
            PrepPilot AI
          </span>
        </a>

        <div className="hidden items-center gap-6 md:flex">
          <a
            href="#features"
            className="group relative text-sm font-medium text-gray-600 transition hover:text-blue-600"
          >
            <span className="relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 group-hover:after:w-full">
              Features
            </span>
          </a>
          <a
            href="#about"
            className="group relative text-sm font-medium text-gray-600 transition hover:text-blue-600"
          >
            <span className="relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 group-hover:after:w-full">
              About
            </span>
          </a>
          <a
            href="#contact"
            className="group relative text-sm font-medium text-gray-600 transition hover:text-blue-600"
          >
            <span className="relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 group-hover:after:w-full">
              Contact
            </span>
          </a>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="rounded-full border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
          >
            Login
          </a>
          <a
            href="/signup"
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  )
}

export default PublicNavbar