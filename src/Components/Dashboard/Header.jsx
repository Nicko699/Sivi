import { Menu } from "lucide-react";

export function DashboardHeader({ onMenuClick, title }) {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 bg-blue-800 dark:bg-gray-800 text-white shadow-md z-30 transition-colors duration-300">
      <div className="flex items-center justify-between p-4">
        {/* Botón de menú (solo visible en pantallas pequeñas) */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-blue-700 dark:hover:bg-gray-700 transition"
          aria-label="Abrir menú"
        >
          <Menu size={22} />
        </button>

        {/* Título del panel */}
        <h1 className="text-lg font-semibold truncate">{title}</h1>
      </div>
    </header>
  );
}
