"use client";

import { useEffect, useState } from "react";
import { AdminForm } from "@/components/AdminForm";

export default function AdminPage() {
  const [token, setToken] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const saved = window.localStorage.getItem("admin_token") || "";
    if (saved) setToken(saved);
  }, []);

  async function login() {
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json?.error || "Login failed");
      return;
    }

    const t = json?.token as string;
    if (!t) {
      setError("Login failed");
      return;
    }

    window.localStorage.setItem("admin_token", t);
    setToken(t);
  }

  function logout() {
    window.localStorage.removeItem("admin_token");
    setToken("");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Admin
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Secure dashboard (JWT-protected API routes)
          </p>
        </div>
        {token ? (
          <button
            type="button"
            onClick={logout}
            className="h-10 rounded-xl border border-slate-900/10 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Logout
          </button>
        ) : null}
      </div>

      {token ? (
        <div className="mt-8">
          <AdminForm token={token} />
        </div>
      ) : (
        <div className="mt-8 max-w-md rounded-xl border border-slate-900/5 bg-white p-6 shadow-md dark:border-white/10 dark:bg-slate-900">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Login</h2>
          <div className="mt-4 space-y-3">
            <label className="block">
              <div className="mb-1 text-xs font-medium text-slate-600 dark:text-slate-300">Email</div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-900/5 bg-white px-3 text-sm text-slate-900 outline-none dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />
            </label>
            <label className="block">
              <div className="mb-1 text-xs font-medium text-slate-600 dark:text-slate-300">Password</div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-900/5 bg-white px-3 text-sm text-slate-900 outline-none dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />
            </label>
            {error ? (
              <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {error}
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => login().catch((e) => setError(e.message))}
              className="mt-2 h-11 w-full rounded-xl bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
