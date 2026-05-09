import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, loading, children }) {
  // still checking auth (initial hydration)
  if (loading || user === undefined) {
    return (
      <div className="h-screen flex items-center justify-center text-sm text-zinc-500">
        Loading...
      </div>
    );
  }

  // not logged in
  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  // logged in
  return children;
}