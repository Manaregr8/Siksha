"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type Props = {
  actionPath?: string;
  placeholder?: string;
  defaultValue?: string;
};

export function SearchBar({
  actionPath = "/colleges",
  placeholder = "Search colleges, courses, city…",
  defaultValue,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initial = useMemo(() => {
    if (typeof defaultValue === "string") return defaultValue;
    return searchParams?.get("search") ?? "";
  }, [defaultValue, searchParams?.toString()]);

  const [value, setValue] = useState(initial);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (value.trim()) params.set("search", value.trim());
    else params.delete("search");
    params.delete("page");
    router.push(`${actionPath}?${params.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex w-full items-center gap-3 rounded-xl border border-slate-900/5 bg-white p-2 shadow-md dark:border-white/10 dark:bg-slate-900">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="h-11 w-full rounded-xl bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-500 dark:text-white"
        />
        <button
          type="submit"
          className="h-11 shrink-0 rounded-xl bg-blue-600 px-5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Search
        </button>
      </div>
    </form>
  );
}
