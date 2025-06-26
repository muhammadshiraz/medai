// src/context/SettingsContext.tsx
"use client";
import { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";
export type Language = "en" | "es" | "fr";

interface SettingsContextType {
  theme: Theme;
  language: Language;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  toggleTheme: () => void;
}

const SettingsContext = createContext<SettingsContextType>(
  {} as SettingsContextType
);

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Initialize state with localStorage values or defaults
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "light";
    }
    return "light";
  });

  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("language") as Language) || "en";
    }
    return "en";
  });

  // Update HTML class and localStorage when theme changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.className = theme;
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  // Update localStorage when language changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("language", language);
    }
  }, [language]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <SettingsContext.Provider
      value={{ theme, language, setTheme, setLanguage, toggleTheme }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
