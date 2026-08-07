import React, { useState, useRef } from 'react'
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa'
import { ToastContainer, toast } from 'react-toastify'
import emailjs from '@emailjs/browser'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const form = useRef()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    emailjs
      .sendForm(
        'service_lnfrc8s',
        'template_cct6pjl',
        form.current,
        '4HYx_VFz9ioucyIUE'
      )
      .then(
        () => {
          setSubmitted(true)
          form.current.reset()
          toast.success('Message sent successfully! ✅', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'dark'
          })
          setLoading(false)
        },
        (error) => {
          console.error('Error sending message:', error)
          toast.error('Failed to send message. Please try again.', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'dark'
          })
          setLoading(false)
        }
      )
  }

  return (
    <section
      id="contact"
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-100 to-indigo-200 px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_45%)]"></div>
      <ToastContainer />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Let's Connect
          </h2>
          <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"></div>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Have questions about PrepPilot AI or want to begin your interview preparation journey?
            Whether you're a student, job seeker, or working professional, I'm always happy to connect and help you move forward with confidence.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/signup"
              className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
            >
              Get Started
            </a>
            <span className="text-sm font-medium">Already signed in?</span>
            <a
              href="/login"
              className="text-sm font-medium text-blue-700 transition hover:text-blue-900 hover:underline"
            >
            Login
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-[24px] border border-blue-100 bg-white/90 p-8 shadow-xl shadow-blue-100 backdrop-blur-sm">
            <h3 className="mb-6 text-2xl font-bold text-slate-900">Send Me a Message</h3>

            {submitted && (
              <div className="mb-6 rounded-lg border border-green-500/50 bg-green-500/20 p-4">
                <p className="font-semibold text-green-600">✓ Message sent successfully!</p>
              </div>
            )}

            <form ref={form} onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block font-semibold text-slate-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-700">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Subject"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-700">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full resize-none rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Your message..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="hover:cursor-pointer w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          <div className="flex flex-col space-y-6">
            <div className="rounded-[24px] border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-sm backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-slate-900">Contact Information</h3>
              <p className="mt-3 text-slate-600">
                Feel free to connect for opportunities, collaboration, or just a friendly hello.
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <FaEnvelope />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Email</h4>
                      <a
                        href="mailto:verma0025nikunj@gmail.com"
                        className="mt-1 block text-slate-600 transition hover:text-blue-700"
                      >
                        verma0025nikunj@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-blue-100 bg-white/90 p-8 shadow-lg backdrop-blur-sm">
              <h4 className="text-xl font-semibold text-slate-900">Follow Me</h4>
              <div className="mt-5 flex gap-4">
                <a
                  href="https://github.com/Nikunj0Verma"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-blue-500 hover:text-blue-600"
                >
                  <FaGithub size={22} />
                </a>
                <a
                  href="https://linkedin.com/in/nikunjverma000/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-blue-500 hover:text-blue-600"
                >
                  <FaLinkedin size={22} />
                </a>
                <a
                  href="https://x.com/NVerma7115"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-blue-500 hover:text-blue-600"
                >
                  <FaTwitter size={22} />
                </a>
              </div>

              <div className="mt-6 rounded-[24px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 shadow-md">
                <div className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                  Let’s begin
                </div>

                <h5 className="mt-4 text-xl font-semibold text-slate-900">
                  Let's Build Something Amazing Together
                </h5>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  From your very first mock interview to your next big opportunity, PrepPilot AI helps you prepare with clarity, confidence, and purpose.
                </p>

                <div className="mt-5 rounded-2xl border border-blue-100 bg-white/80 p-4 shadow-sm">
                  <p className="text-sm text-slate-600">
                    Ready to take the next step? Create your account and start practicing today.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact