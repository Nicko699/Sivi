import { X, BookOpen } from "lucide-react";

/**
 * Panel lateral de ayuda reutilizable.
 *
 * Props:
 *  - isOpen   : bool
 *  - onClose  : () => void
 *  - title    : string          → Título del panel (ej. "Guía rápida - Productos")
 *  - sections : Array<{
 *      icon?       : string     → Emoji o texto (ej. "📦")
 *      title       : string
 *      description : string
 *      image?      : string     → URL de imagen opcional
 *    }>
 */
export function HelpPanel({ isOpen, onClose, title, sections = [] }) {
  return (
    <>
      {/* Overlay oscuro */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[400px] max-w-[95vw]
          bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between px-5 py-4 bg-blue-600 text-white flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <BookOpen size={20} />
            <h3 className="font-semibold text-base leading-tight">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            aria-label="Cerrar ayuda"
          >
            <X size={18} />
          </button>
        </div>

        {/* Contenido desplazable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4
                border border-gray-100 dark:border-gray-700"
            >
              {/* Título de la sección */}
              <div className="flex items-start gap-3 mb-1.5">
                {section.icon && (
                  <span className="text-xl flex-shrink-0 leading-snug">{section.icon}</span>
                )}
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm leading-snug">
                  {section.title}
                </h4>
              </div>

              {/* Descripción */}
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed pl-8">
                {section.description}
              </p>

              {/* Imagen opcional */}
              {section.image && (
                <img
                  src={section.image}
                  alt={section.title}
                  className="mt-3 rounded-lg w-full border border-gray-200 dark:border-gray-600 object-contain"
                />
              )}
            </div>
          ))}
        </div>

        {/* Pie del panel */}
        <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            ¿Necesitas más ayuda? Contacta al administrador del sistema.
          </p>
        </div>
      </div>
    </>
  );
}
