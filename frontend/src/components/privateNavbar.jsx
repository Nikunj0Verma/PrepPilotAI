import React, { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"

const pageTitles = {
  "/dashboard": "Dashboard",
  "/interview-prep": "Interview Prep",
  "/resume-analyzer": "Resume Analyzer",
  "/company-prep": "Company Prep",
  "/progress": "Progress",
}

const PrivateNavbar = () => {
  const [userName, setUserName] = useState("");
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const token =localStorage.getItem("token");
          const response = await fetch("http://localhost:5000/api/auth/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setUserName(data.user);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
  
      fetchUserData();
    }, []);
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"
}
  const pageTitle = pageTitles[location.pathname] || "Dashboard"

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-blue-100 bg-white/90 px-5 shadow-sm backdrop-blur-md md:px-8">
      <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
        {pageTitle}
      </h1>

      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-blue-50 cursor-pointer"
          aria-expanded={isOpen}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 font-bold text-white shadow-md shadow-blue-200">
            {userName?.firstName?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <span className="hidden text-sm font-semibold text-gray-700 sm:inline">
            {userName?.firstName}
          </span>

          <span className="text-gray-500">{isOpen ? "▲" : "▼"}</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-blue-100 bg-white p-4 shadow-xl shadow-blue-100/50">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 font-bold text-white">
                {userName?.firstName?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900">
                  {userName?.firstName} {userName?.lastName}
                </p>
                <p className="truncate text-sm text-gray-500">{userName?.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="mt-3 flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-red-500 transition hover:bg-red-50 w-full cursor-pointer"
            >
              <i className="fa-solid fa-arrow-right-from-bracket" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default PrivateNavbar