"use client";

import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export const ThemeSelector = () => {
  const [theme, setTheme] = useState("light");

  const handleToggle = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  useEffect(() => {
    const themeStr: string = localStorage.getItem("theme") || "light";
    setTheme(themeStr);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const localTheme = localStorage.getItem("theme");
    // @ts-expect-error it just works, leave it alone please c:
    document.querySelector("html").setAttribute("data-theme", localTheme);
  }, [theme]);

  return (
    <a
      className={"font-bold text-xl hover:cursor-pointer"}
      onClick={handleToggle}
    >
      {theme === "light" ? (
        <FaSun className="swap-on" />
      ) : (
        <FaMoon className="swap-off" />
      )}
    </a>
  );
};
