"use client";

import { useEffect, useState, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL, API_URL } from "@/utils/config";

/**
 * Dashboard page (JS) — Section-by-section skeleton loading + animations
 *
 * Drop this into: app/dashboard/page.jsx
 */

// Small reusable motion variants
const containerVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.12 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

// Simple skeleton block using Tailwind's animate-pulse
function SkeletonBlock({ className = "h-6" }) {
  return (
    <div className={`bg-gray-200 rounded-md animate-pulse ${className}`} />
  );
}

export default function DashboardPage() {
  const [profile, setProfile] = useState({});
  const [summary, setSummary] = useState({ income: 0, totalExpense: 0 });
  const [recent, setRecent] = useState([]);
  const [categories, setCategories] = useState([]);

  // independent loading flags
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const router = useRouter();

  const fetchProfile = useCallback(async (headers) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, { headers });
      if (res.status === 401) {
        localStorage.removeItem("accessToken");
        router.push("/login");
        return null;
      }
      return await res.json();
    } catch (err) {
      console.error("profile fetch error", err);
      return null;
    }
  }, [router]);

  const fetchSummary = useCallback(async (headers) => {
    try {
      const res = await fetch(`${API_BASE_URL}/expenses/summary`, { headers });
      if (res.status === 401) {
        localStorage.removeItem("accessToken");
        router.push("/login");
        return null;
      }
      return await res.json();
    } catch (err) {
      console.error("summary fetch error", err);
      return null;
    }
  }, [router]);

  const fetchRecent = useCallback(async (headers) => {
    try {
      const res = await fetch(`${API_BASE_URL}/expenses/recent`, { headers });
      return await res.json();
    } catch (err) {
      console.error("recent fetch error", err);
      return null;
    }
  }, []);

  const fetchCategories = useCallback(async (headers) => {
    try {
      const res = await fetch(`${API_BASE_URL}/expenses/categories`, { headers });
      return await res.json();
    } catch (err) {
      console.error("categories fetch error", err);
      return null;
    }
  }, []);

  const fetchData = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) {
      router.push("/login");
      return;
    }
    const headers = { authorization: `Bearer ${token}` };

    // set loading for sections that will be refreshed
    setLoadingProfile(true);
    setLoadingSummary(true);
    setLoadingRecent(true);
    setLoadingCategories(true);

    // fetch independently so sections can resolve separately
    fetchProfile(headers).then((profileData) => {
      if (profileData) setProfile(profileData);
      setLoadingProfile(false);
    });

    fetchSummary(headers).then((summaryData) => {
      if (summaryData) {
        setSummary({
          income: summaryData?.income || 0,
          totalExpense: summaryData?.totalExpense || 0,
        });
      }
      setLoadingSummary(false);
    });

    fetchRecent(headers).then((recentData) => {
      if (recentData) setRecent(Array.isArray(recentData) ? recentData : recentData?.data || []);
      setLoadingRecent(false);
    });

    fetchCategories(headers).then((catData) => {
      if (catData) setCategories(Array.isArray(catData) ? catData : catData?.data || []);
      setLoadingCategories(false);
    });
  }, [fetchProfile, fetchSummary, fetchRecent, fetchCategories, router]);

  useEffect(() => {
    // initial fetch
    fetchData();
    // poll every 10s
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const balance = (summary.income || 0) - (summary.totalExpense || 0);
  const COLORS = ["#4ade80", "#22c55e", "#16a34a", "#86efac", "#15803d"];

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-[#ecfdf5] via-[#e8f5e9] to-[#e0f2fe] transition-colors duration-500">

      {/* Header (profile) */}
      <motion.div
        className="flex items-center gap-4 mb-10"
        variants={itemVariants}
        initial="hidden"
        animate="show"
      >
        {loadingProfile ? (
          // skeleton for profile
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse" />
            <div className="space-y-2">
              <div className="w-48 h-6 bg-gray-200 rounded-md animate-pulse" />
              <div className="w-32 h-4 bg-gray-200 rounded-md animate-pulse" />
            </div>
          </div>
        ) : (
          // actual profile
          <div className="flex items-center gap-4">
            <img
              src={profile.photo ? `${API_URL}${profile.photo}` : "/default-avatar.png"}
              alt="Profile"
              className="w-14 h-14 rounded-full border-2 border-green-400 object-cover shadow-sm"
            />
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="text-2xl font-semibold text-gray-800"
              >
                Hi, {profile.username || "User"} 👋
              </motion.h2>
              <p className="text-sm text-gray-500">Dashboard updates automatically every 10s ⏱️</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/** Income Card */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-md transition-all hover:scale-[1.02]">
          {loadingSummary ? (
            <>
              <SkeletonBlock className="h-4 w-28 mb-3" />
              <SkeletonBlock className="h-10 w-40" />
            </>
          ) : (
            <>
              <h3 className="text-gray-600 mb-1">Income</h3>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="text-3xl font-semibold text-green-700">
                ₹{summary.income.toLocaleString("en-IN")}
              </motion.p>
            </>
          )}
        </motion.div>

        {/** Expenses Card */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-md transition-all hover:scale-[1.02]">
          {loadingSummary ? (
            <>
              <SkeletonBlock className="h-4 w-28 mb-3" />
              <SkeletonBlock className="h-10 w-40" />
            </>
          ) : (
            <>
              <h3 className="text-gray-600 mb-1">Expenses</h3>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="text-3xl font-semibold text-red-500">
                ₹{summary.totalExpense.toLocaleString("en-IN")}
              </motion.p>
            </>
          )}
        </motion.div>

        {/** Balance Card */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-md transition-all hover:scale-[1.02]">
          {loadingSummary ? (
            <>
              <SkeletonBlock className="h-4 w-28 mb-3" />
              <SkeletonBlock className="h-10 w-40" />
            </>
          ) : (
            <>
              <h3 className="text-gray-600 mb-1">Balance</h3>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className={`text-3xl font-semibold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                ₹{balance.toLocaleString("en-IN")}
              </motion.p>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Charts & Transactions grid */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categories / Pie Chart Card */}
        <motion.div variants={itemVariants} initial="hidden" animate="show" className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Expense Categories</h3>

          {loadingCategories ? (
            <div className="space-y-4">
              <SkeletonBlock className="h-6 w-52" />
              <div className="grid grid-cols-2 gap-4">
                <SkeletonBlock className="h-20" />
                <SkeletonBlock className="h-20" />
              </div>
            </div>
          ) : categories.length > 0 ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="total"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={5}
                    label={({ name, value }) => `${name} ₹${value}`}
                    isAnimationActive={true}
                  >
                    {categories.map((_, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                        style={{ cursor: "pointer" }}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          ) : (
            <p className="text-gray-400 text-center mt-10">No category data available</p>
          )}
        </motion.div>

        {/* Recent Transactions Card */}
        <motion.div variants={itemVariants} initial="hidden" animate="show" className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Transactions</h3>

          {loadingRecent ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <div className="space-y-1">
                    <SkeletonBlock className="h-4 w-40" />
                    <SkeletonBlock className="h-3 w-28" />
                  </div>
                  <SkeletonBlock className="h-6 w-20" />
                </div>
              ))}
            </div>
          ) : recent.length > 0 ? (
            <div className="space-y-3">
              {recent.map((tx, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.01 }}
                  className="flex justify-between items-center border-b border-gray-200 pb-2 px-2"
                >
                  <div>
                    <p className="text-gray-700 font-medium">{tx.category}</p>
                    <p className="text-sm text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                  <p className={`font-semibold ${tx.amount > 0 ? "text-red-500" : "text-green-600"}`}>
                    ₹{tx.amount.toLocaleString("en-IN")}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center mt-10">No recent transactions yet</p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
