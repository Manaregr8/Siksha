"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Ensures the underlying exception (and digest) appears in Vercel logs.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-slate-900/5 bg-white p-6 shadow-md dark:border-white/10 dark:bg-slate-900">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Something went wrong</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{error.message}</p>
        {error.digest ? (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Digest: <span className="font-mono">{error.digest}</span>
          </p>
        ) : null}
        <button
          type="button"
          onClick={reset}
          className="mt-6 h-11 rounded-xl bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
