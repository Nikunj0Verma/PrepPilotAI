import React, { useState } from "react";
import { toast,ToastContainer } from "react-toastify";

const Change_Password = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    if (newPassword === currentPassword) {
      toast.error("New password must be different from your current password");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Session expired. Please log in again.");
        return;
      }

      const res = await fetch("http://localhost:5000/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to change password");
      }

      toast.success("Password changed successfully");

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_20px_50px_rgba(15,23,42,0.10)]">
        <div className="mb-6">
          <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-indigo-700">
            Security
          </span>
          <h2 className="mt-4 text-3xl font-bold text-slate-900">Change Password</h2>
          <p className="mt-2 text-sm text-slate-500">
            Update your password to keep your account secure.
          </p>
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
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <PasswordField
            label="Current Password"
            name="currentPassword"
            value={formData.currentPassword}
            placeholder="Enter your current password"
            show={showPasswords.currentPassword}
            onChange={handleChange}
            onToggle={() => togglePasswordVisibility("currentPassword")}
          />

          <PasswordField
            label="New Password"
            name="newPassword"
            value={formData.newPassword}
            placeholder="Enter a new password"
            show={showPasswords.newPassword}
            onChange={handleChange}
            onToggle={() => togglePasswordVisibility("newPassword")}
          />

          <PasswordField
            label="Confirm New Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            placeholder="Re-enter your new password"
            show={showPasswords.confirmPassword}
            onChange={handleChange}
            onToggle={() => togglePasswordVisibility("confirmPassword")}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
          >
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

const PasswordField = ({
  label,
  name,
  value,
  placeholder,
  show,
  onChange,
  onToggle,
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-700">{label}</label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
      />


      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
      >
        <img className="h-5 w-5" src= {show ? "./images/eyecross.png" : "./images/eye.png"} alt="" />
       
      </button>
    </div>
  </div>
);

export default Change_Password;