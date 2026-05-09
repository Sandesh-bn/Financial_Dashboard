import { NavLink } from "react-router-dom";
import { Menu, Sun, Moon, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../context/AuthContext";
import { Home, TrendingUp, TrendingDown, User } from "lucide-react";



export default function Sidebar({
    collapsed,
    setCollapsed,
    darkMode,
    setDarkMode,
}) {
    const { logout } = useAuth();
    const { user } = useAuth();

    const username = user?.name + "'s profile" || "Profile";

    const navItems = [
        { label: "Home", path: "/", icon: Home },
        { label: "Income", path: "/income", icon: TrendingUp },
        { label: "Expense", path: "/expense", icon: TrendingDown },
        { label: username, path: "/profile", icon: User },
    ];

    return (
        <motion.aside
            animate={{ width: collapsed ? 72 : 260 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex h-full shrink-0 flex-col border-r bg-white dark:border-zinc-800 dark:bg-zinc-900"
        >
            {/* TOP BAR */}
            <div className="h-14 flex items-center justify-between px-3 border-b dark:border-zinc-800">
                <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
                    <Menu />
                </Button>
            </div>

            {/* NAV */}
            <nav className="flex-1 p-2 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `relative flex items-center gap-3 px-3 py-2 rounded-md transition-all
        ${isActive
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-muted-foreground hover:text-foreground"}`
                            }
                        >
                            <Icon size={18} className="shrink-0" />

                            {!collapsed && (
                                <span className="text-sm font-medium">
                                    {item.label}
                                </span>
                            )}
                        </NavLink>
                    );
                })}
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
