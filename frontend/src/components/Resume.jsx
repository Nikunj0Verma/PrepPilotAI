import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api/resume/analyze";

const Resume = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const scrollY = window.scrollY;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";

      window.scrollTo(0, scrollY);
    };
  }, []);

  useEffect(() => {
    const fetchResume = async () => {
      if (!id) {
        setError("Resume ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch resume analysis.");
        }

        setResume(data.resume || data);
      } catch (fetchError) {
        console.error("Resume fetch error:", fetchError);
        setError(fetchError.message || "Failed to load resume analysis.");
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id]);

  const analysis = resume?.analysisResult || {};

  const scores = useMemo(
    () => [
      {
        label: "Overall",
        value: getNumber(analysis.overallScore),
        color: "text-sky-300",
      },
      {
        label: "ATS Score",
        value: getNumber(analysis.atsScore),
        color: "text-indigo-300",
      },
      {
        label: "Role Match",
        value: getNumber(analysis.roleMatch),
        color: "text-cyan-300",
      },
      {
        label: "Skill Match",
        value: getNumber(analysis.skillMatch),
        color: "text-violet-300",
      },
    ],
    [analysis]
  );

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ResumeOverlay>
        <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            aria-label="Close and go to Dashboard"
            title="Go to Dashboard"
            className="absolute right-5 top-5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-600/80 text-slate-300 transition hover:border-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <i className="fa-solid fa-xmark text-lg" />
          </button>

          <i className="fa-solid fa-circle-exclamation text-4xl text-red-400" />

          <h2 className="mt-5 text-2xl font-bold text-white">
            Unable to load resume
          </h2>

          <p className="mt-2 max-w-md text-sm text-slate-400">{error}</p>

          <button
            type="button"
            onClick={() => navigate("/resume-analyzer")}
            className="mt-6 cursor-pointer rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
          >
            Back to Resume Analyzer
          </button>
        </div>
      </ResumeOverlay>
    );
  }

  const strengths = getArray(
    analysis.strengths,
    "No strengths were provided."
  );

  const improvements = getArray(
    analysis.weaknesses,
    "No improvement areas were provided."
  );

  const presentSkills = getArray(
    analysis.presentSkills,
    "No skills found."
  );

  const missingSkills = getArray(
    analysis.missingSkills,
    "No missing skills identified."
  );

  const recommendations = getArray(
    analysis.suggestions,
    "No recommendations available."
  );

  return (
    <ResumeOverlay>
      <header className="border-b border-slate-700/60 bg-gradient-to-r from-[#101827] via-[#121d31] to-[#0d1426] px-5 py-4 sm:px-7">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate("/resume-analyzer")}
            className="inline-flex cursor-pointer items-center text-sm font-semibold text-sky-300 transition hover:text-sky-200"
          >
            <i className="fa-solid fa-arrow-left mr-2" />
            Back to Resume Analyzer
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            aria-label="Close and go to Dashboard"
            title="Go to Dashboard"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-600/80 text-slate-300 transition hover:border-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <i className="fa-solid fa-xmark text-lg" />
          </button>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-300 ring-1 ring-sky-400/20">
            <i className="fa-solid fa-file-circle-check text-lg" />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300">
              AI-powered prep
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-100">
              Resume Analysis
            </h1>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <InfoBadge
            icon="fa-solid fa-building"
            label="Company"
            value={resume?.companyName || "Not specified"}
          />

          <InfoBadge
            icon="fa-solid fa-briefcase"
            label="Role"
            value={resume?.role || "Not specified"}
          />

          <InfoBadge
            icon="fa-solid fa-chart-line"
            label="Level"
            value={resume?.level || "Entry Level"}
          />
        </div>
      </header>

      <main className="space-y-4 p-4 sm:p-5">
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {scores.map((score) => (
            <ScoreCard key={score.label} {...score} />
          ))}
        </section>

        <ContentCard title="AI Summary" icon="fa-solid fa-robot">
          <p className="text-sm leading-7 text-slate-300">
            {analysis.summary ||
              analysis.aiSummary ||
              "No AI summary is available for this resume."}
          </p>
        </ContentCard>

        <section className="grid gap-4 lg:grid-cols-2">
          <ListCard
            title="Strengths"
            icon="fa-solid fa-circle-check"
            iconColor="text-emerald-400"
            items={strengths}
          />

          <ListCard
            title="Areas to Improve"
            icon="fa-solid fa-triangle-exclamation"
            iconColor="text-amber-400"
            items={improvements}
          />
        </section>

        <section className="rounded-2xl border border-slate-700/80 bg-[#111c2f] p-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-white">
            <i className="fa-solid fa-code-branch text-sky-300" />
            Skill Gap
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <SkillColumn
              title="Present Skills"
              icon="fa-solid fa-check"
              iconColor="text-emerald-400"
              items={presentSkills}
            />

            <SkillColumn
              title="Missing Skills"
              icon="fa-solid fa-plus"
              iconColor="text-amber-400"
              items={missingSkills}
            />
          </div>
        </section>

        <ListCard
          title="AI Recommendations"
          icon="fa-solid fa-wand-magic-sparkles"
          iconColor="text-sky-300"
          items={recommendations}
          numbered
        />

        <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate("/resume-analyzer")}
            className="cursor-pointer rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            <i className="fa-solid fa-rotate-right mr-2" />
            Analyze Another Resume
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer rounded-xl border border-slate-600/80 bg-slate-800/60 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700/70"
          >
            <i className="fa-solid fa-chart-line mr-2" />
            Dashboard
          </button>
        </div>
      </main>
    </ResumeOverlay>
  );
};

