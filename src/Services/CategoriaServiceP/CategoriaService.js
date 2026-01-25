import api from "../../Configuracion/AxiosConfig";

// Función para obtener categorías filtradas y paginadas 
export async function obtenerCategoriasFiltradas({ page = 0, size = 10, nombre, activo }) {
  try {
    const params = { page, size };

    if (nombre?.trim()) params.nombre = nombre;
    if (activo !== undefined && activo !== "") params.activo = activo === "true";

    const res = await api.get("/categoria/obtenerCategoriasFiltradas", { params });
    return res.data;

  } catch (error) {
    console.error("Error al obtener categorías:", error);

    if (error.response) {
      const { status, data } = error.response;
      const backendMsg = data?.mensaje || data?.message;

      switch (status) {
        case 401: 
          throw new Error("No autorizado. Inicia sesión nuevamente.");
        case 403: 
          throw new Error("Acceso no permitido. Requiere rol ADMIN.");
        case 404: 
          throw new Error(backendMsg || "No se encontraron categorías.");
        default: 
          throw new Error(backendMsg || `Error ${status} al obtener categorías`);
      }
    }

    if (error.request) {
      throw new Error("No se recibió respuesta del servidor. Revisa la conexión o CORS.");
    }

    throw new Error("Error interno al procesar la solicitud.");
  }
}