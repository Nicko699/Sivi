import {
  X,
  Package,
  Calendar,
  DollarSign,
  AlertTriangle,
  Layers,
  Barcode,
  TrendingDown,
  ShoppingCart,
  CheckCircle,
  XCircle,
  TrendingUp,
  Tag,
} from "lucide-react";

export function VerLote({ isOpen, onClose, lote }) {
  if (!isOpen || !lote) return null;

  const calcularPorcentajeStock = () => {
    if (!lote.cantidadInicial || lote.cantidadInicial === 0) return 0;
    return ((lote.cantidadActual / lote.cantidadInicial) * 100).toFixed(1);
  };

  const porcentajeStock = calcularPorcentajeStock();
  const stockBajo = porcentajeStock < 30 && porcentajeStock > 0;

  const formatoMoneda = (valor) =>
    valor != null
      ? new Intl.NumberFormat("es-CO", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(valor)
      : "0";

  const formatoCantidad = (valor) =>
    valor != null
      ? new Intl.NumberFormat("es-CO", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(valor)
      : "0";

  const totalInicial = lote.precioCompraUnitario * lote.cantidadInicial;
  const totalRestante = lote.precioCompraUnitario * lote.cantidadActual;
  const gananciaUnitaria =
    (lote.producto?.precioVenta || 0) - lote.precioCompraUnitario;
  const porcentajeGanancia =
    lote.precioCompraUnitario > 0
      ? ((gananciaUnitaria / lote.precioCompraUnitario) * 100).toFixed(1)
      : 0;
  const gananciaPotencial = gananciaUnitaria * lote.cantidadActual;

  return (
    <>
      {/* Fondo borroso */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-none z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Panel lateral */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[520px] bg-gray-50 dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto">
        {/* Encabezado */}
        <div className="sticky top-0 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center">
              <Layers size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                Detalle de lote
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {lote.producto?.nombre || "Producto"}
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

        {/* Contenido principal */}
        <div className="p-6 space-y-6">
          {/* Alerta de stock agotado */}
          {lote.agotado && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg">
              <div className="flex items-start gap-3">
                <XCircle
                  size={20}
                  className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-semibold text-red-800 dark:text-red-300">
                    Lote agotado
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    Este lote ya no tiene unidades disponibles
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Alerta de stock bajo */}
          {stockBajo && !lote.agotado && (
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle
                  size={20}
                  className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-semibold text-orange-800 dark:text-orange-300">
                    Stock bajo
                  </p>
                  <p className="text-sm text-orange-700 dark:text-orange-400">
                    El lote tiene solo {porcentajeStock}% de stock disponible
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Código del Lote + Estado */}
          <div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 text-sm mb-2 font-medium">
              <Barcode size={16} /> Código del Lote
            </div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-lg font-mono font-semibold text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-slate-800/50 px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 flex-1">
                {lote.codigoLote}
              </p>
              {lote.agotado ? (
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-slate-800/50 text-red-700 dark:text-red-400 rounded-lg font-semibold border border-gray-300 dark:border-slate-700 text-sm">
                  <XCircle size={16} /> Agotado
                </div>
              ) : stockBajo ? (
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-slate-800/50 text-orange-700 dark:text-orange-400 rounded-lg font-semibold border border-gray-300 dark:border-slate-700 text-sm">
                  <AlertTriangle size={16} /> Bajo
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-slate-800/50 text-green-700 dark:text-green-400 rounded-lg font-semibold border border-gray-300 dark:border-slate-700 text-sm">
                  <CheckCircle size={16} /> Disponible
                </div>
              )}
            </div>
          </div>

          {/* Control de Stock */}
          <div className="bg-gray-100 dark:bg-slate-800/50 p-5 rounded-xl border border-gray-300 dark:border-slate-700">
            <div className="flex items-center gap-2 text-gray-800 dark:text-gray-100 font-semibold mb-4">
              <TrendingDown size={18} />
              <span>Control de Stock</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Cantidad Inicial */}
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Cantidad Inicial
                </p>
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">
                  {formatoCantidad(lote.cantidadInicial)}
                  <span className="text-sm ml-1">
                    {lote.producto?.tipoVenta === "PESO" ? "kg" : "u"}
                  </span>
                </p>
              </div>

              {/* Cantidad Actual */}
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Cantidad Actual
                </p>
                <p
                  className={`text-2xl font-bold ${
                    lote.agotado
                      ? "text-red-600 dark:text-red-400"
                      : stockBajo
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-green-600 dark:text-green-400"
                  }`}
                >
                  {formatoCantidad(lote.cantidadActual)}
                  <span className="text-sm ml-1">
                    {lote.producto?.tipoVenta === "PESO" ? "kg" : "u"}
                  </span>
                </p>
              </div>

              {/* Unidades Vendidas */}
              <div className="col-span-2 pt-3 border-t border-gray-300 dark:border-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Unidades Vendidas
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {formatoCantidad(lote.cantidadInicial - lote.cantidadActual)}
                  </span>
                </div>
              </div>
            </div>

            {/* Barra de progreso */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  Disponibilidad
                </span>
                <span
                  className={`text-xs font-bold ${
                    lote.agotado
                      ? "text-red-600 dark:text-red-400"
                      : stockBajo
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-green-700 dark:text-green-400"
                  }`}
                >
                  {porcentajeStock}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all ${
                    lote.agotado
                      ? "bg-red-500"
                      : stockBajo
                      ? "bg-orange-500"
                      : "bg-green-600"
                  }`}
                  style={{ width: `${porcentajeStock}%` }}
                />
              </div>
            </div>
          </div>

          {/* Producto asociado */}
          {lote.producto && (
            <div className="bg-gray-100 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-300 dark:border-slate-700">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm mb-3 font-semibold">
                <Package size={16} /> Producto Asociado
              </div>

              <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
                {lote.producto.nombre}
              </p>

              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Categoría
                  </p>
                  <p className="font-semibold text-gray-700 dark:text-gray-200">
                    {lote.producto.categoria?.nombre || "Sin categoría"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Marca
                  </p>
                  <p className="font-semibold text-gray-700 dark:text-gray-200">
                    {lote.producto.marca?.nombre || "Sin marca"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Tipo
                  </p>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-slate-700/50 text-gray-700 dark:text-gray-100 rounded-md text-xs font-semibold border border-gray-200 dark:border-slate-600">
                    {lote.producto.tipoVenta === "UNIDAD" ? "Unidad" : "Kg"}
                  </span>
                </div>
              </div>
            </div>
          )}

         {/* Información Económica */}
<div className="p-5 rounded-xl border border-green-200 dark:border-slate-700 bg-green-50 dark:bg-slate-800/50 dark:backdrop-blur-sm">
  <div className="flex items-center gap-2 text-gray-800 dark:text-gray-100 font-semibold mb-4">
    <DollarSign size={18} />
    <span>Información Económica</span>
  </div>

  <div className="space-y-3">
    {/* Precios unitarios */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
          Precio de Compra
        </p>
        <p className="text-xl font-bold text-gray-700 dark:text-gray-200">
          ${formatoMoneda(lote.precioCompraUnitario)}
        </p>
      </div>

      {lote.producto?.precioVenta && (
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            Precio de Venta
          </p>
          <p className="text-xl font-bold text-gray-600 dark:text-gray-200">
            ${formatoMoneda(lote.producto.precioVenta)}
          </p>
        </div>
      )}
    </div>

    {/* Ganancia unitaria */}
    {lote.producto?.precioVenta && (
      <div className="pt-3 border-t border-gray-300 dark:border-slate-700">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Ganancia unitaria
          </span>
          <div className="text-right">
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              ${formatoMoneda(gananciaUnitaria)}
            </span>
            <span className="text-sm text-gray-900 dark:text-gray-100 ml-2">
              ({porcentajeGanancia}%)
            </span>
          </div>
        </div>
      </div>
    )}

    {/* Resumen de inversión */}
    <div className="pt-3 border-t border-gray-300 dark:border-slate-700 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Inversión inicial
        </span>
        <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
          ${formatoMoneda(totalInicial)}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Valor en inventario
        </span>
        <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
          ${formatoMoneda(totalRestante)}
        </span>
      </div>
      {lote.producto?.precioVenta && (
        <div className="flex justify-between items-center pt-2 border-t border-gray-300 dark:border-slate-700">
          <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <TrendingUp size={14} />
            Ganancia potencial
          </span>
          <span className="text-lg font-bold text-green-600 dark:text-green-400">
            ${formatoMoneda(gananciaPotencial)}
          </span>
        </div>
      )}
    </div>
  </div>
</div>


          {/* Fecha de Compra */}
          <div className="pt-6 border-t border-gray-300 dark:border-slate-700">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 text-xs mb-2 font-bold uppercase tracking-wider">
              <Calendar size={14} /> Fecha de Compra
            </div>
            <Fecha fecha={lote.fechaCompra} />
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
