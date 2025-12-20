import { Navigate } from "react-router-dom";
import { useAccessToken } from "./UseAccessToken";

export function ProtectedRoute({ children, rolesPermitidos = [] }) {
  const { isAuthenticated, getRolesUsuario } = useAccessToken();

  // ✅ Se re-renderiza automáticamente cuando el Context cambia
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Validación de roles
  const rolesUsuario = getRolesUsuario();
  if (rolesPermitidos.length > 0 && !rolesUsuario.some(r => rolesPermitidos.includes(r))) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}