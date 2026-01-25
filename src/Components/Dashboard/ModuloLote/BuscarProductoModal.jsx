import { useState, useEffect } from "react";
import { Search, X, Package, CheckCircle, Loader2 } from "lucide-react";
import { filtrarProductosParaLote } from "../../../Services/ProductoServiceP/ProductoService";

export function BuscarProductoModal({ isOpen, onClose, onSelectProducto, productoActual }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filtroSearch, setFiltroSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const cargarProductos = async (page = 0) => {
    try {
      setLoading(true);
      setError("");
      const data = await filtrarProductosParaLote({
        page,
        size: 9,
        search: filtroSearch,
      });
      setProductos(data.content);
      setPageNumber(data.page.number);
      setTotalPages(data.page.totalPages);
    } catch {
      setError("No se pudieron cargar los productos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => cargarProductos(0), 200);
      return () => clearTimeout(timer);
    }
  }, [filtroSearch, isOpen]);

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
        <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden animate-fadeIn">

          {/* Encabezado */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-900">
            <div className="flex items-center gap-3">
              <Package className="text-white" size={22} />
              <h2 className="text-lg font-semibold text-white">Buscar Producto</h2>
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
                placeholder="Buscar por código o nombre..."
                value={filtroSearch}
                onChange={(e) => setFiltroSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-400 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-150"
              />
              {filtroSearch && (
                <button
                  type="button"
                  onClick={() => setFiltroSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Contenido principal */}
          <div className="p-6 min-h-[400px] max-h-[500px] overflow-y-auto bg-gray-100 dark:bg-slate-900">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
                <Loader2 className="animate-spin text-blue-500" size={28} />
                <p className="mt-3 text-sm">Cargando productos...</p>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-12 font-medium">{error}</div>
            ) : productos.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                <Package size={36} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p>
                  {filtroSearch
                    ? "No se encontraron productos."
                    : "No hay productos registrados."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {productos.map((producto) => (
                  <button
                    key={producto.id}
                    onClick={() => {
                      onSelectProducto(producto);
                      onClose();
                    }}
                    className={`w-full h-full flex flex-col justify-between gap-3 px-4 py-4 rounded-xl border transition-all text-left cursor-pointer hover:shadow-md ${
                      productoActual?.id === producto.id
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400"
                        : "bg-gray-50 dark:bg-slate-800/40 border-gray-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-400"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                          {producto.nombre}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Código: {producto.codigoBarras || "Sin código"}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400 whitespace-nowrap">
                        $
                        {producto.precioVenta
                          ? new Intl.NumberFormat("es-CO", { minimumFractionDigits: 0 }).format(producto.precioVenta)
                          : "0"}
                      </span>
                    </div>

                    {/* Etiquetas */}
                    <div className="flex flex-wrap gap-1.5 text-[11px] mt-auto">
                      {producto.categoria && (
                        <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md">
                          {producto.categoria.nombre}
                        </span>
                      )}
                      {producto.marca && (
                        <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md">
                          {producto.marca.nombre}
                        </span>
                      )}
                      {producto.tipoVenta && (
                        <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md">
                          {producto.tipoVenta === "PESO" ? "Peso (Kg)" : "Unidad"}
                        </span>
                      )}
                    </div>

                    {productoActual?.id === producto.id && (
                      <div className="flex items-center justify-end">
                        <CheckCircle size={20} className="text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 dark:border-slate-700 px-6 py-4 bg-gray-50 dark:bg-slate-800 flex justify-center items-center gap-3">
              <button
                disabled={pageNumber === 0}
                onClick={() => cargarProductos(pageNumber - 1)}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Página {pageNumber + 1} de {totalPages}
              </span>
              <button
                disabled={pageNumber + 1 >= totalPages}
                onClick={() => cargarProductos(pageNumber + 1)}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
