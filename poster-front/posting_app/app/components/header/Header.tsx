"use client";

import Link from "next/link";
import { useContext, useEffect } from "react";
import { useAuth } from "@/app/context/Auth.context";
import { useSearch } from "@/app/context/Search.context";
import { SearchCard } from "../search-card/SearchCard";

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { query, setQuery, search, users, posts } = useSearch();

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query) {
        search(query);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [query, search]);
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <div className="navbar bg-base-100 shadow-sm px-4">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          Poster
        </Link>
      </div>

      <div className="flex gap-2 items-center relative">
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={handleSearch}
          className="input input-bordered w-32 md:w-64"
        />
        {query && (
          <div className="absolute top-12 right-0 w-80 bg-base-100 shadow-lg rounded p-2 z-50">
            {users.length === 0 && posts.length === 0 ? (
              <p className="text-sm text-gray-500">No results</p>
            ) : (
              <>
                <div>
                  <p className="font-bold">Users</p>
                  {users.map((u) => (
                    <SearchCard key={u.id} user={u} />
                  ))}
                </div>

                <div className="mt-2">
                  <p className="font-bold">Posts</p>
                  {posts.map((p) => (
                    <SearchCard key={p.id} post={p} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {!isAuthenticated && (
        <div className="flex gap-2">
          <Link href="/login" className="btn btn-ghost">
            Login
          </Link>
          <Link href="/register" className="btn btn-primary">
            Register
          </Link>
        </div>
      )}

      {isAuthenticated && user && (
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full bg-primary text-white flex items-center justify-center">
              {user.username[0].toUpperCase()}
            </div>
          </div>

          <ul
            tabIndex={0}
            className="menu dropdown-content mt-3 z-[50]:1 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href="/profile">
                Profile
                <span className="badge">New</span>
              </Link>
            </li>
            <li>
              <Link href="/settings">Settings</Link>
            </li>
            <li>
              <button onClick={logout} className="text-error">
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
