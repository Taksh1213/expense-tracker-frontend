"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f0fdf4] to-[#ecfdf5] transition-all duration-300">
      {/* ✅ Sidebar */}
      <Sidebar isOpen={isOpen} />

      {/* ✅ Main content area */}
      <div className="flex flex-col flex-1">
        <Topbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
