import { useContext } from "react";
import { AccessTokenContext } from "./AccessTokenContext";

// Hook personalizado para acceder al contexto del token de acceso
export function useAccessToken() {
  const context = useContext(AccessTokenContext);
  if (!context) {
    throw new Error("useAccessToken debe usarse dentro de AccessTokenProvider");
  }
  return context;
}