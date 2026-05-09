import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Login from "../pages/Login";
import Home from "../components/Home";
import Income from "../components/Income";
import Expense from "../components/Expense";
import Profile from "../components/Profile";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../context/AuthContext";

export default function AppRoutes() {
  const { user, loading } = useAuth();

  return (
    <Routes>
      {/* LOGIN */}
      <Route path="/login" element={<Login />} />

      {/* PROTECTED APP */}
      <Route
        path="/"
        element={
          <ProtectedRoute user={user} loading={loading}>
            <Layout />
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