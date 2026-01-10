import { useState, useEffect } from "react";
import { AccessTokenContext } from "./AccessTokenContext";
import { setAxiosAccessToken } from "../../Configuracion/AxiosConfig";
import { jwtDecode } from "jwt-decode";

export function AccessTokenProvider({ children }) {
  const [accessToken, setAccessTokenState] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const setAccessToken = (token) => {
    console.log("🔑 setAccessToken llamado:", token ? "Token presente" : "NULL");
    setAccessTokenState(token);
    setAxiosAccessToken(token);
  };

  useEffect(() => {
    const handleRefreshStart = () => {
      console.log("🔄 RefreshStart - Iniciando renovación...");
      setIsRefreshing(true);
    };

    const handleTokenRefreshed = (e) => {
      const newToken = e.detail?.token;
      console.log("✅ TokenRefreshed - Nuevo token:", newToken ? "OK" : "NULL");
      
      if (newToken) {
        setAccessToken(newToken);
      }
      setIsRefreshing(false);
    };

    // ✅ FIX: Resetear isRefreshing cuando falla el refresh
    const handleTokenRefreshFailed = () => {
      console.log("❌ TokenRefreshFailed - Reseteando estado");
      setIsRefreshing(false);
    };

    // ✅ FIX: Resetear TODO en logout
    const handleLogout = () => {
      console.log("🔴 Evento LOGOUT detectado");
      setIsRefreshing(false);  // ← CRÍTICO: Resetear isRefreshing
      setAccessToken(null);
    };
    
    window.addEventListener("refreshStart", handleRefreshStart);
    window.addEventListener("tokenRefreshed", handleTokenRefreshed);
    window.addEventListener("tokenRefreshFailed", handleTokenRefreshFailed);
    window.addEventListener("logout", handleLogout);
    
    return () => {
      window.removeEventListener("refreshStart", handleRefreshStart);
      window.removeEventListener("tokenRefreshed", handleTokenRefreshed);
      window.removeEventListener("tokenRefreshFailed", handleTokenRefreshFailed);
      window.removeEventListener("logout", handleLogout);
    };
  }, []);

  const getDecodedToken = () => {
    if (!accessToken) return null;
    try {
      return jwtDecode(accessToken);
    } catch {
      return null;
    }
  };

  const isAuthenticated = () => {
    // ✅ Si está refrescando, considera que SÍ está autenticado
    if (isRefreshing) {
      console.log("🔄 isAuthenticated: TRUE (refrescando)");
      return true;
    }
    
    // ✅ Solo verifica si el token existe
    const authenticated = !!accessToken;
    console.log("🛡️ isAuthenticated:", authenticated);
    return authenticated;
  };

  const value = {
    accessToken,
    setAccessToken,
    getDecodedToken,
    isAuthenticated,
    isRefreshing,
    getNombreUsuario: () => getDecodedToken()?.nombre || null,
    getRolesUsuario: () => getDecodedToken()?.roles || []
  };

  return (
    <AccessTokenContext.Provider value={value}>
      {children}
    </AccessTokenContext.Provider>
  );
}