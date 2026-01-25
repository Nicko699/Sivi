import { useEffect, useState } from "react";
import { AlertTriangle, Search, X } from "lucide-react";
import { alertarProductosBajoStock } from "../../../Services/ProductoServiceP/ProductoService";

export function ProductosBajoStock({ isOpen, onClose, datosIniciales }) {
  const [productos, setProductos] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filtroSearch, setFiltroSearch] = useState("");
  const [datosYaCargados, setDatosYaCargados] = useState(false);

  //Componente de loading overlay
  const LoaderOverlay = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  // Cargar productos desde datosIniciales o hacer nueva consulta
  const cargarProductos = async (page = 0) => {
    try {
      setLoadingProductos(true);
      const data = await alertarProductosBajoStock({
        page,
        size: 10,
        search: filtroSearch,
      });
      setProductos(data.content);
      setPageNumber(data.page.number);
      setTotalPages(data.page.totalPages);
    } catch (err) {
      setProductos([]);
      console.error("Error al cargar productos:", err);
    } finally {
      setLoadingProductos(false);
    }
  };

  // Al abrir el modal, usa datosIniciales si están disponibles
  useEffect(() => {
    if (isOpen && !datosYaCargados && datosIniciales && !filtroSearch) {
      // Usar datos precargados
      setProductos(datosIniciales.content);
      setPageNumber(datosIniciales.page.number);
      setTotalPages(datosIniciales.page.totalPages);
      setDatosYaCargados(true);
    } else if (isOpen && (filtroSearch || datosYaCargados)) {
      // Hacer nueva consulta solo si hay búsqueda o ya se cargaron datos antes
      const delaySearch = setTimeout(() => cargarProductos(0), 300);
      return () => clearTimeout(delaySearch);
    }
  }, [filtroSearch, isOpen]);

  // Resetear estado al cerrar
  useEffect(() => {
    if (!isOpen) {
      setFiltroSearch("");
      setDatosYaCargados(false);
    }
  }, [isOpen]);

  const irPagina = (pagina) => cargarProductos(pagina);

  const formatearPrecio = (precio) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(precio);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      {loadingProductos && <LoaderOverlay />}
      
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Productos con Bajo Stock
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Buscador */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              value={filtroSearch}
              onChange={(e) => setFiltroSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white text-gray-800"
            />
            {filtroSearch && (
              <button
                onClick={() => setFiltroSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-400 cursor-pointer"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Tabla */}
        <div className="flex-1 overflow-y-auto p-6">
          {productos.length > 0 ? (
            <table className="w-full text-sm bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
                  <th className="py-3 px-4 text-left">Código</th>
                  <th className="py-3 px-4 text-left">Nombre</th>
                  <th className="py-3 px-4 text-center">Precio Venta</th>
                  <th className="py-3 px-4 text-center">Stock Actual</th>
                  <th className="py-3 px-4 text-center">Stock Mínimo</th>
                  <th className="py-3 px-4 text-center">Tipo Venta</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p, i) => (
                  <tr
                    key={p.id || i}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-3 px-4 font-mono">{p.codigoBarras}</td>
                    <td className="py-3 px-4">{p.nombre}</td>
                    <td className="py-3 px-4 text-center font-semibold text-green-600 dark:text-green-400">
                      {formatearPrecio(p.precioVenta)}
                    </td>
                    <td className="py-3 px-4 text-center text-red-600 dark:text-red-400 font-bold">
                      {p.stockTotal} {p.tipoVenta === "PESO" ? "kg" : "und"}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-300">
                      {p.stockMinimoAlerta} {p.tipoVenta === "PESO" ? "kg" : "und"}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-700 dark:text-gray-300">
                      {p.tipoVenta === "PESO" ? "Kg" : "Unidad"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No se encontraron productos con bajo stock
            </div>
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && productos.length > 0 && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-center gap-3">
            <button
              disabled={pageNumber === 0}
              onClick={() => irPagina(pageNumber - 1)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
            >
              Anterior
            </button>
            <span className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium">
              Página {pageNumber + 1} de {totalPages}
            </span>
            <button
              disabled={pageNumber + 1 >= totalPages}
              onClick={() => irPagina(pageNumber + 1)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}