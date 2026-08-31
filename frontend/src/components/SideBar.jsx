import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <i className="fa-solid fa-table-columns" />,
  },
  {
    label: "Interview Prep",
    href: "/interview-prep",
    icon: <i className="fa-solid fa-microphone-lines" />,
  },
  {
    label: "Resume Analyzer",
    href: "/resume-analyzer",
    icon: <i className="fa-solid fa-file-lines" />,
  },
  {
    label: "Company Prep",
    href: "/company-prep",
    icon: <i className="fa-solid fa-building" />,
  },
  {
    label: "Progress",
    href: "/progress",
    icon: <i className="fa-solid fa-chart-line" />,
  },
];

const SideBar = () => {
  const navigate = useNavigate();

  const handleNavigation = (event, href) => {
    event.preventDefault();

    if (window.startViewTransition) {
      document.startViewTransition(() => {
        navigate(href);
      });
    } else {
      navigate(href);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sticky left-0 top-0 z-40 hidden h-screen w-[250px] shrink-0 flex-col border-r border-slate-800 bg-[#09111d] px-4 py-5 text-slate-100 shadow-[0_0_40px_rgba(15,23,42,0.18)] lg:flex">
      <div className="mb-8 flex items-center justify-between border-b border-slate-800 pb-5">
        <NavLink
          to="/dashboard"
          onClick={(event) => handleNavigation(event, "/dashboard")}
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 text-lg font-black text-white shadow-[0_8px_25px_rgba(59,130,246,0.4)]">
            P
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300">
              PrepPilot
            </p>
            <span className="text-base font-bold text-white">AI</span>
          </div>
        </NavLink>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.href}
            onClick={(event) => handleNavigation(event, item.href)}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[0_12px_24px_rgba(59,130,246,0.32)]"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-xl text-base ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "bg-slate-800 text-white group-hover:bg-slate-700"
                  }`}
                >
                  {item.icon}
                </span>

                <span className="tracking-wide">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 border-t border-slate-800 pt-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-red-300 transition-all duration-200 hover:bg-red-500/10 hover:text-red-200 cursor-pointer"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-500/10 text-base text-white">
            <i className="fa-solid fa-right-from-bracket" />
          </span>

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;