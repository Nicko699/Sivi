import api from "../../Configuracion/AxiosConfig";

export async function login(correo, password) {
  try {
    const response = await api.post("/usuario/iniciarSesion", { correo, password });
    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      const backendMsg = data?.mensaje || data?.message || data?.error || "";

      if (status === 401) {
        // Spring Security manda diferentes mensajes según el tipo de error
        if (backendMsg.toLowerCase().includes("disabled") || 
            backendMsg.toLowerCase().includes("inhabilitado") ||
            backendMsg.toLowerCase().includes("desactivado")) {
          throw new Error("Tu cuenta está inactiva. Contacta al administrador.");
        }
        if (backendMsg.toLowerCase().includes("locked")) {
          throw new Error("Tu cuenta está bloqueada.");
        }
        // Por defecto, credenciales incorrectas
        throw new Error("Correo o contraseña incorrectos");
      }
      
      throw new Error(backendMsg || "Error del servidor");
    }
    
    throw new Error("Error de conexión con el servidor");
  }
}
