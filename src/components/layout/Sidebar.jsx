import { NavLink } from "react-router-dom";
import { Menu, Sun, Moon, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Income", path: "/income" },
  { label: "Expense", path: "/expense" },
  { label: "Profile", path: "/profile" },
];

export default function Sidebar({
  collapsed,
  setCollapsed,
  darkMode,
  setDarkMode,
}) {
  const { logout } = useAuth();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="h-full border-r dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col"
    >
      {/* TOP BAR */}
      <div className="h-14 flex items-center justify-between px-3 border-b dark:border-zinc-800">
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
          <Menu />
        </Button>
      </div>

      {/* NAV */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2 rounded-md transition-all
              ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground hover:text-foreground"}`
            }
          >
            {/* ACTIVE STRIPE BAR */}
            <NavLinkIndicator />

            {/* LABEL */}
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.15 }}
                  className="text-sm font-medium"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* BOTTOM ACTIONS */}
      <div className="p-2 border-t dark:border-zinc-800 space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          {!collapsed && "Theme"}
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-red-500 hover:text-red-600"
          onClick={logout}
        >
          <LogOut size={18} />
          {!collapsed && "Logout"}
        </Button>
      </div>
    </motion.aside>
  );
}

/* Stripe-style active indicator */
function NavLinkIndicator() {
  return (
    <span className="absolute left-0 h-6 w-[3px] rounded-full bg-emerald-500 opacity-0 group-[.active]:opacity-100" />
  );
}