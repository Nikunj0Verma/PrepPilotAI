import React from "react";
import {useEffect, useState} from "react";

const quickAccessItems = [
  {
    title: "AI Mock Interview",
    description:
      "Practice realistic interviews and receive instant AI feedback.",
    button: "Start Interview",
    href: "/interview-prep",
    icon: "fa-solid fa-microphone",
  },
  {
    title: "Resume Analyzer",
    description:
      "Improve your resume with personalized analysis and suggestions.",
    button: "Analyze Resume",
    href: "/resume-analyzer",
    icon: "fa-solid fa-file-lines",
  },
  {
    title: "Company Preparation",
    description:
      "Explore company insights and prepare for your dream organization.",
    button: "Explore Companies",
    href: "/company-prep",
    icon: "fa-solid fa-building",
  },
  {
    title: "Progress Tracking",
    description: "Track your preparation journey, scores, and improvements.",
    button: "View Progress",
    href: "/progress",
    icon: "fa-solid fa-chart-line",
  },
];

const recentActivities = [
  {
    title: "AI Mock Interview",
    detail: "Technical Interview",
    value: "86%",
    time: "2 days ago",
    icon: "fa-solid fa-microphone",
    color: "text-blue-600 bg-blue-100",
  },
  {
    title: "Resume Analysis",
    detail: "Resume score",
    value: "78%",
    time: "5 days ago",
    icon: "fa-solid fa-file-lines",
    color: "text-indigo-600 bg-indigo-100",
  },
  {
    title: "Company Preparation",
    detail: "Google",
    value: "Completed",
    time: "8 days ago",
    icon: "fa-solid fa-building",
    color: "text-cyan-600 bg-cyan-100",
  },
];

const Dashboard = () => {
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
  return (
    <div className="space-y-6 p-4 md:p-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 p-5 text-white shadow-xl shadow-blue-200 md:p-7">
        <p className="text-sm font-medium text-blue-100">Welcome back,</p>

        <h1 className="mt-1 text-2xl font-bold md:text-3xl">{userName?.firstName}!</h1>

        <p className="mt-2 text-sm text-blue-50 md:text-base">
          Ready to improve your interview performance today?
        </p>

        <a
          href="/interview-prep"
          className="mt-4 inline-flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-blue-600 shadow-lg transition hover:scale-105 hover:bg-blue-50"
        >
          Start Interview
          <i className="fa-solid fa-arrow-right ml-3" />
        </a>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-900">Quick Access</h2>
          <p className="mt-1 text-gray-500">
            Continue your preparation from where you left off.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {quickAccessItems.map((item) => (
            <div
              key={item.title}
              className="flex flex-col rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl text-blue-600">
                <i className={item.icon} />
              </div>

              <h3 className="mt-4 text-lg font-bold text-gray-900">
                {item.title}
              </h3>

              <p className="mt-2 flex-1 text-sm leading-6 text-gray-500">
                {item.description}
              </p>

              <a
                href={item.href}
                className="mt-5 inline-flex items-center font-semibold text-blue-600 transition hover:text-indigo-600"
              >
                {item.button}
                <i className="fa-solid fa-arrow-right ml-2 text-sm" />
              </a>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
          <p className="mt-1 text-gray-500">
            Review your latest preparation activities.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
          {recentActivities.map((activity, index) => (
            <div
              key={activity.title}
              className={`flex flex-wrap items-center gap-4 p-5 ${
                index !== recentActivities.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${activity.color}`}
              >
                <i className={activity.icon} />
              </div>

              <div className="min-w-[180px] flex-1">
                <h3 className="font-semibold text-gray-900">
                  {activity.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{activity.detail}</p>
              </div>

              <p className="text-sm text-gray-500">{activity.time}</p>

              <p className="min-w-24 text-right font-bold text-blue-600">
                {activity.value}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
