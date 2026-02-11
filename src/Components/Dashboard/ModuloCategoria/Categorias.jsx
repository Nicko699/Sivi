import { useEffect, useState } from "react";
import { Search, X, Trash2, Edit, Eye, HelpCircle } from "lucide-react";
import { obtenerCategoriasFiltradas } from "../../../Services/CategoriaServiceP/CategoriaService";
import { CrearCategoria } from "./CrearCategoria";
import { EditarCategoria } from "./EditarCategoria";
import { EliminarCategoria } from "./EliminarCategoria";
import { VerCategoria } from "./VerCategoria";
import { Tooltip } from "../../Common/Tooltip";
import { HelpPanel } from "../../Common/HelpPanel";
import { helpContent } from "../../../helpContent";

export function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroActivo, setFiltroActivo] = useState("");
  const [modalDescripcion, setModalDescripcion] = useState(null);

  const [modalEditar, setModalEditar] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [helpAbierto, setHelpAbierto] = useState(false);

  const LoaderOverlay = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const cargarCategorias = async (page = 0) => {
    try {
      setLoading(true);
      setError("");
      const data = await obtenerCategoriasFiltradas({
        page,
        size: 10,
        nombre: filtroNombre,
        activo: filtroActivo,
      });
      setCategorias(data.content);
      setPageNumber(data.page.number);
      setTotalPages(data.page.totalPages);
    } catch (err) {
      console.error(err);
      setCategorias([]);
      setError(err.message || "No se pudieron cargar las categorias.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => cargarCategorias(0), 0);
    return () => clearTimeout(delaySearch);
  }, [filtroNombre, filtroActivo]);

  const limpiarFiltros = () => {
    setFiltroNombre("");
    setFiltroActivo("");
  };

  const irPagina = (pagina) => cargarCategorias(pagina);
  const hayFiltrosActivos = filtroNombre || filtroActivo;

  const handleEliminar = (c) => {
    EliminarCategoria(c, () => cargarCategorias(pageNumber));
  };

  const handleEditar = (c) => {
    setCategoriaSeleccionada(c);
    setModalEditar(true);
  };

  return (
    <div className="px-8 py-4 transition-all duration-300 max-sm:px-4 max-sm:py-6">
      {loading && <LoaderOverlay />}

      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 max-sm:gap-5 max-sm:mb-8">
        <div className="flex items-center gap-2 max-sm:justify-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl max-sm:text-3xl">
            Gestión de categorias
          </h2>
          <Tooltip text="Abrir guía rápida" inline position="bottom">
            <button
              onClick={() => setHelpAbierto(true)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors cursor-pointer"
              aria-label="Abrir guía rápida"
            >
              <HelpCircle size={20} />
            </button>
          </Tooltip>
        </div>
        <div className="flex justify-center sm:justify-end">
          <Tooltip text="Registrar una nueva categoría" inline position="bottom-end">
            <button
              onClick={() => setModalCrearAbierto(true)}
              className="bg-green-600/90 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 px-6 py-2.5 rounded-lg text-white font-semibold transition-colors text-center sm:w-auto max-sm:w-full max-sm:text-base max-sm:py-3.5 cursor-pointer"
            >
              Crear Categoria
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-4 flex flex-col sm:flex-row flex-wrap gap-3 max-sm:gap-4 max-sm:mb-6">
        <Tooltip text="Busca categorías por nombre" className="relative flex-1 min-w-[180px] max-sm:min-w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white text-gray-800 max-sm:py-3.5 max-sm:text-base"
          />
          {filtroNombre && (
            <button
              onClick={() => setFiltroNombre("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </Tooltip>
        <div className="flex gap-3 w-full sm:w-auto max-sm:flex-col max-sm:gap-4">
          <Tooltip text="Muestra solo categorías activas o inactivas" position="top-end" className="flex-1 min-w-[150px] max-sm:min-w-full">
            <select
              value={filtroActivo}
              onChange={(e) => setFiltroActivo(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white max-sm:py-3.5 max-sm:text-base"
            >
              <option value="">Filtrar por estado</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </Tooltip>
        </div>
        {hayFiltrosActivos && (
          <Tooltip text="Elimina todos los filtros aplicados" inline position="top-end">
            <button
              onClick={limpiarFiltros}
              className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 max-sm:w-full max-sm:py-3.5 max-sm:text-base max-sm:font-medium cursor-pointer"
            >
              Limpiar filtros
            </button>
          </Tooltip>
        )}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg shadow max-sm:-mx-2 max-sm:rounded-lg">
        {loading && categorias.length === 0 ? (
          <table className="w-full text-sm bg-white dark:bg-gray-800">
            <tbody>
              <tr>
                <td className="py-8 text-center text-gray-500 dark:text-gray-400">
                  Cargando categorias...
                </td>
              </tr>
            </tbody>
          </table>
        ) : categorias.length > 0 ? (
          <table className="w-full text-sm bg-white dark:bg-gray-800">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
          <th className="py-2 px-3 text-center w-[6%]">ID</th>
          <th className="py-2 px-3 text-left w-[30%]">Nombre</th>
          <th className="py-2 px-3 text-center w-[15%]">Estado</th>
          <th className="py-2 px-3 text-center w-[25%]">Fecha creación</th>
          <th className="py-2 px-3 text-center w-[24%]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700/50"
                >
                  <td className="py-2 px-3 text-center text-gray-600 dark:text-gray-400 max-sm:py-4">{c.id}</td>
                  <td className="py-2 px-3 text-left font-medium dark:text-white max-sm:py-4">{c.nombre}</td>
                  <td className="py-2 px-3 text-center max-sm:py-4">
                    <span className={`inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-full ${
                      c.activo
                        ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
                        : "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
                    }`}>
                      {c.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center text-gray-600 dark:text-gray-400 max-sm:py-4 max-sm:text-xs">
                    {new Date(c.fechaCreacion).toLocaleDateString()}
                  </td>
                  <td className="px-3 text-center max-sm:py-4">
                    <div className="flex justify-center items-center gap-2">
                      <Tooltip text="Ver detalles" inline>
                        <button
                          onClick={(e) => { e.stopPropagation(); setModalDescripcion(c); }}
                          className="p-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-800 text-white transition-all hover:shadow-md active:scale-95 focus:outline-none cursor-pointer"
                        >
                          <Eye className="w-4 h-4 pointer-events-none" />
                        </button>
                      </Tooltip>
                      <Tooltip text="Editar categoría" inline>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEditar(c); }}
                          className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-all hover:shadow-md active:scale-95 focus:outline-none cursor-pointer"
                        >
                          <Edit className="w-4 h-4 pointer-events-none" />
                        </button>
                      </Tooltip>
                      <Tooltip text="Eliminar categoría" inline>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEliminar(c); }}
                          className="p-2 rounded-lg bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white transition-all hover:shadow-md active:scale-95 focus:outline-none cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 pointer-events-none" />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !loading && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {error
                ? error
                : hayFiltrosActivos
                ? "No se encontraron categorias con esos filtros."
                : "No hay categorias registradas."}
            </div>
          )
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && categorias.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 items-center justify-center max-sm:mt-8 max-sm:gap-4">
          <button
            disabled={pageNumber === 0}
            onClick={() => irPagina(pageNumber - 1)}
            className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-colors max-sm:px-6 max-sm:py-3.5 max-sm:text-base max-sm:font-medium"
          >
            Anterior
          </button>
          <span className="px-2 dark:text-white text-sm max-sm:text-base max-sm:font-medium">
            Página {pageNumber + 1} de {totalPages}
          </span>
          <button
            disabled={pageNumber + 1 >= totalPages}
            onClick={() => irPagina(pageNumber + 1)}
            className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-colors max-sm:px-6 max-sm:py-3.5 max-sm:text-base max-sm:font-medium"
          >
            Siguiente
          </button>
        </div>
      )}

      <VerCategoria
        isOpen={modalDescripcion !== null}
        onClose={() => setModalDescripcion(null)}
        categoria={modalDescripcion}
      />
      <EditarCategoria
        isOpen={modalEditar}
        categoria={categoriaSeleccionada}
        onClose={() => { setModalEditar(false); setCategoriaSeleccionada(null); }}
        onSuccess={() => cargarCategorias(pageNumber)}
      />
      <CrearCategoria
        isOpen={modalCrearAbierto}
        onClose={() => setModalCrearAbierto(false)}
        onSuccess={() => cargarCategorias(pageNumber)}
      />

      {/* Panel de ayuda */}
      <HelpPanel
        isOpen={helpAbierto}
        onClose={() => setHelpAbierto(false)}
        title={helpContent.categorias.title}
        sections={helpContent.categorias.sections}
      />
    </div>
  );
}
