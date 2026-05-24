"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { ArrowLeft } from "lucide-react";
import { API_BASE_URL } from "@/utils/config";

export default function AnalyticsPage() {
  const router = useRouter();
  const [summary, setSummary] = useState({ income: 0, totalExpense: 0 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const COLORS = ["#16a34a", "#22c55e", "#4ade80", "#86efac", "#15803d"];

  // ✅ Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return router.push("/login");

      const [summaryRes, catRes] = await Promise.all([
        fetch(`${API_BASE_URL}/expenses/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/expenses/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [summaryData, catData] = await Promise.all([
        summaryRes.json(),
        catRes.json(),
      ]);

      setSummary({
        income: summaryData?.income || 0,
        totalExpense: summaryData?.totalExpense || 0,
      });
      setCategories(Array.isArray(catData) ? catData : catData.data || []);
      setLoading(false);
    } catch (err) {
      console.error("❌ Analytics fetch error:", err);
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const timeout = setTimeout(fetchAnalytics, 0);
    return () => clearTimeout(timeout);
  }, [fetchAnalytics]);

  const balance = summary.income - summary.totalExpense;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-[#e0f2fe] via-[#ecfdf5] to-[#e8f5e9] p-4 sm:p-8 relative">
      
      {/* ✅ Back Button */}
      <button
        onClick={() => router.push("/dashboard")}
        className="self-start sm:absolute sm:top-6 sm:left-6 flex items-center gap-2 text-sm sm:text-base text-green-700 hover:text-emerald-700 font-semibold bg-white/70 px-3 sm:px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all backdrop-blur-md border border-green-200"
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      {/* ✅ Header */}
      <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800 mb-8 mt-6 sm:mt-20">
        📊 Financial Analytics
      </h2>

      {loading ? (
        <p className="text-gray-600 text-lg">Loading analytics...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 w-full max-w-6xl">

          {/* ✅ Income vs Expense Bar Chart */}
          <div className="min-w-0 bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-green-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Income vs Expenses
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  {
                    name: "Overview",
                    Income: summary.income,
                    Expense: summary.totalExpense,
                    Balance: balance,
                  },
                ]}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v) => `₹${v}`} />
                <Legend />
                <Bar dataKey="Income" fill="#16a34a" radius={[10, 10, 0, 0]} />
                <Bar dataKey="Expense" fill="#ef4444" radius={[10, 10, 0, 0]} />
                <Bar dataKey="Balance" fill="#22c55e" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ✅ Expense Category Pie Chart */}
          <div className="min-w-0 bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-green-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Expense Breakdown by Category
            </h3>
            {categories.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="total"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={50}
                    paddingAngle={5}
                    label={({ name, value }) => `${name} ₹${value}`}
                  >
                    {categories.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `₹${v}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-center mt-10">
                No category data available
              </p>
            )}
          </div>

          {/* ✅ Summary Card Section */}
          <div className="col-span-1 md:col-span-2 flex flex-wrap justify-center gap-4 sm:gap-6 mt-4 sm:mt-8">
            <div className="w-full sm:w-auto bg-white rounded-2xl p-5 sm:p-6 shadow-md sm:min-w-[200px] text-center border border-green-200">
              <h3 className="text-gray-600 mb-1">Total Income</h3>
              <p className="text-2xl font-semibold text-green-600">
                ₹{summary.income.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="w-full sm:w-auto bg-white rounded-2xl p-5 sm:p-6 shadow-md sm:min-w-[200px] text-center border border-green-200">
              <h3 className="text-gray-600 mb-1">Total Expenses</h3>
              <p className="text-2xl font-semibold text-red-500">
                ₹{summary.totalExpense.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="w-full sm:w-auto bg-white rounded-2xl p-5 sm:p-6 shadow-md sm:min-w-[200px] text-center border border-green-200">
              <h3 className="text-gray-600 mb-1">Net Balance</h3>
              <p
                className={`text-2xl font-semibold ${
                  balance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ₹{balance.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
