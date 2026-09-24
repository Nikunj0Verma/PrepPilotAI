import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Reset_Password = () => {
  const { token } = useParams()

  const [input, setInput] = useState({
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (input.password !== input.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    try {
      setLoading(true)
      const res = await fetch(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: input.password,
          }),
        },
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Password reset failed')
      }

      toast.success('Password changed successfully')
    } catch (error) {
      toast.error(error.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <ToastContainer position="top-right" />

      <section className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
        <div className="flex flex-col justify-center bg-gradient-to-br from-blue-600 to-indigo-600 p-8 text-white sm:p-14">
          <div className="text-2xl font-extrabold">PrepPilot AI</div>

          <div className="mt-16">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Create a new password.
            </h1>
            <p className="mt-5 max-w-sm leading-7 text-blue-100">
              Choose a strong password to keep your PrepPilot AI account secure.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center p-8 sm:p-14">
          <h2 className="text-3xl font-bold text-slate-800">
            Reset password
          </h2>

          <p className="mt-3 leading-6 text-slate-500">
            Enter and confirm your new password below.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                New password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter new password"
                minLength={6}
                value={input.password}
                onChange={(event) =>
                  setInput({ ...input, password: event.target.value })
                }
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Confirm new password
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                minLength={6}
                value={input.confirmPassword}
                onChange={(event) =>
                  setInput({ ...input, confirmPassword: event.target.value })
                }
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Changing password...' : 'Change password'}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default Reset_Password