import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/interview-prep": "Interview Prep",
  "/resume-analyzer": "Resume Analyzer",
  "/company-prep": "Company Prep",
  "/progress": "Progress",
};

const PrivateNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [userName, setUserName] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setUserName(data.user || {});
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const isInterviewPage =
    location.pathname === "/interview" ||
    location.pathname.startsWith("/interview/");

  const pageTitle = isInterviewPage
    ? "Interview"
    : pageTitles[location.pathname] || "PrepPilot AI";

  const firstName = userName?.firstName || "User";
  const lastName = userName?.lastName || "";
  const email = userName?.email || "user@example.com";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 px-5 py-3 backdrop-blur-xl md:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.9)]" />
          <h1 className="text-xl font-bold tracking-tight text-slate-800 md:text-2xl">
            {pageTitle}
          </h1>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md"
            aria-expanded={isOpen}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 text-sm font-bold text-white shadow-[0_8px_18px_rgba(59,130,246,0.35)]">
              {firstName.charAt(0).toUpperCase()}
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-xs text-slate-400">Welcome</p>
              <p className="text-sm font-semibold text-slate-800">
                {firstName}
              </p>
            </div>

            <i
              className={`fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_22px_50px_rgba(15,23,42,0.12)]">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white ">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-lg font-bold text-white ring-2 ring-white/30">
                    {firstName.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold">
                      {firstName} {lastName}
                    </p>
                    <p className="truncate text-xs text-blue-100">{email}</p>
                  </div>
                </div>
              </div>

              <div className="p-3">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-500 transition hover:bg-red-50 cursor-pointer"
                >
                  <i className="fa-solid fa-arrow-right-from-bracket" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default PrivateNavbar;