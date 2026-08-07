import React from 'react'

const Footer = () => {
  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Contact', href: '/#contact' },
    { label: 'Login', href: '/login' }
  ]

  const exploreLinks = [
    { label: 'AI Mock Interview', href: '/#about' },
    { label: 'Resume Analyzer', href: '/#about' },
    { label: 'Progress Tracking', href: '/#about' }
  ]

  const socialLinks = [
    { label: 'GitHub', href: 'https://github.com/Nikunj0Verma' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/nikunjverma000/' },
    { label: 'Email', href: 'mailto:verma0025nikunj@gmail.com' }
  ]

  return (
    <footer className="border-t border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-xl font-semibold text-white">PrepPilot AI</h3>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
              Your AI-powered companion for interview preparation, resume improvement, and career confidence.
            </p>
            <a
              href="mailto:verma0025nikunj@gmail.com"
              className="mt-5 inline-flex text-sm font-medium text-blue-400 transition hover:text-blue-300"
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
                    className="text-sm transition hover:text-white"
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
                    className="text-sm transition hover:text-white"
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
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="text-sm transition hover:text-white"
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
  )
}

export default Footer