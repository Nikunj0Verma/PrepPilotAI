import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api/company";

const Company = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [companyData, setCompanyData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!id) {
        setError("Company preparation ID is missing.");
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
          throw new Error(
            data.message || "Failed to load company preparation."
          );
        }

        setCompanyData(data.company || data);
        console.log("Fetched company preparation data:");
      } catch (fetchError) {
        console.error("Company preparation error:", fetchError);
        setError(
          fetchError.message || "Failed to load company preparation."
        );
      }
    };

    fetchCompanyDetails();
  }, [id]);

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


  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 px-3 py-3 backdrop-blur-sm sm:px-6 md:py-4">
      <div className="flex min-h-full items-center justify-center">
        <main className="relative my-3 w-full max-w-5xl overflow-hidden rounded-[24px] border border-slate-700/70 bg-[#0d1324] text-slate-100 shadow-[0_30px_80px_rgba(15,23,42,0.7)] sm:my-0">
          <header className="border-b border-slate-700/60 bg-gradient-to-r from-[#101827] via-[#121d31] to-[#0d1426] px-5 py-5 sm:px-7">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              aria-label="Close company preparation"
              className="absolute right-5 top-5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-600/80 text-slate-300 transition hover:border-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <i className="fa-solid fa-xmark text-lg" />
            </button>

            <button
              type="button"
              onClick={() => navigate("/company-prep")}
              className="inline-flex cursor-pointer items-center text-sm font-semibold text-sky-300 transition hover:text-sky-200"
            >
              <i className="fa-solid fa-arrow-left mr-2" />
              Back to Company Preparation
            </button>

            <div className="mt-6 flex items-center gap-3 pr-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xl text-white shadow-lg shadow-blue-950/30">
                <i className="fa-solid fa-building" />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300">
                  AI-powered career guidance
                </p>

                <h1 className="mt-1 text-2xl font-bold text-slate-100">
                  Company Preparation
                </h1>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <InfoBadge
                icon="fa-solid fa-building"
                label="Company"
                value={companyData?.name || "Not specified"}
              />

              <InfoBadge
                icon="fa-solid fa-briefcase"
                label="Role"
                value={companyData?.role || "Not specified"}
              />

              <InfoBadge
                icon="fa-solid fa-chart-line"
                label="Level"
                value={companyData?.level || "Not specified"}
              />
            </div>
          </header>

          {error ? (
            <ErrorState error={error} navigate={navigate} />
          ) : (
            <main className="space-y-4 p-4 sm:p-5 md:p-6">
              <ContentCard
                title="Company Overview"
                icon="fa-solid fa-circle-info"
              >
                <p className="text-sm leading-7 text-slate-300">
                  {companyData?.analysis?.companyOverview || "No overview available."}
                </p>
              </ContentCard>
               

              <section className="grid gap-4 lg:grid-cols-2">
                <ListCard
                  title="Important Skills"
                  icon="fa-solid fa-star"
                  iconColor="text-amber-400"
                  items={companyData?.analysis?.importantSkills || []}
                />

                <ListCard
                  title="Technical Topics"
                  icon="fa-solid fa-code"
                  iconColor="text-sky-300"
                  items={companyData?.analysis?.technicalTopics || []}
                />
              </section>

              <section className="grid gap-4 lg:grid-cols-2">
               
              </section>

              <section className="grid gap-4 lg:grid-cols-2">
                <ListCard
                  title="Interview Topics"
                  icon="fa-solid fa-comments"
                  iconColor="text-indigo-300"
                  items={companyData?.analysis?.interviewTopics || []}
                />

                <ListCard
                  title="HR Preparation"
                  icon="fa-solid fa-user-tie"
                  iconColor="text-cyan-300"
                  items={companyData?.analysis?.hrPreparation || []}
                />
              </section>

              <ContentCard
                title="Preparation Roadmap"
                icon="fa-solid fa-route"
              >
                <Roadmap
                  items={companyData?.analysis?.preparationRoadmap?.map((week) => `Week ${week.week}: ${week.focus} - Topics: ${week.topics.join(", ")}`) || []}
                />
              </ContentCard>

              <ContentCard
                title="AI Tips"
                icon="fa-solid fa-wand-magic-sparkles"
              >
                <ul className="space-y-3">
                  {companyData?.analysis?.aiTips?.map((tip, index) => (
                    <li
                      key={`${tip}-${index}`}
                      className="flex gap-3 text-sm leading-6 text-slate-300"
                    >
                      <i className="fa-solid fa-lightbulb mt-1 text-amber-300" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </ContentCard>

              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/company-prep")}
                  className="cursor-pointer rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(37,99,235,0.35)] transition hover:brightness-110"
                >
                  <i className="fa-solid fa-rotate-right mr-2" />
                  Prepare for Another Company
                </button>
              </div>
            </main>
          )}
        </main>
      </div>
    </div>
  );
};

const InfoBadge = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 rounded-xl border border-slate-600/80 bg-slate-800/50 px-3 py-2 text-sm text-slate-200">
    <i className={`${icon} text-sky-300`} />
    <span className="text-slate-400">{label}:</span>
    <span className="font-medium text-slate-100">{value}</span>
  </div>
);

