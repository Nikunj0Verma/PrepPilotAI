import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ResumeAnalyzer = () => {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("Entry Level");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = isAnalyzing ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isAnalyzing]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setFile(null);
      setError("Please upload a PDF file only.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setFile(null);
      setError("The resume must be smaller than 10 MB.");
      return;
    }

    setError("");
    setAnalysis(null);
    setFile(selectedFile);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!company.trim() || !role.trim() || !file) {
      setError("Please complete all fields and upload your resume.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in before analyzing your resume.");
      return;
    }

    try {
      setIsAnalyzing(true);
      setError("");

      const formData = new FormData();
      formData.append("company", company.trim());
      formData.append("role", role.trim());
      formData.append("level", level);
      formData.append("resume", file);

      const response = await fetch(
        "http://localhost:5000/api/resume/analyze",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to analyze resume.");
      }

      setAnalysis(data.analysis || data);
      navigate(`/resume/analyze/${data.resume._id}`);
    } catch (requestError) {
      console.error("Resume analysis error:", requestError);
      setError(
        requestError.message ||
          "Something went wrong while analyzing your resume."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <div
        aria-busy={isAnalyzing}
        className={`space-y-8 p-4 md:p-8 ${
          isAnalyzing ? "pointer-events-none select-none blur-[1px]" : ""
        }`}
      >
        <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-[#0f172a] via-[#4f46e5] to-[#a855f7] p-6 text-white shadow-[0_18px_45px_rgba(79,70,229,0.28)] md:p-8">
          <div className="relative z-10 max-w-3xl">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl backdrop-blur-sm ring-1 ring-white/20">
              <i className="fa-solid fa-file-circle-check" />
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-100">
              AI-powered career guidance
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
              Resume Analyzer
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-violet-50 md:text-base">
              Upload your resume and receive personalized feedback tailored to
              the company, role, and experience level you are targeting.
            </p>
          </div>

          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-28 right-12 h-72 w-72 rounded-full bg-fuchsia-300/10" />
        </section>

        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700 shadow-sm">
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
              Target Position
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Tell us about the opportunity you are preparing for.
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
                <i className="fa-solid fa-building absolute left-4 top-1/2 -translate-y-1/2 text-violet-500" />
                <input
                  id="company"
                  type="text"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  placeholder="e.g. Google"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="role"
                className="block text-sm font-semibold text-slate-700"
              >
                Target Role
              </label>

              <div className="relative">
                <i className="fa-solid fa-briefcase absolute left-4 top-1/2 -translate-y-1/2 text-violet-500" />
                <input
                  id="role"
                  type="text"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  placeholder="e.g. Frontend Developer"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="level"
                className="block text-sm font-semibold text-slate-700"
              >
                Experience Level
              </label>

              <div className="relative">
                <i className="fa-solid fa-chart-line absolute left-4 top-1/2 -translate-y-1/2 text-violet-500" />
                <select
                  id="level"
                  value={level}
                  onChange={(event) => setLevel(event.target.value)}
                  className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-10 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
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

          <div className="mt-8">
            <label
              htmlFor="resume"
              className="flex cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-violet-200 bg-violet-50 px-6 py-10 text-center transition hover:border-violet-400 hover:bg-violet-100"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-2xl text-white shadow-lg shadow-violet-200">
                <i className="fa-solid fa-cloud-arrow-up" />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                {file ? file.name : "Upload your resume"}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {file
                  ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                  : "PDF format only, maximum file size 10 MB"}
              </p>

              <span className="mt-5 rounded-full bg-white px-5 py-2 text-sm font-semibold text-violet-600 shadow-sm">
                {file ? "Choose another file" : "Browse PDF"}
              </span>

              <input
                id="resume"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-[22px] bg-violet-50 p-5 sm:flex-row">
            <div className="flex items-center gap-3 text-sm text-violet-800">
              <i className="fa-solid fa-circle-info text-lg text-violet-600" />
              <span>Your analysis will be tailored to your target position.</span>
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="inline-flex w-full items-center justify-center rounded-full bg-violet-600 px-7 py-3 font-semibold text-white shadow-[0_12px_25px_rgba(124,58,237,0.3)] transition hover:scale-[1.02] hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-violet-400 sm:w-auto cursor-pointer"
            >
              <i className="fa-solid fa-wand-magic-sparkles mr-3" />
              Analyze Resume
            </button>
          </div>
        </form>

        {analysis && (
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)] md:p-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Resume Analysis
            </h2>

            <pre className="mt-5 whitespace-pre-wrap rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
              {typeof analysis === "string"
                ? analysis
                : JSON.stringify(analysis, null, 2)}
            </pre>
          </section>
        )}
      </div>

      {isAnalyzing && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Analyzing resume"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/85 p-5 backdrop-blur-md"
        >
          <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#0b1238] p-8 text-center text-white shadow-2xl">
            <i className="fa-solid fa-spinner fa-spin text-4xl text-fuchsia-300" />
            <h2 className="mt-6 text-2xl font-extrabold">
              Analyzing Your Resume
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Our AI is comparing your resume with the selected company and
              role.
            </p>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-700">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-fuchsia-400 to-violet-500" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResumeAnalyzer;