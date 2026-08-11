import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/dashboard");
  };

  const showPassword = () => {
    const next = !showPass;
    setShowPass(next);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 text-slate-900">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link
          to="/"
          className="flex items-center gap-3 text-xl font-semibold tracking-tight transition hover:opacity-90"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 text-lg font-black text-white shadow-lg shadow-blue-200">
            P
          </div>
          <span className="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
            PrepPilot AI
          </span>
        </Link>

        <Link
          to="/"
          className="rounded-full border border-blue-600 bg-white px-5 py-2.5 text-sm font-semibold text-blue-600 shadow-sm transition hover:bg-blue-600 hover:text-white"
        >
          Back to Home
        </Link>
      </header>

      <main className="mx-auto grid w-full max-w-7xl gap-10 px-6 pb-16 md:grid-cols-[1.2fr_0.9fr] md:items-center">
        <section className="rounded-[32px] border border-blue-200/80 bg-white/90 p-10 shadow-2xl shadow-blue-200/20">
          <span className="inline-flex rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
            Welcome back!
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Continue your PrepPilot AI journey
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Sign in to access personalized interview prep, smart study
            recommendations, and progress tracking designed to help you prepare
            faster and smarter.
          </p>

          <div className="mt-10 space-y-4 text-slate-700">
            <div className="flex gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-500" />
              Personalized AI guidance for every step of your learning journey.
            </div>
            <div className="flex gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-500" />
              Track your progress clearly and stay motivated with real-time
              insights.
            </div>
            <div className="flex gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-500" />
              Jump back in with a clean, focused login experience.
            </div>
          </div>
        </section>

        <section className="max-w-lg">
          <div className="rounded-[32px] border border-slate-200 bg-white/95 p-10 shadow-2xl shadow-slate-200/40">
            <h2 className="text-3xl font-semibold text-slate-900">Login</h2>
            <p className="mt-2 text-sm text-slate-500">
              Enter your email and password to continue.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div className="space-y-2 relative">
                <label className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                />
                <span className="absolute right-3 top-9  cursor-pointer">
                  <img
                    className="p-1 text-black"
                    width={26}
                    src={
                      showPass ? "./images/eyecross.png" : "./images/eye.png"
                    }
                    alt="toggle password"
                    onClick={showPassword}
                  />
                </span>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700  cursor-pointer"
              >
                Login
              </button>

              <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 text-sm text-slate-500 sm:flex-row sm:justify-between">
                <Link to="/forgot-password" className="hover:text-slate-900">
                  Forgot password?
                </Link>
                <Link
                  to="/signup"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Login;
