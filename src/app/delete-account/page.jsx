"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";

export default function DeleteAccountPage() {
  const router = useRouter();
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return router.push("/login");

    if (confirmation !== "DELETE") {
      setMessage("❌ Please type DELETE to confirm.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/auth/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete account");

      // ✅ Clear localStorage and redirect
      localStorage.removeItem("accessToken");
      setMessage("✅ Account deleted successfully!");
      setTimeout(() => {
        router.push("/register");
      }, 2000);
    } catch (err) {
      console.error("Delete account error:", err);
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#fff5f5] via-[#ffeaea] to-[#fee2e2] p-8 relative">
      
      {/* ✅ Back Button */}
      <button
        onClick={() => router.push("/dashboard")}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-700 hover:text-red-600 font-semibold bg-white/70 px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all backdrop-blur-md border border-red-200"
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      {/* ✅ Delete Card */}
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl w-full max-w-md p-10 border border-red-300 text-center">
        <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">
          Delete Account
        </h2>
        <p className="text-gray-600 mb-6">
          This will permanently remove your account, including all expenses,
          income records, and data. <br />
          <span className="font-semibold text-red-600">
            This action cannot be undone.
          </span>
        </p>

        {message && (
          <p
            className={`mb-4 font-medium ${
              message.startsWith("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type <span className="font-semibold">DELETE</span> to confirm:
          </label>
          <input
            type="text"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder="DELETE"
            className="w-full p-3 border border-red-200 rounded-xl bg-[#fef2f2] focus:ring-2 focus:ring-red-400 outline-none shadow-sm text-center font-semibold"
          />
        </div>

        <button
          onClick={handleDelete}
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-semibold transition-all shadow-md ${
            loading
              ? "bg-red-300 cursor-not-allowed"
              : "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
          }`}
        >
          {loading ? "Deleting..." : "Yes, Delete My Account"}
        </button>
      </div>
    </div>
  );
}
