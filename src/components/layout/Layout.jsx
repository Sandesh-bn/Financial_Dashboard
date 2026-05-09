import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState } from "react";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark min-h-screen" : "min-h-screen"}>
      <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-zinc-950">

        {/* SIDEBAR */}
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {/* MAIN CONTENT */}
        <main className="min-h-0 flex-1 overflow-auto p-6 text-black dark:text-white">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
