import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const showPassword = () => {
    setShowPass((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-right",
        autoClose: 4000,
        theme: "light",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success("Registered successfully! Redirecting...", {
        position: "top-right",
        autoClose: 2500,
        theme: "light",
      });

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.message || "Registration failed", {
        position: "top-right",
        autoClose: 4000,
        theme: "light",
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbff] via-white to-[#eef2ff] text-slate-900">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex cursor-pointer items-center gap-3 transition hover:opacity-90"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] via-[#3B82F6] to-[#7C3AED] text-lg font-black text-white shadow-[0_12px_25px_rgba(59,130,246,0.35)]">
            P
          </div>

          <span className="bg-gradient-to-r from-[#1d4ed8] to-[#7C3AED] bg-clip-text text-xl font-bold tracking-tight text-transparent">
            PrepPilot AI
          </span>
        </Link>

        <Link
          to="/"
          className="hidden cursor-pointer rounded-full border border-[#2563EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#2563EB] shadow-sm transition hover:bg-[#2563EB] hover:text-white sm:inline-flex"
        >
          Back to Home
        </Link>
      </header>

      <main className="mx-auto grid w-full max-w-7xl gap-10 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-8">
        <section className="rounded-[30px] border border-blue-100 bg-white/85 p-6 shadow-[0_25px_60px_rgba(37,99,235,0.10)] backdrop-blur-sm sm:p-8 lg:p-10">
          <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-[#2563EB]">
            Create your profile
          </span>

          <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Join <span className="text-[#2563EB]">PrepPilot AI</span> and start
            preparing smarter
          </h1>

          <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            Create an account to access personalized interview practice, resume
            insights, and company-focused preparation tailored to your goals.
          </p>

          <div className="mt-8 space-y-4">
            {[
              "Practice realistic AI-powered mock interviews.",
              "Get personalized feedback and improvement suggestions.",
              "Track your interview performance and stay consistent.",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-slate-700"
              >
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#2563EB]" />
                <span className="text-sm leading-7 sm:text-base">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-lg">
          <div className="rounded-[32px] border border-slate-200 bg-white/95 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.08)] sm:p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
              <p className="mt-2 text-sm text-slate-500">
                Fill in your details to get started.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    First Name
                  </label>

                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-200"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Last Name
                  </label>

                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-200"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-200"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm text-slate-900 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-200"
                    value={formData.password}
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    aria-label={showPass ? "Hide password" : "Show password"}
                    onClick={showPassword}
                    className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full p-1 transition hover:bg-slate-200"
                  >
                    <img
                      className="h-5 w-5"
                      src={showPass ? "./images/eyecross.png" : "./images/eye.png"}
                      alt="toggle password"
                    />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Confirm Password
                </label>

                <input
                  type={showPass ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-200"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="w-full cursor-pointer rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(37,99,235,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_35px_rgba(37,99,235,0.35)]"
              >
                Create Account
              </button>

              <div className="flex items-center justify-center gap-2 border-t border-slate-200 pt-5 text-sm text-slate-500">
                <span>Already have an account?</span>
                <Link
                  to="/login"
                  className="cursor-pointer font-semibold text-[#2563EB] transition hover:text-[#1d4ed8]"
                >
                  Log in
                </Link>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Register;