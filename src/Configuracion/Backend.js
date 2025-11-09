import api from "./AxiosConfigPublic.js";

export async function login(correo, password) {
  try {
    const response = await api.post("/usuario/iniciarSesion", { correo, password });
    return response.data; // ✅ Devuelve el JSON correcto
  } catch (error) {
    console.error(" Error en login:", error);

    if (error.response) {
      const { status, data } = error.response;
      const backendMsg = data?.mensaje || data?.message;

      switch (status) {
        case 400: throw new Error(backendMsg || "Datos inválidos");
        case 401: throw new Error("Correo o contraseña incorrectos");
        case 403: throw new Error("Acceso no autorizado");
        case 404: throw new Error("Recurso no encontrado");
        default: throw new Error("Error del servidor. Intenta más tarde.");
      }
    }

    if (error.request) {
      throw new Error("No se recibió respuesta del servidor. Revisa CORS o la URL base.");
    }

    throw new Error("Error interno al procesar la solicitud.");
  }
}
