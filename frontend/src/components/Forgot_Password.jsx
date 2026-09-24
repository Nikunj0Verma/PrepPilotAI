import React, { useEffect, useState } from 'react'
import { ToastContainer,toast } from 'react-toastify';

const Forgot_Password = () => {
  const [submitted, setSubmitted] = useState(false)
    const [input, setInput] = useState({ email: ''});

  const handleSubmit = async(event) => {
    event.preventDefault()
        try {
          const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
             body: JSON.stringify({
               Enterredemail: input.email,
        }),
          });
    
          const data = await res.json();
    
          if (!res.ok) {
            
            throw new Error(data.message || "Email is not valid");
          }
    
          toast.success("If an account exists with this email, a reset link has been sent.", {
            position: "top-right",
            autoClose: 2000,
            theme: "light",
          });

          setSubmitted(true)
        } catch (err) {
          toast.error(err.message || "Email verification failed!!", {
            position: "top-right",
            autoClose: 4000,
            theme: "light",
          });
        }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
        <div className="flex flex-col justify-center bg-gradient-to-br from-blue-600 to-indigo-600 p-8 text-white sm:p-14">
          <div className="mb-auto text-2xl font-extrabold">PrepPilot AI</div>

          <div className="mt-16">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Get back on track.
            </h1>
            <p className="mt-5 max-w-sm leading-7 text-blue-100">
              Reset your password and continue preparing smarter for your next
              opportunity.
            </p>
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
          </div>
        </div>

        <div className="flex flex-col justify-center p-8 sm:p-14">
          <h2 className="text-3xl font-bold text-slate-800">
            Forgot your password?
          </h2>

              <p className="mt-3 leading-6 text-slate-500">
                Enter your email address and we’ll send you a link to reset your
                password.
              </p>

              <form onSubmit={handleSubmit} className="mt-8">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={input.email}
                  onChange={(event) =>
                    setInput({ email: event.target.value })
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

                <button
                  type="submit"
                  className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
                >
                  Send reset link
                </button>
              </form>

          <a
            href="/login"
            className="mt-6 text-center text-sm font-semibold text-blue-600 hover:underline"
          >
            Back to login
          </a>
        </div>
      </section>
    </main>
  )
}

export default Forgot_Password