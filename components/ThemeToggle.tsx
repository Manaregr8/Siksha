"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-xl border border-slate-900/10 bg-white/70 px-3 py-1.5 text-sm font-medium text-slate-800 backdrop-blur transition-colors hover:bg-white dark:border-white/15 dark:bg-slate-950/35 dark:text-slate-100 dark:hover:bg-slate-950/50"
      aria-label="Toggle theme"
    >
      {mounted ? (isDark ? "Dark mode" : "Light mode") : "Theme"}
    </button>
  );
}
