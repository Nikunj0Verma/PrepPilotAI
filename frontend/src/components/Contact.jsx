
import React, { useState, useRef } from "react";
import {
  FaArrowRight,
  FaCheckCircle,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await emailjs.sendForm(
        "service_lnfrc8s",
        "template_cct6pjl",
        formRef.current,
        "4HYx_VFz9ioucyIUE"
      );

      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      toast.success("Message sent successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    } catch (error) {
      console.error("Email send failed:", error);

      toast.error("Failed to send message. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-gradient-to-br from-[#f7fbff] via-[#eef4ff] to-[#f5f3ff] px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(124,58,237,0.08),_transparent_30%)]" />
      <ToastContainer />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex cursor-pointer items-center rounded-full border border-blue-200 bg-white/90 px-4 py-2 text-sm font-semibold text-[#2563EB] shadow-sm">
            Contact
          </div>

          <h2 className="mt-6 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Let’s talk about your next step
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            Have a question, collaboration idea, or want help improving your
            interview preparation journey? I’d love to hear from you.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-lg text-white shadow-lg shadow-blue-100">
                <FaEnvelope />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">Reach out</p>
                <h3 className="text-2xl font-bold text-slate-900">
                  Send a message
                </h3>
              </div>
            </div>

            {submitted && (
              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                <FaCheckCircle />
                Message sent successfully.
              </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can I help?"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Tell me a little about your goals..."
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#2563EB] px-6 py-3 text-base font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,0.28)] transition hover:-translate-y-0.5 hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Sending..." : "Send Message"}
                {!loading && <FaArrowRight />}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-[30px] border border-blue-100 bg-gradient-to-br from-[#eff6ff] to-[#f5f3ff] p-6 shadow-[0_18px_45px_rgba(59,130,246,0.08)] sm:p-8">
              <h3 className="text-2xl font-bold text-slate-900">
                Contact details
              </h3>

              <div className="mt-6 space-y-4">
                <a
                  href="mailto:verma0025nikunj@gmail.com"
                  className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-white/80 bg-white/80 p-4 transition hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-lg text-[#2563EB]">
                    <FaEnvelope />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="font-semibold text-slate-900">
                      verma0025nikunj@gmail.com
                    </p>
                  </div>
                </a>

                <div className="flex cursor-default items-center gap-4 rounded-2xl border border-white/80 bg-white/80 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-lg text-[#7C3AED]">
                    <FaMapMarkerAlt />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Location</p>
                    <p className="font-semibold text-slate-900">India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.04)] sm:p-8">
              <h3 className="text-2xl font-bold text-slate-900">Follow me</h3>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="https://github.com/Nikunj0Verma"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-[#2563EB] hover:text-[#2563EB]"
                >
                  <FaGithub size={20} />
                </a>

                <a
                  href="https://www.linkedin.com/in/nikunjverma000/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-[#2563EB] hover:text-[#2563EB]"
                >
                  <FaLinkedin size={20} />
                </a>
              </div>

              <div className="mt-8 rounded-[24px] bg-slate-950 p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
                  Ready to start?
                </p>

                <h4 className="mt-3 text-2xl font-bold">
                  Build a stronger interview game.
                </h4>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  From mock interviews to feedback-driven preparation, I’m here
                  to help you move from anxious to confident.
                </p>

                <a
                  href="/signup"
                  className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  Get Started
                  <FaArrowRight />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;