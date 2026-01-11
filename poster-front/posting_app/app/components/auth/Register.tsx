"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/Auth.context";
import { useRouter } from "next/navigation";

export const Register = () => {
  const { register } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await register(
        form.username,
        form.email,
        form.firstName,
        form.lastName,
        form.password
      );
      router.push("/profile");
    } catch {
      setError("Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">Register</legend>

        <label className="label">Username</label>
        <input
          name="username"
          className="input"
          value={form.username}
          onChange={handleChange}
        />

        <label className="label">Email</label>
        <input
          name="email"
          type="email"
          className="input"
          value={form.email}
          onChange={handleChange}
        />

        <label className="label">First Name</label>
        <input
          name="firstName"
          className="input"
          value={form.firstName}
          onChange={handleChange}
        />

        <label className="label">Last Name</label>
        <input
          name="lastName"
          className="input"
          value={form.lastName}
          onChange={handleChange}
        />

        <label className="label">Password</label>
        <input
          name="password"
          type="password"
          className="input"
          value={form.password}
          onChange={handleChange}
        />

        <label className="label">Confirm Password</label>
        <input
          name="confirmPassword"
          type="password"
          className="input"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <button className="btn btn-neutral mt-4" type="submit">
          Register
        </button>
      </fieldset>
    </form>
  );
};
