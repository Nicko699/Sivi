import api from "../../Configuracion/AxiosConfig";

// Función para obtener lotes filtrados y paginados
export async function obtenerLotesFiltrados({ page = 0, size = 10, search, agotado }) {
  try {
    const params = { page, size };

    if (search?.trim()) params.search = search;
    if (agotado !== undefined && agotado !== "") params.agotado = agotado === "true";

    const res = await api.get("/lote/filtrarLotes", { params });
    return res.data;

  } catch (error) {
    console.error("Error al obtener lotes:", error);

    if (error.response) {
      const { status, data } = error.response;
      const backendMsg = data?.mensaje || data?.message;
      throw new Error(backendMsg || `Error ${status} al obtener lotes`);
    }

    if (error.request) {
      throw new Error("No se recibió respuesta del servidor. Revisa la conexión o CORS.");
    }

    throw new Error("Error interno al procesar la solicitud.");
  }
}

// Función para crear lote
export async function crearLote({ precioCompraUnitario, cantidadInicial, productoId }) {
  try {
    const response = await api.post("/lote/crearLote", {
      precioCompraUnitario,
      cantidadInicial,
      productoId,
    });
    return response.data; // Devuelve LoteCrearResponseDto
  } catch (error) {
    console.error("Error al crear lote:", error);

    if (error.response) {
      const { status, data } = error.response;
      const backendMsg = data?.mensaje || data?.message;

      switch (status) {
        case 400: throw new Error(backendMsg || "Datos inválidos. Verifica los campos.");
        case 401: throw new Error("No autorizado. Inicia sesión nuevamente.");
        case 403: throw new Error("Acceso no permitido. Requiere rol ADMIN.");
        case 404: throw new Error(backendMsg || "Producto no encontrado.");
        default: throw new Error("Error del servidor. Intenta más tarde.");
      }
    }

    if (error.request) {
      throw new Error("No se recibió respuesta del servidor. Revisa CORS o la URL base.");
    }

    throw new Error("Error interno al procesar la solicitud.");
  }
}

// Función para editar lote
export async function editarLote(id, { precioCompraUnitario, cantidadInicial }) {
  try {
    await api.put(`/lote/editarLote/${id}`, {
      precioCompraUnitario,
      cantidadInicial,
    });
    return true; // Retorna true si la edición fue exitosa (204 No Content)
  } catch (error) {
    console.error("Error al editar lote:", error);

    if (error.response) {
      const { status, data } = error.response;
      const backendMsg = data?.mensaje || data?.message;

      switch (status) {
        case 400: throw new Error(backendMsg || "Datos inválidos. Verifica los campos.");
        case 401: throw new Error("No autorizado. Inicia sesión nuevamente.");
        case 403: throw new Error("Acceso no permitido. Requiere rol ADMIN.");
        case 404: throw new Error(backendMsg || "Lote no encontrado.");
        default: throw new Error("Error del servidor. Intenta más tarde.");
      }
    }

    if (error.request) {
      throw new Error("No se recibió respuesta del servidor. Revisa CORS o la URL base.");
    }

    throw new Error("Error interno al procesar la solicitud.");
  }
}

// Función para eliminar lote
export async function eliminarLote(id) {
  try {
    await api.delete(`/lote/eliminarLote/${id}`);
    return true; // Retorna true si la eliminación fue exitosa (204 No Content)
  } catch (error) {
    console.error("Error al eliminar lote:", error);

    if (error.response) {
      const { status, data } = error.response;
      const backendMsg = data?.mensaje || data?.message;

      switch (status) {
        case 400: throw new Error(backendMsg || "No se puede eliminar el lote.");
        case 401: throw new Error("No autorizado. Inicia sesión nuevamente.");
        case 403: throw new Error("Acceso no permitido. Requiere rol ADMIN.");
        case 404: throw new Error(backendMsg || "Lote no encontrado.");
        default: throw new Error("Error del servidor. Intenta más tarde.");
      }
    }

    if (error.request) {
      throw new Error("No se recibió respuesta del servidor. Revisa CORS o la URL base.");
    }

    throw new Error("Error interno al procesar la solicitud.");
  }
}


