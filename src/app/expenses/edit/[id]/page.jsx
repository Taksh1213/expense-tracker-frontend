"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function EditTransactionPage() {
  const router = useRouter();
  const params = useParams(); // ✅ get dynamic id
  const { id } = params;
  const [type, setType] = useState("expense");
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    description: "",
  });
  const [message, setMessage] = useState("");

  // ✅ Category options
  const expenseCategories = ["Food", "Transport", "Rent", "Entertainment", "Bills", "Shopping", "Health"];
  const incomeCategories = ["Salary", "Freelance", "Investments", "Business", "Gift", "Other"];

  // ✅ Fetch transaction data
  useEffect(() => {
    const fetchTransaction = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/expenses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch transaction");

        setFormData({
          title: data.title || "",
          amount: data.amount || "",
          category: data.category || "",
          date: data.date ? data.date.split("T")[0] : "",
          description: data.description || "",
        });
        setType(data.amount >= 0 ? "expense" : "income");
      } catch (err) {
        setMessage(`❌ ${err.message}`);
      }
    };

    if (id) fetchTransaction();
  }, [id, router]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Handle update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setMessage("⚠️ Please log in again!");
      return;
    }

    try {
      const endpoint = `http://localhost:5000/api/expenses/${id}`;
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update transaction");

      setMessage("✅ Transaction updated successfully!");
      setTimeout(() => router.push("/expenses"), 1500);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-[#e0f2fe] via-[#ecfdf5] to-[#e8f5e9] p-8 relative">

      {/* ✅ Back to View Page Button */}
      <button
        onClick={() => router.push("/expenses")}
        className="absolute top-6 left-6 flex items-center gap-2 text-green-700 hover:text-emerald-700 font-semibold bg-white/70 px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all backdrop-blur-md border border-green-200"
      >
        <ArrowLeft size={18} /> Back to View All
      </button>

      {/* ✅ Form */}
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl w-full max-w-md p-10 border border-green-200 mt-20">
        <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
          ✏️ Edit Transaction
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-3 border border-green-200 rounded-xl bg-[#f9fefb] focus:ring-2 focus:ring-green-400 outline-none shadow-sm"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="w-full p-3 border border-green-200 rounded-xl bg-[#f9fefb] focus:ring-2 focus:ring-green-400 outline-none shadow-sm"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full p-3 border border-green-200 rounded-xl bg-[#f9fefb] focus:ring-2 focus:ring-green-400 outline-none shadow-sm"
            >
              <option value="">Select category</option>
              {(type === "expense" ? expenseCategories : incomeCategories).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full p-3 border border-green-200 rounded-xl bg-[#f9fefb] focus:ring-2 focus:ring-green-400 outline-none shadow-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Optional note..."
              className="w-full p-3 border border-green-200 rounded-xl bg-[#f9fefb] focus:ring-2 focus:ring-green-400 outline-none shadow-sm"
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 mt-4 rounded-xl text-white font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all shadow-md"
          >
            Update Transaction
          </button>
        </form>
      </div>
    </div>
  );
}
