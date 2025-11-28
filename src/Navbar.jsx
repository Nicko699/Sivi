import { useState } from "react";
import { FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa"; 
import useDarkMode from "./DarkMode.jsx";
import { Link, useLocation } from "react-router-dom";

export function Navbar() {
  const location = useLocation(); 
  const isHome = location.pathname === "/"; 

  const [darkMode, toggleDarkMode] = useDarkMode();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-white shadow-md border-b border-green-400/20 transition-colors duration-500 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-xl sm:text-2xl">Empresa XYZ</span>
            <span className="text-xs sm:text-sm md:text-base opacity-80">
              Sistema de Ventas e Inventario
            </span>
          </div>

          {/* Escritorio */}
          <div className="hidden md:flex items-center space-x-4">
            {isHome ? (
              <Link
              to="/login"
              className="bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 px-4 py-2 min-w-[130px] text-center rounded-lg text-white font-semibold shadow text-sm sm:text-base"
              >
              Iniciar sesión
              </Link>

            ) : (
              <Link
            to="/"
            className="bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 px-4 py-2 min-w-[130px] text-center rounded-lg text-white font-semibold shadow text-sm sm:text-base"
            >
            Inicio
            </Link>

            )}

            <button
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-full border transition-all duration-500 shadow-sm cursor-pointer focus:outline-none transform active:-translate-y-1 active:shadow-md
                ${darkMode ? "bg-gray-800 border-gray-600 text-yellow-300 hover:bg-gray-700" : "bg-gray-200 border-gray-900 text-yellow-400 hover:bg-gray-300"}`}
              aria-label="Cambiar tema"
            >
              {darkMode ? <FaSun size={21} /> : <FaMoon size={21} />}
            </button>
          </div>

          {/* Móvil */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-full border transition-all duration-500 shadow-sm cursor-pointer focus:outline-none transform active:-translate-y-1 active:shadow-md
                ${darkMode ? "bg-gray-800 border-gray-600 text-yellow-300 hover:bg-gray-700" : "bg-gray-200 border-gray-900 text-yellow-400 hover:bg-gray-300"}`}
              aria-label="Cambiar tema"
            >
              {darkMode ? <FaSun size={21} /> : <FaMoon size={21} />}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2.5 rounded-md border border-white/20 text-white hover:bg-white/10 transition"
              aria-label="Abrir menú"
            >
              {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="md:hidden bg-blue-900 dark:bg-gray-900/90 shadow-lg border-t border-green-400/20 transition-all duration-300">
          <div className="px-4 py-4 flex flex-col space-y-3">
            {isHome ? (
              <Link to="/login" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white font-semibold text-base text-center" onClick={() => setMenuOpen(false)}>
                Iniciar sesión
              </Link>
            ) : (
              <Link to="/" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white font-semibold text-base text-center" onClick={() => setMenuOpen(false)}>
                Inicio
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
