import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";


export default function ProtectedRoute() {
  const { isAuthenticated, authLoading } = useSelector(
    (state) => state.user
  );

  if (authLoading) {
    return null; // o spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