const ResumeOverlay = ({ children }) => (
  <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 px-3 py-3 backdrop-blur-sm sm:px-6 md:py-4">
    <div className="flex min-h-full items-center justify-center">
      <main className="relative my-3 w-full max-w-5xl overflow-hidden rounded-[24px] border border-slate-700/70 bg-[#0d1324] text-slate-100 shadow-[0_30px_80px_rgba(15,23,42,0.7)] sm:my-0">
        {children}
      </main>
    </div>
  </div>
);

const LoadingState = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm">
    <div className="rounded-[26px] border border-slate-700/80 bg-[#0d1324] px-8 py-7 text-center text-white shadow-2xl">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sky-500/10 ring-1 ring-sky-500/20">
        <i className="fa-solid fa-spinner fa-spin text-2xl text-sky-300" />
      </div>

      <p className="mt-4 text-sm text-slate-300">
        Loading resume analysis...
      </p>
    </div>
  </div>
);

const InfoBadge = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 rounded-xl border border-slate-600/80 bg-slate-800/50 px-3 py-2 text-sm text-slate-200">
    <i className={`${icon} text-sky-300`} />
    <span className="text-slate-400">{label}:</span>
    <span className="font-medium text-slate-100">{value}</span>
  </div>
);

const ScoreCard = ({ label, value, color }) => (
  <div className="rounded-2xl border border-slate-700/80 bg-[#111c2f] p-4">
    <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
      {label}
    </p>

    <div className="mt-3 flex items-end gap-1">
      <span className={`text-3xl font-bold ${color}`}>{value}</span>
      <span className="pb-1 text-sm text-slate-500">/100</span>
    </div>
  </div>
);

const ContentCard = ({ title, icon, children }) => (
  <section className="rounded-2xl border border-slate-700/80 bg-[#111c2f] p-4">
    <h2 className="flex items-center gap-2 text-lg font-bold text-white">
      <i className={`${icon} text-sky-300`} />
      {title}
    </h2>

    <div className="mt-4 rounded-xl border border-slate-700/80 bg-[#0b1220] p-4">
      {children}
    </div>
  </section>
);

const ListCard = ({
  title,
  icon,
  iconColor,
  items,
  numbered = false,
}) => (
  <section className="rounded-2xl border border-slate-700/80 bg-[#111c2f] p-4">
    <h2 className="flex items-center gap-2 text-lg font-bold text-white">
      <i className={`${icon} ${iconColor}`} />
      {title}
    </h2>

    <ul className="mt-4 space-y-3">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="flex gap-3 text-sm text-slate-300"
        >
          <span className={`shrink-0 font-bold ${iconColor}`}>
            {numbered ? `${index + 1}.` : "•"}
          </span>

          <span>{item}</span>
        </li>
      ))}
    </ul>
  </section>
);

const SkillColumn = ({ title, icon, iconColor, items }) => (
  <div className="rounded-xl border border-slate-700/80 bg-[#0b1220] p-4">
    <h3 className="text-sm font-semibold text-slate-200">{title}</h3>

    <ul className="mt-3 space-y-2">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="flex gap-2 text-sm text-slate-300"
        >
          <i className={`${icon} mt-1 text-xs ${iconColor}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const getNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? Math.max(0, Math.min(100, number))
    : 0;
};

const getArray = (value, fallback) => {
  if (Array.isArray(value) && value.length > 0) {
    return value.map((item) => {
      if (typeof item === "string") return item;

      return (
        item?.text ||
        item?.title ||
        item?.name ||
        JSON.stringify(item)
      );
    });
  }

  return [fallback];
};

export default Resume;