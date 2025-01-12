"use client";

import { useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useLocalSettingsContext } from "../utils/LocalSettingsContext.tsx";

export const ThemeSelector = () => {
  const { options, setLocalOptions } = useLocalSettingsContext();

  const handleToggle = () => {
    if (options.theme === "light") {
      setLocalOptions("theme", "dark");
    } else {
      setLocalOptions("theme", "light");
    }
  };

  useEffect(() => {
    // @ts-expect-error it just works, leave it alone please c:
    document.querySelector("html").setAttribute("data-theme", options.theme);
  }, [options.theme]);

  return (
    <a
      className={"font-bold text-xl hover:cursor-pointer"}
      onClick={handleToggle}
    >
      {options.theme === "light" ? (
        <FaMoon className="swap-off" />
      ) : (
        <FaSun className="swap-on" />
      )}
    </a>
  );
};
