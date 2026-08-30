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
    icon: <i className="fa-solid fa-podcast" />,
  },
  {
    label: "Resume Analyzer",
    href: "/resume-analyzer",
    icon: <i className="fa-solid fa-file" />,
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
    <aside className="sticky left-0 top-0 z-40 flex h-screen w-20 shrink-0 flex-col border-r border-blue-100 bg-white/95 px-3 py-5 shadow-xl backdrop-blur-md md:w-64 md:px-5">
      <NavLink
        to="/dashboard"
        onClick={(event) => handleNavigation(event, "/dashboard")}
        className="mb-10 flex items-center justify-center gap-3 md:justify-start"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 text-xl font-black text-white shadow-lg shadow-blue-200">
          P
        </div>

        <span className="hidden bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-lg font-bold text-transparent md:inline">
          PrepPilot AI
        </span>
      </NavLink>

      <nav className="flex flex-1 flex-col gap-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.href}
            onClick={(event) => handleNavigation(event, item.href)}
            className={({ isActive }) =>
              `flex items-center justify-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300 md:justify-start ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`w-6 text-center text-lg ${
                    isActive ? "text-white" : "text-[#615298]"
                  }`}
                >
                  {item.icon}
                </span>

                <span className="hidden md:inline">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="flex cursor-pointer items-center justify-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-500 transition-all duration-300 hover:bg-red-50 md:justify-start"
      >
        <span className="w-6 text-center text-lg text-[#615298]">
          <i className="fa-solid fa-arrow-right-from-bracket" />
        </span>

        <span className="hidden md:inline">Logout</span>
      </button>
    </aside>
  );
};

export default SideBar;