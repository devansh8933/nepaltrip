import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/api";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center" data-testid="protected-loading">
        <div className="text-[#1C3144] text-sm overline">Loading…</div>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
