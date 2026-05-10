"use client";

import { useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const resolved = stored ?? "light";
    setThemeState(resolved);
    applyTheme(resolved);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    localStorage.setItem("theme", next);
    applyTheme(next);
  }, []);

  return { theme, setTheme };
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
    root.removeAttribute("data-theme");
  } else {
    root.classList.remove("dark");
    // data-theme="light" neutralises any @media(prefers-color-scheme:dark) blocks
    // that may still be in a cached stylesheet
    root.setAttribute("data-theme", "light");
  }
}
