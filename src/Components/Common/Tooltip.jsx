/**
 * Tooltip reutilizable basado en el patrón Tailwind group/group-hover del proyecto.
 *
 * Props:
 *  - text      : string  → Texto del tooltip
 *  - position  : 'top' | 'top-end' | 'bottom' | 'bottom-end' | 'left' | 'right'  (default: 'top')
 *               Variantes '-end': alineadas al borde derecho del elemento (se extienden a la izquierda).
 *               Usar en elementos del lado derecho de la pantalla para evitar overflow horizontal.
 *  - inline    : bool    → Usa inline-block en vez de block (para botones con ícono)
 *  - className : string  → Clases extra para el contenedor (flex-1, min-w-..., etc.)
 */
export function Tooltip({ text, children, position = "top", inline = false, className = "" }) {
  const positions = {
    top:         "bottom-full left-1/2 -translate-x-1/2 mb-2",
    "top-end":   "bottom-full right-0 mb-2",
    bottom:      "top-full left-1/2 -translate-x-1/2 mt-2",
    "bottom-end":"top-full right-0 mt-2",
    left:        "right-full top-1/2 -translate-y-1/2 mr-2",
    right:       "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div className={`relative group ${inline ? "inline-block" : ""} ${className}`}>
      {children}
      <span
        className={`absolute ${positions[position]} opacity-0 group-hover:opacity-100
          bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md
          py-1.5 px-2.5 whitespace-nowrap transition-opacity duration-200
          pointer-events-none shadow-lg z-20`}
      >
        {text}
      </span>
    </div>
  );
}
