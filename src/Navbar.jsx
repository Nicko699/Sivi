import { useState } from "react";
import { Sun, Moon, Menu, X } from "lucide-react"; // íconos para modo oscuro y menú hamburguesa
import useDarkMode from "./DarkMode.jsx"; // hook personalizado para el modo oscuro
import { Link, useLocation } from "react-router-dom"; // navegación interna

export function Navbar() {
  const location = useLocation(); 
  const isHome = location.pathname === "/"; // Detecta si estamos en la página de inicio

  // Estado del modo oscuro y toggle
  const [darkMode, toggleDarkMode] = useDarkMode();

  // Estado del menú móvil (abierto/cerrado)
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 w-full z-50 
      bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950
      dark:from-gray-950 dark:via-gray-800 dark:to-gray-900
      text-white shadow-md border-b border-green-400/20
      transition-colors duration-500 backdrop-blur"
    >
      {/* Contenedor centralizado */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Nombre de la empresa */}
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-xl sm:text-2xl">Empresa XYZ</span>
            <span className="text-xs sm:text-sm md:text-base opacity-80">
              Sistema de Ventas e Inventario
            </span>
          </div>

          {/* Botones de escritorio */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Botón dinámico */}
            {isHome ? (
              <Link
                to="/login"
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white font-semibold shadow text-sm sm:text-base"
              >
                Iniciar sesión
              </Link>
            ) : (
              <Link
                to="/"
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white font-semibold shadow text-sm sm:text-base"
              >
                Inicio
              </Link>
            )}

            {/* Botón modo oscuro */}
            <button
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-full border transition-all duration-500 shadow-sm cursor-pointer 
                focus:outline-none transform active:-translate-y-1 active:shadow-md
                ${darkMode 
                  ? "bg-gray-800 border-gray-600 text-yellow-300 hover:bg-gray-700" 
                  : "bg-gray-200 border-gray-900 text-yellow-400 hover:bg-gray-300"
                }`}
              aria-label="Cambiar tema"
            >
              {darkMode ? <Sun size={21} /> : <Moon size={21} />}
            </button>
          </div>

          {/* Botones móviles*/}
          <div className="md:hidden flex items-center space-x-2">
            {/* Modo oscuro móvil */}
            <button
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-full border transition-all duration-500 shadow-sm cursor-pointer 
                focus:outline-none transform active:-translate-y-1 active:shadow-md
                ${darkMode 
                  ? "bg-gray-800 border-gray-600 text-yellow-300 hover:bg-gray-700" 
                  : "bg-gray-200 border-gray-900 text-yellow-400 hover:bg-gray-300"
                }`}
              aria-label="Cambiar tema"
            >
              {darkMode ? <Sun size={21} /> : <Moon size={21} />}
            </button>

            {/* Botón hamburguesa */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2.5 rounded-md border border-white/20 text-white hover:bg-white/10 transition"
              aria-label="Abrir menú"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {menuOpen && (
        <div className="md:hidden bg-blue-900 dark:bg-gray-900/90 shadow-lg border-t border-green-400/20 transition-all duration-300">
          <div className="px-4 py-4 flex flex-col space-y-3">
            
            {/* Botón dinámico dentro del menú */}
            {isHome ? (
              <Link
                to="/login"
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white font-semibold text-base text-center"
                onClick={() => setMenuOpen(false)} // Cierra menú al hacer clic
              >
                Iniciar sesión
              </Link>
            ) : (
              <Link
                to="/"
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white font-semibold text-base text-center"
                onClick={() => setMenuOpen(false)}
              >
                Inicio
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
