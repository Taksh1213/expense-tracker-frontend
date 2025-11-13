"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Logging you out...");

  useEffect(() => {
    const logout = async () => {
      const token = localStorage.getItem("accessToken");

      try {
        // ✅ Hit backend logout route
        await fetch("http://localhost:5000/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include", // for refreshToken cookie
        });

        // ✅ Clear localStorage
        localStorage.removeItem("accessToken");

        // ✅ Update UI
        setStatus("✅ You have been logged out successfully!");

        // ✅ Redirect to login after 1.5s
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } catch (error) {
        console.error("Logout error:", error);
        setStatus("❌ Error while logging out. Please try again.");
      }
    };

    logout();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e0f2fe] via-[#ecfdf5] to-[#e8f5e9]">
      <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-10 w-[400px] text-center border border-green-200 animate-fadeIn">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          Logging Out...
        </h1>
        <p
          className={`text-lg ${
            status.startsWith("✅") ? "text-green-600" : "text-gray-600"
          }`}
        >
          {status}
        </p>
        <div className="mt-6">
          <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