const ContentCard = ({ title, icon, children }) => (
  <section className="rounded-2xl border border-slate-700/80 bg-[#111c2f] p-4 sm:p-5">
    <h2 className="flex items-center gap-2 text-lg font-bold text-white">
      <i className={`${icon} text-sky-300`} />
      {title}
    </h2>

    <div className="mt-4 rounded-xl border border-slate-700/80 bg-[#0b1220] p-4">
      {children}
    </div>
  </section>
);

const ListCard = ({ title, icon, iconColor, items }) => (
  <section className="rounded-2xl border border-slate-700/80 bg-[#111c2f] p-4 sm:p-5">
    <h2 className="flex items-center gap-2 text-lg font-bold text-white">
      <i className={`${icon} ${iconColor}`} />
      {title}
    </h2>

    <ul className="mt-4 space-y-3">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="flex gap-3 text-sm leading-6 text-slate-300"
        >
          <i className={`fa-solid fa-check mt-1 text-xs ${iconColor}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </section>
);

const Roadmap = ({ items }) => (
  <div className="space-y-4">
    {items.map((item, index) => (
      <div key={`${item}-${index}`} className="flex gap-4">
        <div className="flex flex-col items-center">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-sm font-bold text-white">
            {index + 1}
          </div>

          {index !== items.length - 1 && (
            <div className="mt-2 h-full min-h-6 w-px bg-slate-700" />
          )}
        </div>

        <p className="pt-1 text-sm leading-6 text-slate-300">{item}</p>
      </div>
    ))}
  </div>
);



const ErrorState = ({ error, navigate }) => (
  <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
    <i className="fa-solid fa-circle-exclamation text-4xl text-red-400" />

    <h2 className="mt-5 text-2xl font-bold text-white">
      Unable to load preparation
    </h2>

    <p className="mt-2 max-w-md text-sm text-slate-400">{error}</p>

    <button
      type="button"
      onClick={() => navigate("/company-prep")}
      className="mt-6 cursor-pointer rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
    >
      Back to Company Preparation
    </button>
  </div>
);

const getValue = (data, keys) => {
  for (const key of keys) {
    if (data?.[key]) return data[key];
  }

  return "Not specified";
};

const getText = (data, keys, fallback) => {
  for (const key of keys) {
    if (typeof data?.[key] === "string" && data[key].trim()) {
      return data[key];
    }
  }

  return fallback;
};

const getList = (data, keys) => {
  for (const key of keys) {
    const value = data?.[key];

    if (Array.isArray(value) && value.length > 0) {
      return value.map((item) => {
        if (typeof item === "string") return item;

        return (
          item?.title ||
          item?.text ||
          item?.description ||
          JSON.stringify(item)
        );
      });
    }

    if (typeof value === "string" && value.trim()) {
      return value
        .split(/\n|•|(?<=\.)\s+(?=[A-Z])/)
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return ["No information available."];
};

export default Company;