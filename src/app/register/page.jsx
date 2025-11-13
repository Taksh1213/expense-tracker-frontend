"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    if (file) formData.append("profilePic", file);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        body: formData, // ⚠️ No JSON headers!
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      setSuccess("🎉 Account created successfully! Redirecting...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#e0f2fe] via-[#ecfdf5] to-[#e8f5e9]">
      <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-10 w-[450px] max-w-[90%] border border-gray-200">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          ✨ Create Your Account
        </h2>

        {error && (
          <p className="text-red-600 bg-red-100 py-2 px-3 mb-4 text-center rounded-md text-sm">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-600 bg-green-100 py-2 px-3 mb-4 text-center rounded-md text-sm">
            {success}
          </p>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              className="w-full p-3 rounded-xl border border-green-200 bg-gradient-to-r from-[#f0fdf4] to-[#ecfdf5] text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none shadow-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full p-3 rounded-xl border border-green-200 bg-gradient-to-r from-[#f0fdf4] to-[#ecfdf5] text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none shadow-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full p-3 rounded-xl border border-green-200 bg-gradient-to-r from-[#f0fdf4] to-[#ecfdf5] text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none shadow-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Profile Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full p-2 rounded-xl border border-green-200 bg-gradient-to-r from-[#f0fdf4] to-[#ecfdf5] text-gray-700 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none shadow-sm transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all shadow-md"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-green-600 font-semibold hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
