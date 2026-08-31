import React from "react";

const Footer = () => {
  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
    { label: "Login", href: "/login" },
  ];

  const exploreLinks = [
    { label: "AI Mock Interviews", href: "/#features" },
    { label: "Resume Analyzer", href: "/#about" },
    { label: "Progress Tracking", href: "/progress" },
  ];

  const socialLinks = [
    { label: "GitHub", href: "https://github.com/Nikunj0Verma" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/nikunjverma000/" },
    { label: "Email", href: "mailto:verma0025nikunj@gmail.com" },
  ];

  return (
    <footer className="mt-auto border-t border-slate-200 bg-gradient-to-br from-[#0b1220] via-[#0f172a] to-[#111827] text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] via-[#3B82F6] to-[#7C3AED] text-lg font-black text-white shadow-[0_12px_25px_rgba(59,130,246,0.35)]">
                P
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-300">
                  PrepPilot
                </p>
                <p className="text-lg font-bold text-white">AI</p>
              </div>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              Your AI-powered companion for mock interviews, resume improvement,
              and smarter job preparation.
            </p>

            <a
              href="mailto:verma0025nikunj@gmail.com"
              className="mt-5 inline-flex cursor-pointer text-sm font-medium text-blue-300 transition hover:text-blue-200"
            >
              verma0025nikunj@gmail.com
            </a>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Quick Links
            </h4>

            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="cursor-pointer text-sm text-slate-300 transition hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Explore
            </h4>

            <ul className="mt-4 space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="cursor-pointer text-sm text-slate-300 transition hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Follow
            </h4>

            <ul className="mt-4 space-y-3">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                    className="cursor-pointer text-sm text-slate-300 transition hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 PrepPilot AI. All rights reserved.</p>
          <p>Built for smarter interview preparation.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;