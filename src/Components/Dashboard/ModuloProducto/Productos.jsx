import { useEffect, useState } from "react";
import { Search, X, Trash2, Edit, Eye } from "lucide-react";
import {
  obtenerProductosFiltradosAdmin,
  obtenerProductosFiltradosVend,
} from "../../../Services/ProductoServiceP/ProductoService";
import { CrearProducto } from "./CrearProducto";
import { EditarProducto } from "./EditarProducto";
import { EliminarProducto } from "./EliminarProducto";
import { VerProducto } from "./VerProducto";
import { useAccessToken } from "../../../Context/Auht/UseAccessToken";

export function Productos() {
  const { getRolesUsuario } = useAccessToken();

  const [productos, setProductos] = useState([]);
  const [categorias] = useState([]);
  const [marcas] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filtroSearch, setFiltroSearch] = useState("");
  const [filtroActivo, setFiltroActivo] = useState("");
  const [filtroCategoriaId, setFiltroCategoriaId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);

  // Modales adicionales
  const [modalDescripcion, setModalDescripcion] = useState(null);
  const [modalEditar, setModalEditar] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    const rolesUsuario = getRolesUsuario();

    if (!rolesUsuario || rolesUsuario.length === 0) {
      return;
    }

    if (rolesUsuario.includes("ROLE_ADMIN")) {
      setUserRole("ADMIN");
    } else if (rolesUsuario.includes("ROLE_VEND")) {
      setUserRole("VEND");
    }
  }, [getRolesUsuario]);

  const isAdmin = userRole === "ADMIN";
  const isVend = userRole === "VEND";

  const LoaderOverlay = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const cargarProductos = async (page = 0) => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        size: 10,
        search: filtroSearch,
        categoriaId: filtroCategoriaId || undefined,
      };

      let data;
      if (isAdmin) {
        params.activo = filtroActivo;
        data = await obtenerProductosFiltradosAdmin(params);
      } else if (isVend) {
        data = await obtenerProductosFiltradosVend(params);
      }

      setProductos(data.content);
      setPageNumber(data.page.number);
      setTotalPages(data.page.totalPages);
    } catch (err) {
      setProductos([]);
      setError(err.message || "No se pudieron cargar los productos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole) {
      const delaySearch = setTimeout(() => cargarProductos(0), 0);
      return () => clearTimeout(delaySearch);
    }
  }, [filtroSearch, filtroActivo, filtroCategoriaId, userRole]);

  const limpiarFiltros = () => {
    setFiltroSearch("");
    setFiltroActivo("");
    setFiltroCategoriaId("");
  };

  const irPagina = (pagina) => cargarProductos(pagina);
  const hayFiltrosActivos = filtroSearch || filtroActivo || filtroCategoriaId;

  const formatearPrecio = (precio) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(precio);
};

