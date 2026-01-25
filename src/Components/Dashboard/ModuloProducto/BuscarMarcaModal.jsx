import { useState, useEffect } from "react";
import { Search, X, Tag, CheckCircle, Loader2 } from "lucide-react";
import { obtenerMarcasFiltradas } from "../../../Services/MarcaServiceP/MarcaService";

export function BuscarMarcaModal({ isOpen, onClose, onSelectMarca, marcaActual }) {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const cargarMarcas = async (page = 0) => {
    try {
      setLoading(true);
      setError("");
      const data = await obtenerMarcasFiltradas({
        page,
        size: 12, // Cambiado a 12 marcas por página
        nombre: filtroNombre,
        activo: "true",
      });
      setMarcas(data.content);
      setPageNumber(data.page.number);
      setTotalPages(data.page.totalPages);
    } catch {
      setError("No se pudieron cargar las marcas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => cargarMarcas(0), 200);
      return () => clearTimeout(timer);
    }
  }, [filtroNombre, isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Fondo borroso */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Contenedor modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden animate-fadeIn">
          
          {/* Encabezado */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-900">
            <div className="flex items-center gap-3">
              <Tag className="text-white" size={22} />
              <h2 className="text-lg font-semibold text-white">Buscar Marca</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition cursor-pointer"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* Barra de búsqueda */}
          <div className="px-6 py-4 bg-gray-100 dark:bg-slate-900">
            <div className="relative flex items-center">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Buscar marca por nombre..."
                value={filtroNombre}
                onChange={(e) => setFiltroNombre(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-400 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-150"
              />
              {filtroNombre && (
                <button
                  type="button"
                  onClick={() => setFiltroNombre("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Contenido principal */}
          <div className="p-6 pb-4 min-h-[300px] bg-gray-100 dark:bg-slate-900">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
                <Loader2 className="animate-spin text-blue-500" size={28} />
                <p className="mt-3 text-sm">Cargando marcas...</p>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-12 font-medium">{error}</div>
            ) : marcas.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                <Tag size={36} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p>
                  {filtroNombre
                    ? "No se encontraron marcas con ese nombre."
                    : "No hay marcas registradas."}
                </p>
              </div>
            ) : (
              <>
                {/* Grid de 3 columnas x 4 filas (hasta 12 elementos por página) */}
                <div className="grid grid-cols-3 gap-3">
                  {marcas.map((marca) => (
                    <button
                      key={marca.id}
                      onClick={() => {
                        onSelectMarca(marca);
                        onClose();
                      }}
                      className={`flex justify-between items-center px-4 py-3 rounded-xl border transition-all text-left cursor-pointer hover:shadow-md ${
                        marcaActual?.id === marca.id
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400"
                          : "bg-gray-50 dark:bg-slate-800/40 border-gray-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-400"
                      }`}
                    >
                      <span className="font-medium text-gray-800 dark:text-gray-100">
                        {marca.nombre}
                      </span>
                      {marcaActual?.id === marca.id && (
                        <CheckCircle
                          size={18}
                          className="text-blue-600 dark:text-blue-400"
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="mt-6 flex justify-center items-center gap-3">
                    <button
                      disabled={pageNumber === 0}
                      onClick={() => cargarMarcas(pageNumber - 1)}
                      className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-all cursor-pointer"
                    >
                      Anterior
                    </button>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Página {pageNumber + 1} de {totalPages}
                    </span>
                    <button
                      disabled={pageNumber + 1 >= totalPages}
                      onClick={() => cargarMarcas(pageNumber + 1)}
                      className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-all cursor-pointer"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
