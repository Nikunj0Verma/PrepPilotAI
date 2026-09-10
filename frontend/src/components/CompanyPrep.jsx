import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CompanyPrep = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [company, setCompany] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Entry Level");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isGenerating ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isGenerating]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsGenerating(true);
      setError("");
      const detailsResponse = await fetch(
        "http://localhost:5000/api/company/details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: company.trim(),
            role: jobRole.trim(),
            level: experienceLevel,
          }),
        },
      );

      const detailsData = await detailsResponse.json();

      if (!detailsResponse.ok) {
        throw new Error(
          detailsData.message || "Failed to create company preparation.",
        );
      }

      const companyId =
        detailsData._id 

      if (!companyId) {
        throw new Error("Company preparation ID was not returned.");
      }

      const analysisResponse = await fetch(
        `http://localhost:5000/api/company/analysis/${companyId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const analysisData = await analysisResponse.json();

      if (!analysisResponse.ok) {
        throw new Error(
          analysisData.message || "Failed to generate company preparation.",
        );
      }

      navigate(`/company-prep/${companyId}`, {
        state: {
          backgroundLocation: location,
        },
      });
    } catch (submitError) {
      console.error("Company preparation error:", submitError);

      setError(
        submitError.message ||
          "Unable to generate company preparation. Please try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <main
        aria-busy={isGenerating}
        className={`space-y-8 p-4 md:p-8 ${
          isGenerating ? "pointer-events-none select-none blur-[1px]" : ""
        }`}
      >
        <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-[#0f172a] via-[#2563eb] to-[#4f46e5] p-6 text-white shadow-[0_18px_45px_rgba(37,99,235,0.28)] md:p-8">
          <div className="relative z-10 max-w-3xl">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-2xl text-white shadow-lg shadow-blue-950/30 ring-1 ring-white/20">
              <i className="fa-solid fa-building" />
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
              AI-powered career guidance
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
              Company Preparation
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50 md:text-base">
              Get personalized preparation guidance for your target company,
              role, and experience level.
            </p>
          </div>

          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-28 right-12 h-72 w-72 rounded-full bg-indigo-300/10" />
        </section>

        {error && (
          <div
            role="alert"
            className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700 shadow-sm"
          >
            <i className="fa-solid fa-circle-exclamation" />
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)] md:p-8"
        >
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-slate-900">
              Preparation Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Tell us what opportunity you are preparing for.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label
                htmlFor="company"
                className="block text-sm font-semibold text-slate-700"
              >
                Company
              </label>

              <div className="relative">
                <i className="fa-solid fa-building absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />

                <input
                  id="company"
                  type="text"
                  value={company}
                  onChange={(event) => {
                    setCompany(event.target.value);
                    setError("");
                  }}
                  placeholder="e.g. Google"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="jobRole"
                className="block text-sm font-semibold text-slate-700"
              >
                Job Role
              </label>

              <div className="relative">
                <i className="fa-solid fa-briefcase absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />

                <input
                  id="jobRole"
                  type="text"
                  value={jobRole}
                  onChange={(event) => {
                    setJobRole(event.target.value);
                    setError("");
                  }}
                  placeholder="e.g. Frontend Developer"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="experienceLevel"
                className="block text-sm font-semibold text-slate-700"
              >
                Experience Level
              </label>

              <div className="relative">
                <i className="fa-solid fa-chart-line absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />

                <select
                  id="experienceLevel"
                  value={experienceLevel}
                  onChange={(event) => {
                    setExperienceLevel(event.target.value);
                    setError("");
                  }}
                  className="w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-10 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                >
                  <option>Entry Level</option>
                  <option>Mid Level</option>
                  <option>Senior Level</option>
                  <option>Lead / Manager</option>
                </select>

                <i className="fa-solid fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-[22px] bg-blue-50 p-5 sm:flex-row">
            <div className="flex items-center gap-3 text-sm text-blue-800">
              <i className="fa-solid fa-circle-info text-lg text-blue-600" />
              <span>Your preparation will be tailored to your selections.</span>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-blue-600 px-7 py-3 font-semibold text-white shadow-[0_12px_25px_rgba(59,130,246,0.35)] transition hover:scale-[1.02] hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-blue-400 sm:w-auto"
            >
              <i className="fa-solid fa-wand-magic-sparkles mr-3" />
              Generate Preparation
            </button>
          </div>
        </form>
      </main>

      {isGenerating && <GeneratingOverlay />}
    </>
  );
};

const GeneratingOverlay = () => (
  <div
    role="dialog"
    aria-modal="true"
    aria-label="Generating company preparation"
    className="fixed inset-0 z-[9999] flex cursor-wait items-center justify-center bg-slate-950/85 p-5 backdrop-blur-md"
  >
    <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#0b1238] p-8 text-center text-white shadow-2xl">
      <i className="fa-solid fa-spinner fa-spin text-4xl text-cyan-300" />

      <h2 className="mt-6 text-2xl font-extrabold">Preparing Your Guide</h2>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        AI is generating your personalized company preparation. Please wait...
      </p>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-700">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
      </div>

      <p className="mt-3 text-xs text-slate-500">
        This may take a few seconds...
      </p>
    </div>
  </div>
);

export default CompanyPrep;
