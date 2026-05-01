"use client";
import { useAuth } from "@/app/context/Auth.context";
import React, { useState } from "react";
import { User } from "@/app/types/user";

export const AccInfo = () => {
  const { user, updateProfile, deleteUser } = useAuth();
  const [form, setForm] = useState<Partial<User>>({});
  const [isEditing, setEditing] = useState(false);
  const [prevUserId, setPrevUserId] = useState<number | undefined>(user?.id);

  if (user && user.id !== prevUserId) {
    setPrevUserId(user.id);
    setForm({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  }
  if (!user) return <div className="p-4">Loading account...</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await updateProfile(form);
      setEditing(false);
    } catch (error) {
      console.error("update error", error);
    }
  };
  const handleDelete = async () => {
    const confirmed = window.confirm("Do you wish to delete your account");
    if (!confirmed) return;
    try {
      await deleteUser(user.id);
      window.location.href = "/login";
    } catch (error) {
      console.error("Delete failed", error);
    }
  };
  const handleCancel = () => {
    setForm({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
    setEditing(false);
  };
  return (
    <div className="card p-6 bg-base-100 shadow-xl border w-full max-w-md">
      <h2 className="font-bold text-xl mb-4">Account Settings</h2>

      {isEditing ? (
        <div className="flex flex-col gap-3">
          <div className="form-control">
            <label className="label font-semibold text-xs uppercase">
              Username
            </label>
            <input
              className="input input-bordered w-full"
              name="username"
              value={form.username || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-control">
            <label className="label font-semibold text-xs uppercase">
              Email
            </label>
            <input
              className="input input-bordered w-full"
              name="email"
              type="email"
              value={form.email || ""}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="form-control">
              <label className="label font-semibold text-xs uppercase">
                First Name
              </label>
              <input
                className="input input-bordered w-full"
                name="firstName"
                value={form.firstName || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-control">
              <label className="label font-semibold text-xs uppercase">
                Last Name
              </label>
              <input
                className="input input-bordered w-full"
                name="lastName"
                value={form.lastName || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <button onClick={handleUpdate} className="btn btn-success flex-1">
              Save
            </button>
            <button onClick={handleCancel} className="btn btn-ghost flex-1">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p>
            <b>Username:</b> @{user.username}
          </p>
          <p>
            <b>Email:</b> {user.email}
          </p>
          <p>
            <b>Name:</b> {user.firstName} {user.lastName}
          </p>

          <button
            onClick={() => setEditing(true)}
            className="btn btn-primary btn-outline btn-block mt-4"
          >
            Edit Profile
          </button>
        </div>
      )}

      <button
        onClick={handleDelete}
        className="btn btn-primary btn-outline btn-block mt-4"
      >
        Delete My Account
      </button>
    </div>
  );
};
