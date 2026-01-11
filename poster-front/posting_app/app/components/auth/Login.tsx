"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/Auth.context";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const Login = () => {
  const { login } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form.email, form.password);
      router.push("/profile");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">Login</legend>

        <label className="label">Email</label>
        <input
          name="email"
          type="email"
          className="input"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label className="label">Password</label>
        <input
          name="password"
          type="password"
          className="input"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <button className="btn btn-neutral mt-4" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-3 text-sm">
          Forgot password?
          <Link href="/verify-email" className="ml-1 link link-primary">
            Reset here
          </Link>
        </p>

        <p className="mt-3 text-sm">
          Dont have an account?
          <Link href="/register" className="ml-1 link link-primary">
            Sign up
          </Link>
        </p>
      </fieldset>
    </form>
  );
};
