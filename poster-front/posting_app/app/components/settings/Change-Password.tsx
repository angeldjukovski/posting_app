"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/Auth.context";

export const ChangePassword = () => {
  const { changePassword } = useAuth();
  const [form, setForm] = useState({
    currentpassword: "",
    newpassword: "",
    confirmpassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    setSuccess("");

    if (form.newpassword !== form.confirmpassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await changePassword(form.currentpassword, form.newpassword);
      setSuccess("The Password is changed")
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">Change Your password</legend>
        <label className="label"> Current Password</label>
        <input
          name="currentpassword"
          type="password"
          className="input"
          placeholder="Enter Your Current Password"
          value={form.currentpassword}
          onChange={handleChange}
          required
        />

        <label className="label"> New Password</label>
        <input
          name="newpassword"
          type="password"
          className="input"
          placeholder="Enter Your New Password"
          value={form.newpassword}
          onChange={handleChange}
          required
        />

        <label className="label">Confirm Password</label>
        <input
          name="confirmpassword"
          type="password"
          className="input"
          placeholder="Confirm Your Password"
          value={form.confirmpassword}
          onChange={handleChange}
          required
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}
        <button className="btn btn-neutral mt-4" disabled={loading}>
          {loading ? "Changing" : "Change Password"}
        </button>
      </fieldset>
    </form>
  );
};
