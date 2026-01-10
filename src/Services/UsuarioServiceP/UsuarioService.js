import api from "../../Configuracion/AxiosConfig";

export async function crearUsuario({ nombre, correo, password, listaRol }) {
  try {
    const response = await api.post("/usuario/crearCuenta", {
      nombre,
      correo,
      password,
      listaRol,
    });
    return response.data; // ✅ Devuelve el JSON del backend
  } catch (error) {
    console.error("Error al crear usuario:", error);

    if (error.response) {
      const { status, data } = error.response;
      const backendMsg = data?.mensaje || data?.message;

      switch (status) {
        case 400: throw new Error(backendMsg || "Datos inválidos");
        case 401: throw new Error("No autorizado");
        case 403: throw new Error("Acceso no permitido");
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


// 🔹 Función para obtener usuarios filtrados y paginados
export async function obtenerUsuariosFiltrados({ page = 0, size = 10, nombre, rol, activo }) {
  try {
    const params = { page, size };

    if (nombre?.trim()) params.nombre = nombre;
    if (rol) params.rol = `ROLE_${rol}`;
    if (activo !== undefined && activo !== "") params.activo = activo === "true";

    const res = await api.get("/usuario/ObtenerUsuariosFiltrados", { params });
    return res.data;

  } catch (error) {
    console.error("Error al obtener usuarios:", error);

    if (error.response) {
      const { status, data } = error.response;
      const backendMsg = data?.mensaje || data?.message;
      throw new Error(backendMsg || `Error ${status} al obtener usuarios`);
    }

    if (error.request) {
      throw new Error("No se recibió respuesta del servidor. Revisa la conexión o CORS.");
    }

    throw new Error("Error interno al procesar la solicitud.");
  }
}


export const eliminarUsuario = async (id) => {
  try {
    const response = await api.delete(`/usuario/eliminarUsuario/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar usuario:", error);

    const status = error.response?.status;
    const backendMessage = error.response?.data?.message;

    switch (status) {
      case 400:
        // Caso: es el único administrador
        throw new Error(
          backendMessage ||
            "No puedes eliminar este usuario porque es el único administrador activo del sistema."
        );

      case 404:
        // Caso: usuario no encontrado
        throw new Error(
          backendMessage || "El usuario no existe o ya fue eliminado."
        );

      default:
        // Cualquier otro error (500, red, etc.)
        throw new Error(
          backendMessage || "Ocurrió un error inesperado al eliminar el usuario."
        );
    }
  }
};

export const editarUsuario = async (id, usuarioData) => {
  try {
    const response = await api.put(`/usuario/editarUsuario/${id}`, usuarioData);
    return response.data;
  } catch (error) {
    console.error("Error al editar usuario:", error);

    const status = error.response?.status;
    const backendMessage = error.response?.data?.message;

    switch (status) {
      case 400:
        // Caso: validación fallida o datos inválidos
        throw new Error(
          backendMessage ||
            "Los datos proporcionados no son válidos. Verifica que todos los campos estén correctos."
        );

      case 403:
        // Caso: sin permisos de administrador
        throw new Error(
          backendMessage || 
            "No tienes permisos suficientes para editar usuarios."
        );

      case 404:
        // Caso: usuario no encontrado
        throw new Error(
          backendMessage || 
            "El usuario no existe o ya fue eliminado."
        );

      case 409:
        // Caso: conflicto (ej: intentar desactivar el único admin)
        throw new Error(
          backendMessage ||
            "No se puede realizar esta operación. Verifica que no sea el único administrador activo."
        );

      default:
        // Cualquier otro error (500, red, etc.)
        throw new Error(
          backendMessage || 
            "Ocurrió un error inesperado al editar el usuario."
        );
    }
  }
};