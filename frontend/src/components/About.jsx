import React from 'react'

const features = [
  {
    icon: '🎤',
    title: 'AI Mock Interview',
    desc: 'Practice realistic interview questions and improve your confidence.'
  },
  {
    icon: '📄',
    title: 'AI Resume Analyzer',
    desc: 'Get smart suggestions to make your resume stronger and job-ready.'
  },
  {
    icon: '🏢',
    title: 'Company-Specific Practice',
    desc: 'Prepare for the exact companies and roles you want to target.'
  },
  {
    icon: '📈',
    title: 'Progress Tracking',
    desc: 'Monitor your growth and focus on the areas that need attention.'
  }
]

const steps = [
  {
    title: 'Create Account',
    desc: 'Sign up quickly and create your personal prep profile.'
  },
  {
    title: 'Upload Resume',
    desc: 'Share your resume for AI-powered insights and analysis.'
  },
  {
    title: 'Select Interview',
    desc: 'Pick the interview type, role, or company you want to practice.'
  },
  {
    title: 'Start AI Interview',
    desc: 'Begin a smart mock interview session tailored to you.'
  },
  {
    title: 'Get Personalized Feedback',
    desc: 'Receive actionable tips on clarity and confidence.'
  },
  {
    title: 'Track Progress',
    desc: 'Review your learning journey and keep improving step by step.'
  }
]

const About = () => {
  return (
    <section id="about" className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[28px] border border-blue-100 bg-white/80 p-8 shadow-xl shadow-blue-100 backdrop-blur sm:p-10 lg:p-14">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              About PrepPilot AI
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              PrepPilot AI is a smart interview preparation platform built to help students and professionals prepare faster, better, and with more confidence.
            </p>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              It brings together AI-powered mock interviews, resume analysis, company-specific practice, and progress tracking in one simple experience.
            </p>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              Whether you are preparing for your first interview or aiming for a bigger opportunity, PrepPilot AI supports you at every stage.
            </p>
          </div>

          <div className="mt-14">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-600"></div>
              <h3 className="text-2xl font-semibold text-slate-900">Why PrepPilot AI?</h3>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="text-3xl">{feature.icon}</div>
                  <h4 className="mt-3 text-lg font-semibold text-slate-900">{feature.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-indigo-600"></div>
              <h3 className="text-2xl font-semibold text-slate-900">How It Works</h3>
            </div>

            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              From creating your account to receiving expert-style guidance, PrepPilot AI turns interview preparation into a smooth and interactive experience.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.title}>
                  <div className="w-full max-w-[230px] rounded-2xl border h-full max-h-[300px] border-blue-100 bg-white p-4 text-center shadow-md transition duration-300 hover:scale-[1.02] hover:shadow-xl">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 font-semibold text-white">
                      {index + 1}
                    </div>
                    <h4 className="mt-4 text-lg font-semibold text-slate-900">{step.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{step.desc}</p>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="hidden text-2xl font-semibold text-blue-500 md:block">
                      →
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About