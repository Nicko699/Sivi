import { useEffect, useState } from "react";
import { Search, X, Trash2, Edit, Eye, Package, HelpCircle } from "lucide-react";
import { obtenerLotesFiltrados } from "../../../Services/LoteServiceP/LoteService";
import { CrearLote } from "./CrearLote";
import { EditarLote } from "./EditarLote";
import { EliminarLote } from "./EliminarLote";
import { VerLote } from "./VerLote";
import { Tooltip } from "../../Common/Tooltip";
import { HelpPanel } from "../../Common/HelpPanel";
import { helpContent } from "../../../helpContent";

export function Lotes() {
  const [lotes, setLotes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filtroSearch, setFiltroSearch] = useState("");
  const [filtroAgotado, setFiltroAgotado] = useState("");
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);

  const [modalVer, setModalVer] = useState(null);
  const [modalEditar, setModalEditar] = useState(false);
  const [loteSeleccionado, setLoteSeleccionado] = useState(null);
  const [helpAbierto, setHelpAbierto] = useState(false);

  const LoaderOverlay = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const cargarLotes = async (page = 0) => {
    try {
      setLoading(true);
      setError("");
      const params = {
        page,
        size: 10,
        search: filtroSearch,
        agotado: filtroAgotado || undefined,
      };
      const data = await obtenerLotesFiltrados(params);
      setLotes(data.content);
      setPageNumber(data.page.number);
      setTotalPages(data.page.totalPages);
    } catch (err) {
      setLotes([]);
      setError(err.message || "No se pudieron cargar los lotes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => cargarLotes(0), 0);
    return () => clearTimeout(delaySearch);
  }, [filtroSearch, filtroAgotado]);

  const limpiarFiltros = () => {
    setFiltroSearch("");
    setFiltroAgotado("");
  };

  const irPagina = (pagina) => cargarLotes(pagina);
  const hayFiltrosActivos = filtroSearch || filtroAgotado;

  const formatearPrecio = (precio) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(precio);

  const formatearCantidad = (cantidad, tipoVenta) => {
    const valor = parseFloat(cantidad);
    if (tipoVenta === "PESO") {
      return `${valor.toLocaleString("es-CO", {
        minimumFractionDigits: 0,
        maximumFractionDigits: valor % 1 === 0 ? 0 : 1,
      })} kg`;
    }
    return `${valor.toLocaleString("es-CO", { minimumFractionDigits: 0 })} und`;
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "-";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleEliminar = (lote) => {
    EliminarLote(lote, () => cargarLotes(pageNumber));
  };

  const handleEditar = (lote) => {
    setLoteSeleccionado(lote);
    setModalEditar(true);
  };

  const handleVer = (lote) => {
    setModalVer(lote);
  };

  return (
    <div className="px-8 py-4 transition-all duration-300 max-sm:px-4 max-sm:py-6">
      {loading && <LoaderOverlay />}

      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 max-sm:gap-5 max-sm:mb-8">
        <div className="flex items-center gap-2 max-sm:justify-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl max-sm:text-3xl">
            Gestión de lotes
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
          <Tooltip text="Registrar un nuevo lote de mercancía" inline position="bottom-end">
            <button
              onClick={() => setModalCrearAbierto(true)}
              className="bg-green-600/90 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 px-6 py-2.5 rounded-lg text-white font-semibold transition-colors text-center sm:w-auto max-sm:w-full max-sm:text-base max-sm:py-3.5 cursor-pointer"
            >
              Crear Lote
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-4 flex flex-col sm:flex-row flex-wrap gap-3 max-sm:gap-4 max-sm:mb-6">
        <Tooltip text="Busca lotes por código o nombre de producto" className="relative flex-1 min-w-[180px] max-sm:min-w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por código de lote o producto..."
            value={filtroSearch}
            onChange={(e) => setFiltroSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white text-gray-800 max-sm:py-3.5 max-sm:text-base"
          />
          {filtroSearch && (
            <button
              onClick={() => setFiltroSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </Tooltip>

        <div className="flex gap-3 w-full sm:w-auto max-sm:flex-col max-sm:gap-4">
          <Tooltip text="Filtra entre lotes disponibles y agotados" position="top-end" className="flex-1 min-w-[150px] max-sm:min-w-full">
            <select
              value={filtroAgotado}
              onChange={(e) => setFiltroAgotado(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white max-sm:py-3.5 max-sm:text-base"
            >
              <option value="">Filtrar por estado</option>
              <option value="false">Disponible</option>
              <option value="true">Agotado</option>
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
        {loading && lotes.length === 0 ? (
          <table className="w-full text-sm bg-white dark:bg-gray-800">
            <tbody>
              <tr>
                <td className="py-8 text-center text-gray-500 dark:text-gray-400">
                  Cargando lotes...
                </td>
              </tr>
            </tbody>
          </table>
        ) : lotes.length > 0 ? (
          <table className="w-full text-sm bg-white dark:bg-gray-800">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
      <th className="py-2 px-3 text-left w-[12%]">Código Lote</th>
      <th className="py-2 px-3 text-left w-[18%]">Producto</th>
      <th className="py-2 px-3 text-left w-[10%]">Marca</th>
      <th className="py-2 px-3 text-center w-[10%]">Precio Compra</th>
      <th className="py-2 px-3 text-center w-[8%]">Cant. Inicial</th>
      <th className="py-2 px-3 text-center w-[8%]">Cant. Actual</th>
      <th className="py-2 px-3 text-center w-[10%]">Fecha Compra</th>
      <th className="py-2 px-3 text-center w-[8%]">Estado</th>
      <th className="py-2 px-3 text-center w-[18%]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {lotes.map((lote, index) => {
                const stockBajo = lote.cantidadActual / lote.cantidadInicial < 0.3;
                return (
                  <tr
                    key={lote.id || index}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-2 px-3 text-left font-mono text-xs max-sm:py-4">
                      {lote.codigoLote || "-"}
                    </td>
                    <td className="py-2 px-3 text-left max-sm:py-4">
                      <div className="flex items-center gap-2">
                        <Package size={16} className="text-blue-500" />
                        <span className="font-medium">{lote.producto?.nombre || "Sin producto"}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-left max-sm:py-4">
                      {lote.producto?.marca?.nombre || "Sin marca"}
                    </td>
                    <td className="py-2 px-3 text-center font-semibold text-green-600 dark:text-green-400 max-sm:py-4">
                      {formatearPrecio(lote.precioCompraUnitario)}
                    </td>
                    <td className="py-2 px-3 text-center text-gray-700 dark:text-gray-300 max-sm:py-4">
                      {formatearCantidad(lote.cantidadInicial, lote.producto?.tipoVenta)}
                    </td>
                    <td className="py-2 px-3 text-center max-sm:py-4">
                      <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full ${
                        lote.agotado
                          ? "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
                          : stockBajo
                          ? "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300"
                          : "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                      }`}>
                        {formatearCantidad(lote.cantidadActual, lote.producto?.tipoVenta)}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center text-gray-600 dark:text-gray-400 max-sm:py-4">
                      {formatearFecha(lote.fechaCompra)}
                    </td>
                    <td className="py-2 px-3 text-center max-sm:py-4">
                      <span className={`inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-full ${
                        lote.agotado
                          ? "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
                          : "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
                      }`}>
                        {lote.agotado ? "Agotado" : "Disponible"}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center max-sm:py-4">
                      <div className="flex justify-center items-center gap-2">
                        <Tooltip text="Ver detalles del lote" inline>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleVer(lote); }}
                            className="p-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-800 text-white transition-all hover:shadow-md active:scale-95 focus:outline-none cursor-pointer"
                          >
                            <Eye className="w-4 h-4 pointer-events-none" />
                          </button>
                        </Tooltip>
                        <Tooltip text="Editar lote" inline>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEditar(lote); }}
                            className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-all hover:shadow-md active:scale-95 focus:outline-none cursor-pointer"
                          >
                            <Edit className="w-4 h-4 pointer-events-none" />
                          </button>
                        </Tooltip>
                        <Tooltip text="Eliminar lote" inline>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEliminar(lote); }}
                            className="p-2 rounded-lg bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white transition-all hover:shadow-md active:scale-95 focus:outline-none cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 pointer-events-none" />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          !loading && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {error
                ? error
                : hayFiltrosActivos
                ? "No se encontraron lotes con esos filtros."
                : "No hay lotes registrados."}
            </div>
          )
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && lotes.length > 0 && (
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

      <CrearLote
        isOpen={modalCrearAbierto}
        onClose={() => setModalCrearAbierto(false)}
        onSuccess={() => cargarLotes(pageNumber)}
      />
      <VerLote
        isOpen={modalVer !== null}
        onClose={() => setModalVer(null)}
        lote={modalVer}
      />
      <EditarLote
        isOpen={modalEditar}
        lote={loteSeleccionado}
        onClose={() => { setModalEditar(false); setLoteSeleccionado(null); }}
        onSuccess={() => cargarLotes(pageNumber)}
      />

      {/* Panel de ayuda */}
      <HelpPanel
        isOpen={helpAbierto}
        onClose={() => setHelpAbierto(false)}
        title={helpContent.lotes.title}
        sections={helpContent.lotes.sections}
      />
    </div>
  );
}
