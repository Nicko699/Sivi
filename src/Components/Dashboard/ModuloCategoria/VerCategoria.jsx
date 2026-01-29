import {
  X,
  Tag,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";

export function VerCategoria({ isOpen, onClose, categoria }) {
  if (!isOpen || !categoria) return null;

  return (
    <>
      {/* Fondo modal */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-none z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Contenedor del modal */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[520px] bg-gray-50 dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto transition-transform">

        {/* Header sin gradiente, igual a VerProducto */}
        <div className="sticky top-0 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center">
              <Tag size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                Detalle de categoria
              </h2>
              {/* ID debajo del título (como estaba antes) */}
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">
                ID: {categoria.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition cursor-pointer"
          >
            <X size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-8">

          {/* Nombre */}
          <div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 text-sm mb-2 font-medium">
              <Tag size={16} /> Nombre de categoria
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{categoria.nombre}</p>
          </div>

          {/* Descripción */}
          <div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 text-sm mb-2 font-medium">
              <FileText size={16} /> Descripción
            </div>
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed bg-gray-100 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-300 dark:border-slate-700">
              {categoria.descripcion || "Sin descripción disponible"}
            </p>
          </div>

          {/* Estado */}
          <div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 text-sm mb-3 font-medium">
              Estado actual
            </div>
            {categoria.activo ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-800/50 text-green-600 dark:text-green-400 rounded-lg font-semibold border border-gray-300 dark:border-slate-700">
                <CheckCircle size={18} /> Activo
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-800/50 text-red-600 dark:text-red-400 rounded-lg font-semibold border border-gray-300 dark:border-slate-700">
                <XCircle size={18} /> Inactivo
              </div>
            )}
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-300 dark:border-slate-700">
            <div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 text-xs mb-2 font-bold uppercase tracking-wider">
                <Calendar size={14} /> Fecha de creación
              </div>
              <Fecha fecha={categoria.fechaCreacion} />
            </div>

            <div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 text-xs mb-2 font-bold uppercase tracking-wider">
                <Calendar size={14} /> Última actualización
              </div>
              <Fecha fecha={categoria.fechaActualizacion} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-6 border-t border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white font-semibold rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            Cerrar detalle
          </button>
        </div>
      </div>
    </>
  );
}

function Fecha({ fecha }) {
  if (!fecha)
    return (
      <span className="text-gray-400 dark:text-gray-500 text-sm italic">
        No registrada
      </span>
    );

  const date = new Date(fecha);

  return (
    <div className="flex flex-col">
      <p className="text-gray-900 dark:text-gray-100 font-semibold text-sm">
        {date.toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">
        {date.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      </p>
    </div>
  );
}
