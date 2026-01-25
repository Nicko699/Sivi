import api from "../../Configuracion/AxiosConfig";

// 🔹 Función para obtener productos filtrados y paginados (ADMIN)
export async function obtenerProductosFiltradosAdmin({ page = 0,  size = 10, search, activo, categoriaId }) {
  try {
    const params = { page, size };

    if (search?.trim()) params.search = search;
    if (activo !== undefined && activo !== "") params.activo = activo === "true";
    if (categoriaId) params.categoriaId = categoriaId;

    const res = await api.get("/producto/admin/filtrarProductos", { params });
    return res.data;

  } catch (error) {
    console.error("Error al obtener productos:", error);

    if (error.response) {
      const { status, data } = error.response;
      const backendMsg = data?.mensaje || data?.message;
      throw new Error(backendMsg || `Error ${status} al obtener productos`);
    }

    if (error.request) {
      throw new Error("No se recibió respuesta del servidor. Revisa la conexión o CORS.");
    }

    throw new Error("Error interno al procesar la solicitud.");
  }
}

// 🔹 Función para obtener productos filtrados (VENDEDOR)
export async function obtenerProductosFiltradosVend({ page = 0, size = 10, search, categoriaId }) {
  try {
    const params = { page, size };

    if (search?.trim()) params.search = search;
    if (categoriaId) params.categoriaId = categoriaId;

    const res = await api.get("/producto/vend/filtrarProductos", { params });
    return res.data;

  } catch (error) {
    console.error("Error al obtener productos:", error);

    if (error.response) {
      const { status, data } = error.response;
      const backendMsg = data?.mensaje || data?.message;
      throw new Error(backendMsg || `Error ${status} al obtener productos`);
    }

    if (error.request) {
      throw new Error("No se recibió respuesta del servidor. Revisa la conexión o CORS.");
    }

    throw new Error("Error interno al procesar la solicitud.");
  }
}

// 🔹 Función para crear producto
export async function crearProducto({codigoBarras,nombre,descripcion,precioVenta,stockMinimoAlerta,tipoVenta,categoriaId,
  marcaId})
   {
  try {
    const response = await api.post("/producto/crearProducto", {
      codigoBarras,
      nombre,
      descripcion,
      precioVenta,
      stockMinimoAlerta,
      tipoVenta,
      categoriaId,
      marcaId
    });
    return response.data; // Devuelve ProductoCrearResponseDto
  } catch (error) {
    console.error("Error al crear producto:", error);

    if (error.response) {
      const { status, data } = error.response;
      const backendMsg = data?.mensaje || data?.message;

      switch (status) {
        case 400: 
          throw new Error(backendMsg || "Datos inválidos. Verifica todos los campos obligatorios.");
        case 401: 
          throw new Error("No autorizado. Inicia sesión nuevamente.");
        case 403: 
          throw new Error("Acceso no permitido. Requiere rol ADMIN.");
        case 404: 
          throw new Error(backendMsg || "Categoría o marca no encontrada.");
        default: 
          throw new Error("Error del servidor. Intenta más tarde.");
      }
    }

    if (error.request) {
      throw new Error("No se recibió respuesta del servidor. Revisa CORS o la URL base.");
    }

    throw new Error("Error interno al procesar la solicitud.");
  }
}

// 🔹 Función para editar producto
export async function editarProducto(id, { nombre, descripcion, precioVenta, stockMinimoAlerta, activo, tipoVenta, categoriaId, marcaId }) {
  try {
    const response = await api.put(`/producto/editarProducto/${id}`, {
      nombre,
      descripcion,
      precioVenta,
      stockMinimoAlerta,
      activo,
      tipoVenta,
      categoriaId,
      marcaId
    });
    return response.data; // 204 No Content (sin body)
  } catch (error) {
    console.error("Error al editar producto:", error);

    if (error.response) {
      const { status, data } = error.response;
      const backendMsg = data?.mensaje || data?.message;

      switch (status) {
        case 400:
          throw new Error(backendMsg || "Datos inválidos. Verifica todos los campos obligatorios.");
        case 401:
          throw new Error("No autorizado. Inicia sesión nuevamente.");
        case 403:
          throw new Error("Acceso no permitido. Requiere rol ADMIN.");
        case 404:
          throw new Error(backendMsg || "Producto, categoría o marca no encontrada.");
        default:
          throw new Error("Error del servidor. Intenta más tarde.");
      }
    }

    if (error.request) {
      throw new Error("No se recibió respuesta del servidor. Revisa CORS o la URL base.");
    }

    throw new Error("Error interno al procesar la solicitud.");
  }
}

// 🔹 Función para eliminar producto
export async function eliminarProducto(id) {
  try {
    const response = await api.delete(`/producto/eliminarProducto/${id}`);
    return response.data; // 204 No Content (sin body)
  } catch (error) {
    console.error("Error al eliminar producto:", error);

    if (error.response) {
      const { status, data } = error.response;
      const backendMsg = data?.mensaje || data?.message;

      switch (status) {
        case 400:
          throw new Error(backendMsg || "No se puede eliminar el producto. Verifica las restricciones.");
        case 401:
          throw new Error("No autorizado. Inicia sesión nuevamente.");
        case 403:
          throw new Error("Acceso no permitido. Requiere rol ADMIN.");
        case 404:
          throw new Error(backendMsg || "Producto no encontrado.");
        default:
          throw new Error("Error del servidor. Intenta más tarde.");
      }
    }

    if (error.request) {
      throw new Error("No se recibió respuesta del servidor. Revisa CORS o la URL base.");
    }

    throw new Error("Error interno al procesar la solicitud.");
  }
}

// Función para obtener productos con bajo stock (ADMIN y VENDEDOR)
export async function alertarProductosBajoStock({ page = 0, size = 10, search }) {
  try {
    const params = { page, size };

    if (search?.trim()) params.search = search;

    const res = await api.get("/producto/alertarProductosBajoStock", { params });
    return res.data;

  } catch (error) {
    console.error("Error al obtener productos bajo stock:", error);

    if (error.response) {
      const { status, data } = error.response;
      const backendMsg = data?.mensaje || data?.message;

      switch (status) {
        case 401:
          throw new Error("No autorizado. Inicia sesión nuevamente.");
        case 403:
          throw new Error("Acceso no permitido. Requiere rol ADMIN o VENDEDOR.");
        case 404:
          throw new Error(backendMsg || "No se encontraron productos.");
        default:
          throw new Error(backendMsg || `Error ${status} al obtener productos bajo stock`);
      }
    }

    if (error.request) {
      throw new Error("No se recibió respuesta del servidor. Revisa la conexión o CORS.");
    }

    throw new Error("Error interno al procesar la solicitud.");
  }
}

// Función para filtrar productos al crear lote
export async function filtrarProductosParaLote({ page = 0, size = 10, search }) {
  try {
    const params = { page, size };

    if (search?.trim()) params.search = search;

    const res = await api.get("/producto/filtrarProductosLotes", { params });
    return res.data;

  } catch (error) {
    console.error("Error al obtener productos para lote:", error);

    if (error.response) {
      const { status, data } = error.response;
      const backendMsg = data?.mensaje || data?.message;
      throw new Error(backendMsg || `Error ${status} al obtener productos`);
    }

    if (error.request) {
      throw new Error("No se recibió respuesta del servidor. Revisa la conexión o CORS.");
    }

    throw new Error("Error interno al procesar la solicitud.");
  }}