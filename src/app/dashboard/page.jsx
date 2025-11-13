"use client";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [profile, setProfile] = useState({});
  const [summary, setSummary] = useState({ income: 0, totalExpense: 0 });
  const [recent, setRecent] = useState([]);
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  // ✅ Centralized fetcher
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.warn("⚠️ No access token found. Redirecting to login...");
        router.push("/login");
        return;
      }

      // ✅ lowercase authorization header (important!)
      const headers = { authorization: `Bearer ${token}` };

      // Fetch all endpoints in parallel
      const [profileRes, summaryRes, recentRes, catRes] = await Promise.all([
        fetch("http://localhost:5000/api/auth/profile", { headers }),
        fetch("http://localhost:5000/api/expenses/summary", { headers }),
        fetch("http://localhost:5000/api/expenses/recent", { headers }),
        fetch("http://localhost:5000/api/expenses/categories", { headers }),
      ]);

      // If unauthorized → redirect to login
      if (profileRes.status === 401 || summaryRes.status === 401) {
        console.warn("🔒 Token invalid or expired. Redirecting to login...");
        localStorage.removeItem("accessToken");
        router.push("/login");
        return;
      }

      const [profileData, summaryData, recentData, catData] = await Promise.all([
        profileRes.json(),
        summaryRes.json(),
        recentRes.json(),
        catRes.json(),
      ]);

      setProfile(profileData || {});
      setSummary({
        income: summaryData?.income || 0,
        totalExpense: summaryData?.totalExpense || 0,
      });
      setRecent(Array.isArray(recentData) ? recentData : recentData.data || []);
      setCategories(Array.isArray(catData) ? catData : catData.data || []);
    } catch (err) {
      console.error("❌ Dashboard fetch error:", err);
    }
  };

  // ✅ Auto-refresh every 10 seconds
  useEffect(() => {
    fetchData(); // first load
    const interval = setInterval(fetchData, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const balance = summary.income - summary.totalExpense;
  const COLORS = ["#4ade80", "#22c55e", "#16a34a", "#86efac", "#15803d"];

  return (
    <div className="p-8 bg-gradient-to-br from-[#ecfdf5] via-[#e8f5e9] to-[#e0f2fe] min-h-screen rounded-2xl shadow-inner">
      
      {/* ✅ Header Section */}
      <div className="flex items-center gap-4 mb-10">
        <img
          src={
            profile.photo
              ? `http://localhost:5000${profile.photo}`
              : "/default-avatar.png"
          }
          alt="Profile"
          className="w-14 h-14 rounded-full border-2 border-green-400 object-cover shadow-sm"
        />
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Hi, {profile.username || "User"} 👋
          </h2>
          <p className="text-sm text-gray-500">
            Dashboard updates automatically every 10s ⏱️
          </p>
        </div>
      </div>

      {/* ✅ Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-gray-600 mb-1">Income</h3>
          <p className="text-3xl font-semibold text-green-700">
            ₹{summary.income.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-gray-600 mb-1">Expenses</h3>
          <p className="text-3xl font-semibold text-red-500">
            ₹{summary.totalExpense.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-gray-600 mb-1">Balance</h3>
          <p
            className={`text-3xl font-semibold ${
              balance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ₹{balance.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* ✅ Charts & Transactions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expense Categories Pie Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Expense Categories
          </h3>
          {categories.length > 0 ? (
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
                >
                  {categories.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center mt-10">
              No category data available
            </p>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Recent Transactions
          </h3>
          {recent.length > 0 ? (
            <div className="space-y-3">
              {recent.map((tx, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b border-gray-100 pb-2"
                >
                  <div>
                    <p className="text-gray-700 font-medium">{tx.category}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(tx.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p
                    className={`font-semibold ${
                      tx.amount > 0 ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    ₹{tx.amount.toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center mt-10">
              No recent transactions yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