const formatearStock = (stock, unidad) => {
  const valor = parseFloat(stock);

  if (unidad === "KILOGRAMO") {
    // Muestra coma y evita ceros innecesarios
    return `${valor.toLocaleString("es-CO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: valor % 1 === 0 ? 0 : 1,
    })} kg`;
  }

  // Para unidades normales
  return `${valor.toLocaleString("es-CO", {
    minimumFractionDigits: 0,
  })} und`;
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

  // Funciones para modales de editar y eliminar
  const handleEliminar = (producto) => {
    EliminarProducto(producto, () => cargarProductos(pageNumber));
  };

  const handleEditar = (producto) => {
    setProductoSeleccionado(producto);
    setModalEditar(true);
  };

  return (
    <div className="px-8 py-4 transition-all duration-300 max-sm:px-4 max-sm:py-6">
      {loading && <LoaderOverlay />}

      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 max-sm:gap-5 max-sm:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl max-sm:text-3xl max-sm:text-center">
          {isAdmin ? "Gestión de productos" : "Productos disponibles"}
        </h2>

        {isAdmin && (
          <div className="flex justify-center sm:justify-end">
            <button
              onClick={() => setModalCrearAbierto(true)}
              className="bg-green-600/90 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 px-6 py-2.5 rounded-lg text-white font-semibold transition-colors text-center sm:w-auto max-sm:w-full max-sm:text-base max-sm:py-3.5 cursor-pointer"
            >
              Crear Producto
            </button>
          </div>
        )}
      </div>

      {/* Filtros */}
      <div className="mb-4 flex flex-col sm:flex-row flex-wrap gap-3 max-sm:gap-4 max-sm:mb-6">
        <div className="relative flex-1 min-w-[180px] max-sm:min-w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o código..."
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
        </div>

        <div className="flex gap-3 w-full sm:w-auto max-sm:flex-col max-sm:gap-4">
          <select
            value={filtroCategoriaId}
            onChange={(e) => setFiltroCategoriaId(e.target.value)}
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white min-w-[150px] max-sm:py-3.5 max-sm:text-base max-sm:min-w-full"
          >
            <option value="">Filtrar por categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>

          {isAdmin && (
            <select
              value={filtroActivo}
              onChange={(e) => setFiltroActivo(e.target.value)}
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white min-w-[150px] max-sm:py-3.5 max-sm:text-base max-sm:min-w-full"
            >
              <option value="">Filtrar por estado</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          )}
        </div>

        {hayFiltrosActivos && (
          <button
            onClick={limpiarFiltros}
            className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 max-sm:w-full max-sm:py-3.5 max-sm:text-base max-sm:font-medium cursor-pointer"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg shadow max-sm:-mx-2 max-sm:rounded-lg">
        {loading && productos.length === 0 ? (
          <table className="w-full text-sm bg-white dark:bg-gray-800">
            <tbody>
              <tr>
                <td className="py-8 text-center text-gray-500 dark:text-gray-400">
                  Cargando productos...
                </td>
              </tr>
            </tbody>
          </table>
        ) : productos.length > 0 ? (
          <table className="w-full text-sm bg-white dark:bg-gray-800">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
                <th className="py-2 px-3 text-left w-[10%]">Código</th>
                <th className="py-2 px-3 text-left w-[14%]">Nombre</th>
                <th className="py-2 px-3 text-left w-[10%]">Categoría</th>
                <th className="py-2 px-3 text-center w-[6%]">Precio Unitario</th>
                <th className="py-2 px-3 text-center w-[8%]">Stock actual</th>
                <th className="py-2 px-3 text-center w-[6%]">Stock Mínimo</th>
                <th className="py-2 px-3 text-center w-[6%]">Tipo Venta</th>
                {isAdmin && <th className="py-2 px-3 text-center w-[6%]">Fecha de Creación</th>}
                {isAdmin && <th className="py-2 px-3 text-center w-[6%]">Estado</th>}
                {isAdmin && <th className="py-2 px-3 text-center w-[15%]">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {productos.map((p, index) => (
                <tr
                  key={p.codigoBarras || index}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700/50"
                >
                  <td className="py-2 px-3 text-left text-xs  max-sm:py-4">{p.codigoBarras || "-"}</td>
                  <td className="py-2 px-3 text-left max-sm:py-4">{p.nombre}</td>
                  <td className="py-2 px-3 text-left text-gray-600 dark:text-gray-400 max-sm:py-4">
                    {p.categoria?.nombre || "Sin categoría"}
                  </td>
              
                  <td className="py-2 px-3 text-center font-semibold text-green-600 dark:text-green-400 max-sm:py-4">
                    {formatearPrecio(p.precioVenta)}
                  </td>
                  <td className="py-2 px-3 text-center max-sm:py-4">
                    <span
                      className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full ${
                        p.bajoStock
                          ? "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
                          : "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                      }`}
                    >
                      {formatearStock(p.stockTotal, p.unidadBase)}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center text-gray-600 dark:text-gray-400 max-sm:py-4">
                    {formatearStock(p.stockMinimoAlerta, p.unidadBase)}
                  </td>
                  {/* Tipo Venta */}
               <td className="py-2 px-3 text-center max-sm:py-4 text-gray-700 dark:text-gray-300">
              {p.tipoVenta === "PESO" ? "Kg" : "Unidad"}
             </td>
                  {isAdmin && (
                    <td className="py-2 px-3 text-center text-gray-600 dark:text-gray-400 max-sm:py-4">
                      {formatearFecha(p.fechaCreacion)}
                    </td>
                  )}
                  {isAdmin && (
                    <td className="py-2 px-3 text-center max-sm:py-4">
                      <span
                        className={`inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-full ${
                          p.activo
                            ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
                            : "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
                        }`}
                      >
                        {p.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                  )}
{isAdmin && (
  <td className="py-2 px-3 text-center max-sm:py-4">
    <div className="flex justify-center items-center gap-2">

      {/* Ver detalles */}
      <div className="relative group inline-block">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setModalDescripcion(p);
          }}
          className="p-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-800 text-white transition-all hover:shadow-md active:scale-95 focus:outline-none cursor-pointer"
        >
          <Eye className="w-4 h-4 pointer-events-none" />
        </button>
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md py-1.5 px-2.5 whitespace-nowrap transition-opacity duration-200 pointer-events-none shadow-lg z-10">
          Ver detalles 
        </span>
      </div>

      {/* Editar */}
      <div className="relative group inline-block">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEditar(p);
          }}
          className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-all hover:shadow-md active:scale-95 focus:outline-none cursor-pointer"
        >
          <Edit className="w-4 h-4 pointer-events-none" />
        </button>
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md py-1.5 px-2.5 whitespace-nowrap transition-opacity duration-200 pointer-events-none shadow-lg z-10">
          Editar producto
        </span>
      </div>

      {/* Eliminar */}
      <div className="relative group inline-block">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEliminar(p);
          }}
          className="p-2 rounded-lg bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white transition-all hover:shadow-md active:scale-95 focus:outline-none cursor-pointer"
        >
          <Trash2 className="w-4 h-4 pointer-events-none" />
        </button>
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md py-1.5 px-2.5 whitespace-nowrap transition-opacity duration-200 pointer-events-none shadow-lg z-10">
          Eliminar producto
        </span>
      </div>

    </div>
  </td>
)}

                             
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
                ? "No se encontraron productos con esos filtros."
                : "No hay productos registrados."}
            </div>
          )
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && productos.length > 0 && (
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

      {/* Modal Crear */}
      {isAdmin && (
        <CrearProducto
          isOpen={modalCrearAbierto}
          onClose={() => setModalCrearAbierto(false)}
          onSuccess={() => cargarProductos(pageNumber)}
          categorias={categorias}
          marcas={marcas}
        />
      )}

      {/* Modal Ver */}
      <VerProducto
        isOpen={modalDescripcion !== null}
        onClose={() => setModalDescripcion(null)}
        producto={modalDescripcion}
      />

      {/* Modal Editar */}
      <EditarProducto
        isOpen={modalEditar}
        producto={productoSeleccionado}
        onClose={() => {
          setModalEditar(false);
          setProductoSeleccionado(null);
        }}
        onSuccess={() => cargarProductos(pageNumber)}
        categorias={categorias}
        marcas={marcas}
      />
    </div>
  );
}
