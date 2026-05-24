"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const PreferencesContext = createContext(null);

const DEFAULT_THEME = "light";
const DEFAULT_CURRENCY = "₹";

export function PreferencesProvider({ children }) {
  const [theme, setThemeState] = useState(DEFAULT_THEME);
  const [currency, setCurrencyState] = useState(DEFAULT_CURRENCY);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const savedTheme = localStorage.getItem("theme") || DEFAULT_THEME;
      const savedCurrency = localStorage.getItem("currency") || DEFAULT_CURRENCY;

      setThemeState(savedTheme);
      setCurrencyState(savedCurrency);
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  const value = useMemo(
    () => ({
      theme,
      currency,
      setTheme: setThemeState,
      setCurrency: setCurrencyState,
      toggleTheme: () =>
        setThemeState((currentTheme) =>
          currentTheme === "light" ? "dark" : "light"
        ),
      formatCurrency: (amount) =>
        `${currency}${Number(amount || 0).toLocaleString("en-IN")}`,
    }),
    [currency, theme]
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error("usePreferences must be used inside PreferencesProvider");
  }

  return context;
}
