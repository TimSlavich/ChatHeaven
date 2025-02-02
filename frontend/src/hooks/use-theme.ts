import { useEffect, useState } from "react";

/**
 * Custom hook for managing dark mode.
 */
export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "dark"
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    localStorage.setItem("darkMode", newTheme);
    setIsDarkMode(!isDarkMode);
  };

  return { isDarkMode, toggleTheme };
};
