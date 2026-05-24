"use client";

import { useRouter } from "next/navigation";
import { Sun, Moon, ArrowLeft } from "lucide-react";
import { usePreferences } from "@/context/PreferencesContext";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, currency, setCurrency, toggleTheme } = usePreferences();

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0f2fe] via-[#ecfdf5] to-[#e8f5e9] p-4 sm:p-8">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl sm:rounded-3xl w-full max-w-lg p-5 sm:p-10 border border-green-200">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition-all"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-8 text-gray-800">
          Settings
        </h2>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-[#f9fefb] p-4 rounded-xl mb-6 border border-green-100 shadow-sm">
          <div>
            <h3 className="text-lg font-medium text-gray-800">Theme</h3>
            <p className="text-sm text-gray-500">
              Switch between light and dark mode
            </p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="self-start sm:self-auto p-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md hover:scale-105 transition-all"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="bg-[#f9fefb] p-4 rounded-xl border border-green-100 shadow-sm mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Currency</h3>
          <select
            value={currency}
            onChange={handleCurrencyChange}
            className="w-full p-3 border border-green-200 rounded-xl bg-white focus:ring-2 focus:ring-green-400 outline-none text-gray-700 shadow-sm"
          >
            <option value="₹">₹ Indian Rupee (INR)</option>
            <option value="$">$ US Dollar (USD)</option>
            <option value="€">€ Euro (EUR)</option>
            <option value="£">£ British Pound (GBP)</option>
            <option value="¥">¥ Japanese Yen (JPY)</option>
          </select>
        </div>

        <div className="text-center text-sm text-gray-500 mt-6">
          Preferences are saved automatically
        </div>
      </div>
    </div>
  );
}
