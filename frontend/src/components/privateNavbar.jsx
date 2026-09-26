import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const pageTitles = {
  "/profile": "Profile",
  "/dashboard": "Dashboard",
  "/interview-prep": "Interview Prep",
  "/resume-analyzer": "Resume Analyzer",
  "/company-prep": "Company Prep",
  "/progress": "Progress",
};

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: "fa-solid fa-table-columns" },
  { path: "/progress", label: "Progress", icon: "fa-solid fa-chart-line" },
  {
    path: "/interview-prep",
    label: "Interview Prep",
    icon: "fa-solid fa-microphone",
  },
  {
    path: "/resume-analyzer",
    label: "Resume Analyzer",
    icon: "fa-solid fa-file-lines",
  },
  { path: "/company-prep", label: "Company Prep", icon: "fa-solid fa-building" },
  { path: "/profile", label: "Profile", icon: "fa-solid fa-user" },
];

const PrivateNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [userName, setUserName] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch user data");
        }

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
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsDropdownOpen(false);
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const handleProfile = () => {
    navigate("/profile", { replace: true });
  };

  const handleNavigation = (path) => {
    navigate(path, { replace: true });
    setIsSidebarOpen(false);
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
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 px-5 py-3 backdrop-blur-xl md:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600 lg:flex lg:hidden"
              aria-label="Open menu"
            >
              <i className="fa-solid fa-bars text-lg" />
            </button>

            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.9)]" />
              <h1 className="text-xl font-bold tracking-tight text-slate-800 md:text-2xl">
                {pageTitle}
              </h1>
            </div>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex cursor-pointer items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md"
              aria-expanded={isDropdownOpen}
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
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_22px_50px_rgba(15,23,42,0.12)]">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
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
                    onClick={handleProfile}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-gray-500 transition hover:bg-gray-50"
                  >
                    <i className="fa-solid fa-circle-user" />
                    Profile
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"
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

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/35 backdrop-blur-[2px] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 border-r border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.12)] transition-transform duration-300 lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-500 text-sm font-bold text-white">
              P
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Menu
              </p>
              <h2 className="text-base font-bold text-slate-800">PrepPilot AI</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <nav className="space-y-2 p-4">
          {navItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNavigation(item.path)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <i
                  className={`${item.icon} ${
                    active ? "text-blue-600" : "text-slate-500"
                  }`}
                />
                {item.label}
              </button>
            );
          })}

          <div className="mt-4 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
            >
              <i className="fa-solid fa-arrow-right-from-bracket" />
              Logout
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default PrivateNavbar;