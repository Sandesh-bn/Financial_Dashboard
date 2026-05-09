import React, { useState } from "react";
import { Routes, Route, useNavigate, NavLink } from "react-router-dom";
import { Menu, X, Sun, Moon, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import Home from "./components/Home";
import Profile from "./components/Profile";
import Income from "./components/Income";
import Expense from "./components/Expense";

const navItems = [
  { key: "home", label: "Home", path: "/" },
  { key: "income", label: "Income", path: "/income" },
  { key: "expense", label: "Expense", path: "/expense" },
  { key: "profile", label: "Profile", path: "/profile" },
];

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  function clearAuth() {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
    } catch (error) {
      console.log("clear auth error", error);
    }

    setUser(null);
    setToken(null);
  }

  function handleLogout() {
    clearAuth();
    navigate("/login");
  }

  return (
    <div className={darkMode ? "dark flex h-screen w-full" : "flex h-screen w-full"}>

      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white dark:bg-zinc-900 border-b flex items-center px-4 z-50">
        <Button variant="ghost" onClick={() => setSidebarOpen(true)}>
          <Menu />
        </Button>
        <span className="ml-2 font-semibold dark:text-white">Dashboard</span>
      </div>

      {/* SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col border-r bg-white dark:bg-zinc-900 dark:border-zinc-800 transition-all duration-300
        ${collapsed ? "md:w-20 lg:w-24" : "md:w-64 lg:w-72"}`}
      >

        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b dark:border-zinc-800">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu />
          </Button>
        </div>

        {/* NAV */}
        <nav className="flex-1 space-y-2 p-2">
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30"
                    : "text-foreground hover:bg-accent"
                }`
              }
            >
              {collapsed ? "•" : item.label}
            </NavLink>
          ))}
        </nav>

        {/* THEME TOGGLE */}
        <div className="p-2 border-t dark:border-zinc-800">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {!collapsed && (darkMode ? "Light Mode" : "Dark Mode")}
          </Button>
        </div>

        {/* LOGOUT */}
        <div className="p-2 border-t dark:border-zinc-800">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            {!collapsed && "Logout"}
          </Button>
        </div>
      </aside>

      {/* MOBILE SIDEBAR */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />

          <div className="relative w-72 bg-white dark:bg-zinc-900 h-full p-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-lg font-bold dark:text-white">Menu</h1>
              <button onClick={() => setSidebarOpen(false)}>
                <X />
              </button>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.key}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className="block px-3 py-2 rounded-md hover:bg-accent"
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* LOGOUT */}
            <div className="mt-4 border-t pt-4 dark:border-zinc-800">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-red-600"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Logout
              </Button>
            </div>

            {/* THEME */}
            <div className="mt-4 border-t pt-4 dark:border-zinc-800">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                Theme
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <main
        className={`flex-1 p-4 md:p-8 mt-14 md:mt-0 overflow-auto transition-all duration-300
        ${darkMode ? "bg-zinc-900 text-white" : "bg-gray-50 text-black"}`}
      >
        <Card
          className={`p-6 min-h-[calc(100vh-2rem)]
          ${darkMode ? "bg-zinc-800 border-zinc-700 text-white" : ""}`}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/income" element={<Income />} />
            <Route path="/expense" element={<Expense />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Card>
      </main>
    </div>
  );
}