import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../components/Home";
import Income from "../components/Income";
import Expense from "../components/Expense";
import Profile from "../components/Profile";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import { TransactionProvider } from "../context/TransactionContext";

export default function AppRoutes() {
  const { user, loading } = useAuth();

  // 🚨 BLOCK RENDER UNTIL AUTH IS READY
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-sm text-zinc-500">
        Loading app...
      </div>
    );
  }

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* PROTECTED ROUTE WRAPPER */}
      <Route
        path="/"
        element={
          <ProtectedRoute user={user} loading={loading}>
            <TransactionProvider>
              <Layout />
            </TransactionProvider>
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="income" element={<Income />} />
        <Route path="expense" element={<Expense />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}