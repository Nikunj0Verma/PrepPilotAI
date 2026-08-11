import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const showPassword = () => {
    const next = !showPass;
    setShowPass(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    toast.info("Processing registration...", {
      position: "top-right",
      autoClose: 2000,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      theme: "light",
    });
    await new Promise((r) => setTimeout(r, 2000));
    if (payload.password !== payload.confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          password: payload.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }
      toast.success("Registered Successfully...Redirecting!!", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      toast.error(err.message || "Registration failed", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 text-slate-900">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
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
            Create your profile
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Join PrepPilot AI — prepare smarter for every interview
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Create an account and get personalized interview preparation,
            AI-powered practice, resume insights, and progress tracking in one
            place.
          </p>
          <div className="mt-10 space-y-4 text-slate-700">
            <div className="flex gap-3 items-start">
              <span className="mt-2 h-2.5 w-2.5 rounded-full bg-blue-500" />
              Practice realistic AI-powered mock interviews.
            </div>
            <div className="flex gap-3 items-start">
              <span className="mt-2 h-2.5 w-2.5 rounded-full bg-blue-500" />
              Get personalized feedback to improve your answers.
            </div>
            <div className="flex gap-3 items-start">
              <span className="mt-2 h-2.5 w-2.5 rounded-full bg-blue-500" />
              Track your interview performance and progress.
            </div>
          </div>
        </section>

        <section className="max-w-lg">
          <div className="rounded-[32px] border border-slate-200 bg-white/95 p-10 shadow-2xl shadow-slate-200/40">
            <h2 className="text-3xl font-semibold text-slate-900">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Fill details to create your PrepPilot AI account.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                  value={formData.name}
                  onChange={handleChange}
                />
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
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2 relative">
                <label className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                  value={formData.password}
                  onChange={handleChange}
                />
                <span
                  className="absolute right-3 top-9 cursor-pointer"
                  onClick={showPassword}
                >
                  <img
                    className="p-1"
                    width={26}
                    src={
                      showPass ? "./images/eyecross.png" : "./images/eye.png"
                    }
                    alt="toggle password"
                  />
                </span>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 cursor-pointer"
              >
                Create Account
              </button>

              <div className="mt-6 border-t border-slate-200 pt-5 text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:text-blue-700"
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
