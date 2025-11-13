"use client";
import { Menu } from "lucide-react";

export default function Topbar({ toggleSidebar }) {
  return (
    <div className="w-full bg-white/70 backdrop-blur-md shadow-sm flex justify-between items-center px-6 py-3 sticky top-0 z-10">
      <button
        onClick={toggleSidebar}
        className="text-gray-700 hover:text-emerald-600 transition-all"
      >
        <Menu size={28} />
      </button>

      <div className="flex items-center gap-3">
       
      </div>
    </div>
  );
}
