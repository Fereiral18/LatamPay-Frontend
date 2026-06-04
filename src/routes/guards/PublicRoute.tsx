import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();
// colocar spinner una vez creado el componente
  if (isLoading) return null;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default PublicRoute;
