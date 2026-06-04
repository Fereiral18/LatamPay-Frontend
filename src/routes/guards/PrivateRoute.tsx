import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function PrivateRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  // Reemplazarcon spinnner una vez creado el componente
  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default PrivateRoute;
