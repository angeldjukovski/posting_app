"use client";
import React, { useState } from "react";
import { useAuth } from "@/app/context/Auth.context";
import { useSearchParams } from "next/navigation";


export const ResetPassword = () => {
  const searchParams = useSearchParams()
  const  token = searchParams.get('token')
  const { resetPassword } = useAuth();

  const [form, setForm] = useState({
    newpassword: "",
    confirmpassword : ''
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(false);

     if (form.newpassword !== form.confirmpassword) {
      setError("Passwords do not match");
      return;
    }

   
    try {
      await resetPassword( token!,form.newpassword);
      setSuccess("The password is changed");
    } catch {
      setError( "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">Reset Your password</legend>
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
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}
        <button className="btn btn-neutral mt-4" disabled={loading}>
          {loading ? "Sending" : "Reset Password"}
        </button>
      </fieldset>
    </form>
  );
};
