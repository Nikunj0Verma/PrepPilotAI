import React from "react"

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: <i class="fa-solid fa-table-columns" style={{ color: "#615298" }}></i> },
  { label: "Interview Prep", href: "/interview-prep", icon: <i class="fa-solid fa-podcast" style={{ color: "#615298" }}></i> },
  { label: "Resume Analyzer", href: "/resume-analyzer", icon:<i class="fa-solid fa-file" style={{ color: "#615298" }}></i> },
  { label: "Company Prep", href: "/company-prep", icon: <i class="fa-solid fa-building" style={{ color: "#615298" }}></i> },
  { label: "Progress", href: "/progress", icon: <i class="fa-solid fa-chart-line" style={{ color: "#615298" }}></i> },
]

const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"
}

const SideBar = () => {
  return (
    <aside className="sticky left-0 top-0 z-40 flex h-screen w-20 shrink-0 flex-col border-r border-blue-100 bg-white/95 px-3 py-5 shadow-xl shadow-blue-100/40 backdrop-blur-md md:w-64 md:px-5">
      <a href="/" className="mb-10 flex items-center justify-center gap-3 md:justify-start">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 text-xl font-black text-white shadow-lg shadow-blue-200">
          P
        </div>

        <span className="hidden bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-lg font-bold text-transparent md:inline">
          PrepPilot AI
        </span>
      </a>

      <nav className="flex flex-1 flex-col gap-2">
        {menuItems.map((item, index) => (
          <a
            key={item.label}
            href={item.href}
            className={`flex items-center justify-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition md:justify-start ${
              index === 0
                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            <span className="w-6 text-center text-lg">{item.icon}</span>
            <span className="hidden md:inline">{item.label}</span>
          </a>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50 md:justify-start cursor-pointer"
      >
        <span className="w-6 text-center text-lg"><i class="fa-solid fa-arrow-right-from-bracket" style={{ color: "#615298" }}></i></span>
        <span className="hidden md:inline">Logout</span>
      </button>
    </aside>
  )
}

export default SideBar