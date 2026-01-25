import { X, Package, FileText, Calendar, CheckCircle, XCircle, DollarSign, AlertTriangle, Tag, Layers, Barcode, ShoppingCart } from "lucide-react";

export function VerProducto({ isOpen, onClose, producto }) {
  if (!isOpen || !producto) return null;

  const stockTotal = producto.stockTotal || 0;
  const bajoStock = stockTotal < producto.stockMinimoAlerta;
  const sinStock = stockTotal === 0;

  return (
    <>
      {/* Fondo modal */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-none z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Contenido del modal */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[520px] bg-gray-50 dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto transition-transform">

        {/* Header */}
        <div className="sticky top-0 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center">
              <Package size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                Detalle de producto
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {producto.nombre || "Sin nombre"}
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
        <div className="p-6 space-y-6">

          {/* Código de Barras */}
          {producto.codigoBarras && (
            <div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 text-sm mb-2 font-medium">
                <Barcode size={16} /> Código de Barras
              </div>
              <p className="text-lg font-mono font-semibold text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-slate-800/50 px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700">
                {producto.codigoBarras}
              </p>
            </div>
          )}

          {/* Nombre */}
          <div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 text-sm mb-2 font-medium">
              <Package size={16} /> Nombre del producto
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{producto.nombre}</p>
          </div>

          {/* Descripción */}
          <div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 text-sm mb-2 font-medium">
              <FileText size={16} /> Descripción
            </div>
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed bg-gray-100 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-300 dark:border-slate-700">
              {producto.descripcion || "Sin descripción disponible"}
            </p>
          </div>

          {/* Información de inventario */}
          <div className="bg-gray-100 dark:bg-slate-800/50 p-5 rounded-xl border border-gray-300 dark:border-slate-700">
            <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-semibold mb-4">
              <ShoppingCart size={18} />
              <span>Información de Inventario</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Stock actual */}
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">Stock Actual</p>
                <p className={`text-2xl font-bold ${
                  sinStock ? 'text-red-600 dark:text-red-400' : 
                  bajoStock ? 'text-orange-600 dark:text-orange-400' : 
                  'text-gray-700 dark:text-gray-200'
                }`}>
                  {new Intl.NumberFormat('es-ES').format(stockTotal)}
                  <span className="text-sm ml-1">
                    {producto.tipoVenta === "UNIDAD" ? "u" : "kg"}
                  </span>
                </p>
              </div>

              {/* Stock mínimo */}
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">Stock Mínimo</p>
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">
                  {new Intl.NumberFormat('es-ES').format(producto.stockMinimoAlerta)}
                  <span className="text-sm ml-1">
                    {producto.tipoVenta === "UNIDAD" ? "u" : "kg"}
                  </span>
                </p>
              </div>

              {/* Precio de Venta */}
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">Precio de Venta</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${new Intl.NumberFormat('es-ES', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                    useGrouping: true,
                  }).format(producto.precioVenta)}
                </p>
              </div>

              {/* Tipo de venta */}
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">Tipo de Venta</p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 rounded-lg font-medium border border-gray-300 dark:border-slate-700 text-sm">
                  <Tag size={14} />
                  {producto.tipoVenta === "UNIDAD" ? "Por Unidad" : "Por Peso (Kg)"}
                </div>
              </div>
            </div>
          </div>

          {/* Categoría y Marca */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 text-sm mb-2 font-medium">
                <Layers size={16} /> Categoría
              </div>
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-slate-800/50 px-3 py-2.5 rounded-lg border border-gray-300 dark:border-slate-700">
                {producto.categoria?.nombre || "Sin categoría"}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 text-sm mb-2 font-medium">
                <Tag size={16} /> Marca
              </div>
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-slate-800/50 px-3 py-2.5 rounded-lg border border-gray-300 dark:border-slate-700">
                {producto.marca?.nombre || "Sin marca"}
              </p>
            </div>
          </div>

          {/* Estado */}
          <div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 text-sm mb-3 font-medium">
              Estado actual
            </div>
            {producto.activo ? (
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
              <Fecha fecha={producto.fechaCreacion} />
            </div>

            <div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 text-xs mb-2 font-bold uppercase tracking-wider">
                <Calendar size={14} /> Última actualización
              </div>
              <Fecha fecha={producto.fechaActualizacion} />
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
        {date.toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "numeric" })}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">
        {date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: true })}
      </p>
    </div>
  );
}
