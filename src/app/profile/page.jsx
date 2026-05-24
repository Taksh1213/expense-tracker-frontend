"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload } from "lucide-react";
import { API_BASE_URL, API_URL } from "@/utils/config";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    photo: "",
  });
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Fetch profile info on load
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return router.push("/login");

      try {
        const res = await fetch(`${API_BASE_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch profile");

        setProfile(data);
        setFormData({ username: data.username, password: "" });
        if (data.photo) setPreview(`${API_URL}${data.photo}`);
      } catch (err) {
        setMessage(`❌ ${err.message}`);
      }
    };

    fetchProfile();
  }, [router]);

  // ✅ Handle form field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Handle image upload preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  // ✅ Submit profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setMessage("⚠️ Please log in again!");
      return;
    }

    try {
      const form = new FormData();
      form.append("username", formData.username);
      if (formData.password) form.append("password", formData.password);
      if (photo) form.append("photo", photo);

      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      setMessage("✅ Profile updated successfully!");
      setProfile(data);
      if (data.photo) setPreview(`${API_URL}${data.photo}`);
      setFormData({ username: data.username, password: "" });
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-[#e0f2fe] via-[#ecfdf5] to-[#e8f5e9] p-4 sm:p-8 relative">
      
      {/* ✅ Back Button */}
      <button
        onClick={() => router.push("/dashboard")}
        className="self-start sm:absolute sm:top-6 sm:left-6 flex items-center gap-2 text-sm sm:text-base text-green-700 hover:text-emerald-700 font-semibold bg-white/70 px-3 sm:px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all backdrop-blur-md border border-green-200"
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      {/* ✅ Profile Card */}
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl sm:rounded-3xl w-full max-w-md p-5 sm:p-10 border border-green-200 mt-6 sm:mt-20">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-8 text-gray-800">
          👤 My Profile
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

        {/* Profile Photo Preview */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src={preview || "/default-avatar.png"}
              alt="Profile Preview"
              className="w-28 h-28 rounded-full border-4 border-green-300 object-cover shadow-md"
            />
            <label className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-green-600 transition">
              <Upload size={18} />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* ✅ Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-3 border border-green-200 rounded-xl bg-[#f9fefb] focus:ring-2 focus:ring-green-400 outline-none shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              readOnly
              className="w-full p-3 border border-green-200 rounded-xl bg-gray-100 text-gray-500 shadow-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password (optional)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full p-3 border border-green-200 rounded-xl bg-[#f9fefb] focus:ring-2 focus:ring-green-400 outline-none shadow-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 rounded-xl text-white font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all shadow-md"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}
