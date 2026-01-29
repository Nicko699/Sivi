import api from "../../Configuracion/AxiosConfig";

// 1. Obtener categorías filtradas y paginadas
export async function obtenerCategoriasFiltradas({ page = 0, size = 10, nombre, activo }) {
  const params = { page, size };
  if (nombre?.trim()) params.nombre = nombre;
  if (activo !== undefined && activo !== "") params.activo = activo === "true";

  const res = await api.get("/categoria/obtenerCategoriasFiltradas", { params });
  return res.data;
}

// 2. Crear categoría 
export async function crearCategoria(datos) {
  const res = await api.post("/categoria/crear", datos);
  return res.data;
}

// 3. Editar categoría
export async function editarCategoria(id, datos) {
  const res = await api.put(`/categoria/editar/${id}`, datos);
  return res.data;
}

// 4. Eliminar categoría
export async function eliminarCategoria(id) {
  const res = await api.delete(`/categoria/eliminar/${id}`);
  return res.data;
}