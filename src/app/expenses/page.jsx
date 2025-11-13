"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";

export default function ViewExpensesPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");

  // ✅ Fetch all transactions (both expenses and incomes)
  const fetchTransactions = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch expenses");

      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  // ✅ Delete a transaction
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    const token = localStorage.getItem("accessToken");
    try {
      const res = await fetch(`http://localhost:5000/api/expenses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete expense");
      setMessage("✅ Transaction deleted successfully!");
      fetchTransactions(); // refresh list
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-[#e0f2fe] via-[#ecfdf5] to-[#e8f5e9] p-8">
      
      {/* ✅ Back Button */}
      <button
        onClick={() => router.push("/dashboard")}
        className="absolute top-6 left-6 flex items-center gap-2 text-green-700 hover:text-emerald-700 font-semibold bg-white/70 px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all backdrop-blur-md border border-green-200"
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl w-full max-w-5xl p-8 border border-green-200 mt-20">
        <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
          📊 All Transactions
        </h2>

        {message && (
          <p
            className={`text-center mb-4 font-medium ${
              message.startsWith("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">No transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm text-gray-700">
              <thead>
                <tr className="bg-green-100 text-green-800">
                  <th className="px-4 py-3 text-left rounded-tl-xl">Title</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Amount (₹)</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-center rounded-tr-xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className="hover:bg-green-50 border-b border-gray-100 transition-all"
                  >
                    <td className="px-4 py-3 font-medium">{tx.title}</td>
                    <td className="px-4 py-3">{tx.category}</td>
                    <td
                      className={`px-4 py-3 font-semibold ${
                        tx.amount >= 0 ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      ₹{tx.amount}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(tx.date).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {tx.description || "-"}
                    </td>
                    <td className="px-4 py-3 text-center flex justify-center gap-3">
                      <button
                        onClick={() => router.push(`/expenses/edit/${tx._id}`)}
                        className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-full shadow-sm transition-all"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(tx._id)}
                        className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-full shadow-sm transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
