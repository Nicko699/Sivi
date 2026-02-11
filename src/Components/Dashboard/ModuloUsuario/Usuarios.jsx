import { useEffect, useState } from "react";
import { Search, X, Trash2, Edit, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { obtenerUsuariosFiltrados, eliminarUsuario } from "../../../Services/UsuarioServiceP/UsuarioService";
import { EliminarUsuario } from "./EliminarUsuario";
import { EditarUsuarioModal } from "./EditarUsuario";
import { Tooltip } from "../../Common/Tooltip";
import { HelpPanel } from "../../Common/HelpPanel";
import { helpContent } from "../../../helpContent";

// Función para traducir roles
const traducirRol = (rol) => {
  const traducciones = {
    'ROLE_ADMIN': 'Administrador',
    'ROLE_USER': 'Usuario',
    'ROLE_VEND': 'Vendedor',
    'ADMIN': 'Administrador',
    'USER': 'Usuario',
    'VEND': 'Vendedor'
  };
  return traducciones[rol] || rol;
};

// Modal de confirmación de eliminación
function ModalEliminar({ usuario, onClose, onUsuarioEliminado }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!usuario) return null;

  const handleEliminar = async () => {
    try {
      setLoading(true);
      setError("");
      await eliminarUsuario(usuario.id);
      onUsuarioEliminado();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al eliminar el usuario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 max-sm:p-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 max-sm:text-2xl">
          Confirmar eliminación
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-2 max-sm:text-lg">
          ¿Estás seguro de que deseas eliminar al usuario{" "}
          <span className="font-semibold text-gray-900 dark:text-white">{usuario.nombre}</span>?
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-sm:text-base">
          Esta acción no se puede deshacer.
        </p>
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm max-sm:text-base">{error}</p>
          </div>
        )}
        <div className="flex gap-3 justify-end max-sm:flex-col max-sm:gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 max-sm:py-3.5 max-sm:text-base max-sm:font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleEliminar}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 max-sm:py-3.5 max-sm:text-base max-sm:font-medium flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Eliminando...
              </>
            ) : (
              "Eliminar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroRol, setFiltroRol] = useState("");
  const [filtroActivo, setFiltroActivo] = useState("");
  const [helpAbierto, setHelpAbierto] = useState(false);

  const [modalEditar, setModalEditar] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const LoaderOverlay = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const cargarUsuarios = async (page = 0) => {
    try {
      setLoading(true);
      setError("");
      const data = await obtenerUsuariosFiltrados({
        page,
        size: 10,
        nombre: filtroNombre,
        rol: filtroRol,
        activo: filtroActivo
      });
      const datosConRolesTraducidos = data.content.map(u => ({
        ...u,
        listaRol: u.listaRol?.map(r => ({ ...r, nombre: traducirRol(r.nombre) })) || []
      }));
      setUsuarios(datosConRolesTraducidos);
      setPageNumber(data.page.number);
      setTotalPages(data.page.totalPages);
    } catch (err) {
      console.error(err);
      setUsuarios([]);
      setError(err.message || "No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => cargarUsuarios(0), 0);
    return () => clearTimeout(delaySearch);
  }, [filtroNombre, filtroRol, filtroActivo]);

  const limpiarFiltros = () => {
    setFiltroNombre("");
    setFiltroRol("");
    setFiltroActivo("");
  };

  const irPagina = (pagina) => cargarUsuarios(pagina);
  const hayFiltrosActivos = filtroNombre || filtroRol || filtroActivo;

  const handleEditar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalEditar(true);
  };

  const handleSuccess = () => {
    cargarUsuarios(pageNumber);
  };

  return (
    <div className="px-8 py-4 transition-all duration-300 max-sm:px-4 max-sm:py-6">
      {loading && <LoaderOverlay />}

      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 max-sm:gap-5 max-sm:mb-8">
        <div className="flex items-center gap-2 max-sm:justify-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl max-sm:text-3xl">
            Gestión de usuarios
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
          <Tooltip text="Ir al formulario para crear un nuevo usuario" inline position="bottom-end">
            <Link
              to="/dashboard/usuarios/crear"
              className="bg-green-600/90 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 px-6 py-2.5 rounded-lg text-white font-semibold transition-colors text-center sm:w-auto max-sm:w-full max-sm:text-base max-sm:py-3.5"
            >
              Crear Usuario
            </Link>
          </Tooltip>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-4 flex flex-col sm:flex-row flex-wrap gap-3 max-sm:gap-4 max-sm:mb-6">
        <Tooltip text="Busca usuarios por nombre" className="relative flex-1 min-w-[180px] max-sm:min-w-full">
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
          <Tooltip text="Filtra por rol: Administrador o Vendedor" position="top-end" className="flex-1 min-w-[180px] max-sm:min-w-full">
            <select
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white max-sm:py-3.5 max-sm:text-base"
            >
              <option value="">Filtrar por rol</option>
              <option value="ADMIN">Administrador</option>
              <option value="VEND">Vendedor</option>
            </select>
          </Tooltip>
          <Tooltip text="Muestra solo usuarios activos o inactivos" position="top-end" className="flex-1 min-w-[150px] max-sm:min-w-full">
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
        {loading && usuarios.length === 0 ? (
          <table className="w-full text-sm bg-white dark:bg-gray-800">
            <tbody>
              <tr>
                <td className="py-8 text-center text-gray-500 dark:text-gray-400">
                  Cargando usuarios...
                </td>
              </tr>
            </tbody>
          </table>
        ) : usuarios.length > 0 ? (
          <table className="w-full text-sm bg-white dark:bg-gray-800">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
              <th className="py-2 px-3 text-center max-sm:py-4 w-[8%]">ID</th>
              <th className="py-2 px-3 text-left max-sm:py-4 w-[12%]">Nombre</th>
              <th className="py-2 px-3 text-left max-sm:py-4 w-[20%]" >Correo</th>
              <th className="py-2 px-3 text-center max-sm:py-4 w-[18%]">Roles</th>
              <th className="py-2 px-3 text-center max-sm:py-4 w-[12%]">Estado</th>
              <th className="py-2 px-3 text-center max-sm:py-4 w-[15%]">Fecha creación</th>
              <th className="py-2 px-3 text-center max-sm:py-4 w-[20%]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700/50"
                >
                  <td className="py-2 px-3 text-center text-gray-600 dark:text-gray-400 max-sm:py-4">{u.id}</td>
                  <td className="py-2 px-3 text-left font-medium dark:text-white max-sm:py-4">{u.nombre}</td>
                  <td className="py-2 px-3 text-left dark:text-gray-300 max-sm:py-4">{u.correo}</td>
                  <td className="py-2 px-3 text-center max-sm:py-4">
                    <div className="flex flex-wrap justify-center gap-1">
                      {u.listaRol?.map((r, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                        >
                          {r.nombre}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-2 px-3 text-center max-sm:py-4">
                    <span className={`inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-full ${
                      u.activo
                        ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
                        : "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
                    }`}>
                      {u.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center text-gray-600 dark:text-gray-400 max-sm:py-4 max-sm:text-xs">
                    {new Date(u.fechaCreacion).toLocaleDateString()}
                  </td>
                  <td className="px-3 text-center max-sm:py-4">
                    <div className="flex justify-center items-center gap-2">
                      <Tooltip text="Editar usuario" inline>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEditar(u); }}
                          className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-all hover:shadow-md active:scale-95 focus:outline-none cursor-pointer"
                        >
                          <Edit className="w-4 h-4 pointer-events-none" />
                        </button>
                      </Tooltip>
                      <Tooltip text="Eliminar usuario" inline>
                        <button
                          onClick={(e) => { e.stopPropagation(); EliminarUsuario(u, cargarUsuarios); }}
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
                ? "No se encontraron usuarios con esos filtros."
                : "No hay usuarios registrados."}
            </div>
          )
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && usuarios.length > 0 && (
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

      <EditarUsuarioModal
        isOpen={modalEditar}
        onClose={() => setModalEditar(false)}
        usuario={usuarioSeleccionado}
        onSuccess={handleSuccess}
      />

      {/* Panel de ayuda */}
      <HelpPanel
        isOpen={helpAbierto}
        onClose={() => setHelpAbierto(false)}
        title={helpContent.usuarios.title}
        sections={helpContent.usuarios.sections}
      />
    </div>
  );
}
