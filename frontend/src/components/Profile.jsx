import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer,toast } from "react-toastify";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phnumber: "",
    targetrole: "",
    experiencelevel: "",
    preferredcompany: "",
    skills: ""
});
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingCareer, setEditingCareer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        const user = data.user || data;

        setProfile({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phnumber: user.phnumber || "",
    targetrole: user.targetrole || "",
    experiencelevel: user.experiencelevel || "",
    preferredcompany: user.preferredcompany || "",
    skills: Array.isArray(user.skills)
        ? user.skills.join(", ")
        : user.skills || "",
});
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const fullName = useMemo(() => {
    const name = `${profile.firstName} ${profile.lastName}`.trim();
    return name || "Your Name";
  }, [profile.firstName, profile.lastName]);

  const initials = useMemo(
    () =>
      fullName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    [fullName]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((previous) => ({ ...previous, [name]: value }));
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/auth/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          skills: profile.skills,
          email: profile.email,
          phnumber: profile.phnumber,
          targetrole:profile.targetrole,
          experiencelevel: profile.experiencelevel,
          preferredcompany: profile.preferredcompany
        }),
        }
      );

      if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
        errorData.message || "Failed to update profile"
    );
}
 toast.success("Updated Successfully!", {
        position: "top-right",
        autoClose: 2000,
        theme: "light",
      });

      setEditingPersonal(false);
      setEditingCareer(false);
    } catch (error) {
    toast.error(error.message || "Cannot Update", {
            position: "top-right",
            autoClose: 4000,
            theme: "light",
          })}
    finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eef4ff] text-slate-500">
        <i className="fa-solid fa-spinner fa-spin mr-2 text-blue-600" />
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef4ff] px-4 py-6 text-slate-800 md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Account
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Your Profile
          </h1>
           <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
          <p className="mt-2 text-slate-500">
            Manage your personal details and career preferences in one place.
          </p>
        </div>

        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#0f172a] via-[#1d4ed8] to-[#22d3ee] p-6 text-white shadow-[0_16px_40px_rgba(29,78,216,0.25)] md:p-8">
          <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-white/10" />

          <div className="relative flex flex-col items-center gap-5 sm:flex-row">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white/40 bg-white text-3xl font-bold text-blue-700 shadow-lg">
              {initials}
            </div>

            <div className="text-center sm:text-left">
              <p className="text-sm text-blue-100">Welcome to your profile</p>
              <h2 className="mt-1 text-2xl font-bold">{fullName}</h2>
              <p className="mt-1 text-sm text-blue-100">
                {profile.email || "Email not added"}
              </p>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Personal Information
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Keep your contact details up to date.
                </p>
              </div>
              <i className="fa-solid fa-user text-xl text-blue-500" />
            </div>

            <div className="mt-6 space-y-4">
              {editingPersonal ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-sm font-semibold text-slate-700">
                      First name
                      <input
                        name="firstName"
                        value={profile.firstName}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </label>

                    <label className="text-sm font-semibold text-slate-700">
                      Last name
                      <input
                        name="lastName"
                        value={profile.lastName}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </label>
                  </div>

                  <label className="block text-sm font-semibold text-slate-700">
                    Email
                    <input
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </label>

                  <label className="block text-sm font-semibold text-slate-700">
                    Phone number{" "}
                    <span className="font-normal text-slate-400">
                      (optional)
                    </span>
                    <input
                      name="phnumber"
                      type="tel"
                      value={profile.phnumber}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </label>
                </>
              ) : (
                <>
                  <InfoRow
                    icon="fa-solid fa-id-card"
                    label="Full name"
                    value={fullName === "Your Name" ? "" : fullName}
                  />
                  <InfoRow
                    icon="fa-solid fa-envelope"
                    label="Email"
                    value={profile.email}
                  />
                  <InfoRow
                    icon="fa-solid fa-phone"
                    label="Phone number"
                    value={profile.phnumber}
                  />
                </>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">
              {editingPersonal && (
                <button
                  type="button"
                  onClick={() => setEditingPersonal(false)}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
              )}

              <button
                type="button"
                onClick={() =>
                  editingPersonal ? saveProfile() : setEditingPersonal(true)
                }
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
              >
                {editingPersonal
                  ? saving
                    ? "Saving..."
                    : "Save Changes"
                  : "Edit Profile"}
              </button>
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Career Information
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Personalize your preparation experience.
                </p>
              </div>
              <i className="fa-solid fa-briefcase text-xl text-violet-500" />
            </div>

            <div className="mt-6 space-y-4">
              {editingCareer ? (
                <>
                  <Field
                    label="Target role"
                    name="targetrole"
                    value={profile.targetrole}
                    onChange={handleChange}
                    placeholder="e.g. Frontend Developer"
                  />

                  <label className="block text-sm font-semibold text-slate-700">
                    Experience level
                    <select
                      name="experiencelevel"
                      value={profile.experiencelevel}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select experience level</option>
                      <option value="Student">Student</option>
                      <option value="Entry Level">Entry Level</option>
                      <option value="Mid Level">Mid Level</option>
                      <option value="Senior Level">Senior Level</option>
                    </select>
                  </label>

                  <Field
                    label="Preferred company"
                    name="preferredcompany"
                    value={profile.preferredcompany}
                    onChange={handleChange}
                    placeholder="e.g. Microsoft"
                  />

                  <Field
                    label="Skills"
                    name="skills"
                    value={profile.skills}
                    onChange={handleChange}
                    placeholder="React, JavaScript, Node.js"
                  />
                </>
              ) : (
                <>
                  <InfoRow
                    icon="fa-solid fa-bullseye"
                    label="Target role"
                    value={profile.targetrole}
                  />
                  <InfoRow
                    icon="fa-solid fa-layer-group"
                    label="Experience level"
                    value={profile.experiencelevel}
                  />
                  <InfoRow
                    icon="fa-solid fa-building"
                    label="Preferred company"
                    value={profile.preferredcompany}
                  />
                  <InfoRow
                    icon="fa-solid fa-code"
                    label="Skills"
                    value={profile.skills}
                  />
                </>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">
              {editingCareer && (
                <button
                  type="button"
                  onClick={() => setEditingCareer(false)}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
              )}

              <button
                type="button"
                onClick={() =>
                  editingCareer ? saveProfile() : setEditingCareer(true)
                }
                className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 cursor-pointer"
              >
                {editingCareer
                  ? saving
                    ? "Saving..."
                    : "Save Information"
                  : "Add Information"}
              </button>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
          <h2 className="text-xl font-bold text-slate-900">Account Settings</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage your account access and security.
          </p>

          <div className="mt-5 divide-y divide-slate-100">
            <button
              type="button"
              onClick={() => navigate("/change-password")}
              className="flex w-full items-center justify-between py-4 text-left transition hover:text-blue-600 cursor-pointer"
            >
              <span className="flex items-center gap-3 font-semibold">
                <i className="fa-solid fa-lock text-blue-500" />
                Change Password
              </span>
              <i className="fa-solid fa-chevron-right text-sm text-slate-400" />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-between py-4 text-left font-semibold text-red-600 transition hover:text-red-700 cursor-pointer"
            >
              <span className="flex items-center gap-3">
                <i className="fa-solid fa-right-from-bracket" />
                Logout
              </span>
              <i className="fa-solid fa-chevron-right text-sm text-red-300" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
      <i className={icon} />
    </div>
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-700">
        {value || "Not added yet"}
      </p>
    </div>
  </div>
);

const Field = ({ label, name, value, onChange, placeholder }) => (
  <label className="block text-sm font-semibold text-slate-700">
    {label}
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />
  </label>
);

export default Profile;