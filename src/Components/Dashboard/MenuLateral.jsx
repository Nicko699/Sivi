import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Users, X, Tag, Package } from "lucide-react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useAccessToken } from "../../Context/Auht/UseAccessToken";
import useDarkMode from "../../Context/Theme/DarkMode";

export function Sidebar({ isOpen, onClose }) {
    
   const navigate = useNavigate();
  const { setAccessToken } = useAccessToken();

  const { getNombreUsuario, getRolesUsuario } = useAccessToken();
  const [darkMode, toggleDarkMode] = useDarkMode();

  const nombreUsuario = getNombreUsuario() || "Usuario";
  const rolesUsuario = getRolesUsuario();

  const isAdmin = rolesUsuario.includes("ROLE_ADMIN");
  const isVendedor = rolesUsuario.includes("ROLE_VEND");
  const isUser = rolesUsuario.includes("ROLE_USER");

  const obtenerEtiquetaRol = () => {
    const etiquetas = [];
    if (isAdmin) etiquetas.push("Administrador");
    if (isVendedor) etiquetas.push("Vendedor");
    if (isUser) etiquetas.push("Usuario");
    return etiquetas.join(" / ");
  };

  const claseLink = ({ isActive }) =>
    `flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-blue-700 transition-colors ${
      isActive ? "bg-blue-700 font-semibold" : ""
    }`;

  return (
    <>
      {/* Fondo oscuro cuando el menú móvil está abierto */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Menú lateral */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-blue-800 dark:bg-gray-800 text-white flex flex-col shadow-lg z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static lg:shadow-none lg:z-0`}
      >
        {/* Encabezado */}
        <div className="p-4 border-b border-blue-700 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold">SIVI</h2>
          {/* Botón de cerrar solo visible en móviles */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-full hover:bg-blue-700 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navegación con scroll */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <NavLink to="/dashboard" className={claseLink} onClick={onClose}>
            <LayoutDashboard size={20} /> Inicio
          </NavLink>

          {(isAdmin || isVendedor) && (
            <NavLink to="/dashboard/ventas" className={claseLink} onClick={onClose}> 
              <ShoppingCart size={20} /> Ventas
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/dashboard/usuarios" className={claseLink} onClick={onClose}>
              <Users size={20} /> Usuarios
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/dashboard/marcas" className={claseLink} onClick={onClose}>
              <Package size={20} /> Marcas {/* ✅ Cambié el ícono y verifiqué la ruta */}
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/dashboard/productos" className={claseLink} onClick={onClose}>
              <Package size={20} /> Productos {/* ✅ Cambié el ícono y verifiqué la ruta */}
            </NavLink>
          )}
        </nav>

        {/* Footer */}
        <div className="bg-blue-900 dark:bg-black/60 p-4 border-t border-blue-700 dark:border-gray-700">
          <div className="text-center">
            <p className="font-semibold truncate" title={nombreUsuario}>
              {nombreUsuario}
            </p>
            <p
              className="text-sm text-blue-200 dark:text-gray-400 mt-1 truncate"
              title={obtenerEtiquetaRol()}
            >
              {obtenerEtiquetaRol()}
            </p>

            {/* Botón de Dark/Light Mode */}
            <button
              onClick={toggleDarkMode}
              className={`mt-3 w-full p-2.5 rounded-lg border transition-all duration-500 shadow-sm cursor-pointer flex items-center justify-center gap-2
                ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-yellow-300 hover:bg-gray-600"
                    : "bg-gray-100 border-gray-400 text-yellow-500 hover:bg-gray-300"
                }`}
              aria-label="Cambiar tema"
            >
              {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
              <span className="text-sm font-medium">
                {darkMode ? "Modo claro" : "Modo oscuro"}
              </span>
            </button>

            {/* Cerrar sesión */}
            <button
              onClick={() => {
               setAccessToken(null); // 🔥 limpia el token del contexto y Axios
                navigate("/login", { replace: true });
               }}
              className="mt-3 w-full bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
