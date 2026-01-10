import api from "../../Configuracion/AxiosConfig";

// 🔹 Función para obtener marcas filtradas y paginadas
export async function obtenerMarcasFiltradas({ page = 0, size = 10, nombre, activo }) {
  try {
    const params = { page, size };

    if (nombre?.trim()) params.nombre = nombre;
    if (activo !== undefined && activo !== "") params.activo = activo === "true";

    const res = await api.get("/marca/filtrarMarca", { params });
    return res.data;

  } catch (error) {
    console.error("Error al obtener marcas:", error);

    if (error.response) {
      const { status, data } = error.response;
      const backendMsg = data?.mensaje || data?.message;
      throw new Error(backendMsg || `Error ${status} al obtener marcas`);
    }

    if (error.request) {
      throw new Error("No se recibió respuesta del servidor. Revisa la conexión o CORS.");
    }

    throw new Error("Error interno al procesar la solicitud.");
  }
}

// 🔹 Función para crear marca
export async function crearMarca({ nombre, descripcion }) {
  try {
    const response = await api.post("/marca/crearMarca", {
      nombre,
      descripcion,
    });
    return response.data; // Devuelve MarcaCrearResponseDto
  } catch (error) {
    console.error("Error al crear marca:", error);

    if (error.response) {
      const { status, data } = error.response;
      const backendMsg = data?.mensaje || data?.message;

      switch (status) {
        case 400: throw new Error(backendMsg || "Datos inválidos. Verifica el nombre.");
        case 401: throw new Error("No autorizado. Inicia sesión nuevamente.");
        case 403: throw new Error("Acceso no permitido. Requiere rol ADMIN.");
        case 404: throw new Error("Recurso no encontrado.");
        default: throw new Error("Error del servidor. Intenta más tarde.");
      }
    }

    if (error.request) {
      throw new Error("No se recibió respuesta del servidor. Revisa CORS o la URL base.");
    }

    throw new Error("Error interno al procesar la solicitud.");
  }
}

// 🔹 Función para editar marca
export async function editarMarca(id, { nombre, descripcion, activo }) {
  try {
    await api.put(`/marca/editarMarca/${id}`, {
      nombre,
      descripcion,
      activo,
    });
    return true; // ✅ Retorna true si la edición fue exitosa (204 No Content)
  } catch (error) {
    console.error("Error al editar marca:", error);

    if (error.response) {
      const { status, data } = error.response;
      const backendMsg = data?.mensaje || data?.message;

      switch (status) {
        case 400: throw new Error(backendMsg || "Datos inválidos. Verifica los campos.");
        case 401: throw new Error("No autorizado. Inicia sesión nuevamente.");
        case 403: throw new Error("Acceso no permitido. Requiere rol ADMIN.");
        case 404: throw new Error(backendMsg || "Marca no encontrada.");
        default: throw new Error("Error del servidor. Intenta más tarde.");
      }
    }

    if (error.request) {
      throw new Error("No se recibió respuesta del servidor. Revisa CORS o la URL base.");
    }

    throw new Error("Error interno al procesar la solicitud.");
  }
}

// 🔹 Función para eliminar marca
export async function eliminarMarca(id) {
  try {
    await api.delete(`/marca/eliminarMarca/${id}`);
    return true; //  Retorna true si la eliminación fue exitosa (204 No Content)
  } catch (error) {
    console.error("Error al eliminar marca:", error);

    if (error.response) {
      const { status, data } = error.response;
      const backendMsg = data?.mensaje || data?.message;

      switch (status) {
        case 400: throw new Error(backendMsg || "No se puede eliminar la marca.");
        case 401: throw new Error("No autorizado. Inicia sesión nuevamente.");
        case 403: throw new Error("Acceso no permitido. Requiere rol ADMIN.");
        case 404: throw new Error(backendMsg || "Marca no encontrada.");
        default: throw new Error("Error del servidor. Intenta más tarde.");
      }
    }

    if (error.request) {
      throw new Error("No se recibió respuesta del servidor. Revisa CORS o la URL base.");
    }

    throw new Error("Error interno al procesar la solicitud.");
  }
}