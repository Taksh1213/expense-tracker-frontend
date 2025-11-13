"use client";
import { useState } from "react";
import { Home, PlusCircle, BarChart3, User, LogOut, Trash2, Settings,Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ isOpen }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
  { name: "Add Transaction", icon: PlusCircle, path: "/add-transaction" },
  { name: "View Expenses", icon: BarChart3, path: "/expenses" },
  { name: "Analytics", icon: BarChart3, path: "/analytics" },
  { name: "Profile", icon: User, path: "/profile" },
  { name: "Logout", icon: LogOut, path: "/logout" },
  { name: "Settings", icon: Settings, path: "/settings" },
  { name: "Delete Account", icon: Trash2, path: "/delete-account", danger: true },

  ];

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-gradient-to-b from-emerald-500 to-green-600 text-white min-h-screen p-4 flex flex-col transition-all duration-300 ease-in-out`}
    >
      {/* Logo / App Name */}
      <div className="flex items-center justify-center mb-10 mt-2">
        <Menu size={28} className={`${isOpen ? "hidden" : "block"} text-white`} />
        {isOpen && (
          <h1 className="text-xl font-semibold tracking-wide">💸 Expense</h1>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                active
                  ? "bg-emerald-400/30 shadow-inner text-white font-semibold"
                  : "hover:bg-emerald-400/20 text-white/90"
              }`}
            >
              <Icon size={22} />
              {isOpen && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
