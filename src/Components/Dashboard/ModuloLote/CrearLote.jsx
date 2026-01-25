import { useState } from "react";
import { X, Package, DollarSign, Hash, AlertCircle, Loader2, CheckCircle, Search as SearchIcon } from "lucide-react";
import { crearLote } from "../../../Services/LoteServiceP/LoteService";
import { BuscarProductoModal } from "./BuscarProductoModal";
import Swal from "sweetalert2";

export function CrearLote({ isOpen, onClose, onSuccess, onActualizarPrecioProducto }) {
  const [formData, setFormData] = useState({
    precioCompraUnitario: "",
    cantidadInicial: "",
    productoId: "",
  });

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modalBuscarProducto, setModalBuscarProducto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState({});
  const [mensajeError, setMensajeError] = useState("");

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.precioCompraUnitario) {
      nuevosErrores.precioCompraUnitario = "El precio de compra es obligatorio";
    } else if (parseFloat(formData.precioCompraUnitario) <= 0) {
      nuevosErrores.precioCompraUnitario = "El precio de compra debe ser mayor a 0";
    }

    if (!formData.cantidadInicial) {
      nuevosErrores.cantidadInicial = "La cantidad inicial es obligatoria";
    } else if (parseFloat(formData.cantidadInicial) <= 0) {
      nuevosErrores.cantidadInicial = "La cantidad inicial debe ser mayor a 0";
    }

    if (!formData.productoId) {
      nuevosErrores.productoId = "El producto es obligatorio";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: "" }));
    setMensajeError("");
  };

  const handleSelectProducto = (producto) => {
    setProductoSeleccionado(producto);
    setFormData((prev) => ({ ...prev, productoId: producto.id.toString() }));
    if (errores.productoId) setErrores((prev) => ({ ...prev, productoId: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError("");

    if (!validarFormulario()) return;

    try {
      setLoading(true);

      const datosEnviar = {
        precioCompraUnitario: parseFloat(formData.precioCompraUnitario),
        cantidadInicial: parseFloat(formData.cantidadInicial),
        productoId: parseInt(formData.productoId),
      };

      await crearLote(datosEnviar);

      const productoInfo = {
        codigoBarras: productoSeleccionado?.codigoBarras,
        nombre: productoSeleccionado?.nombre,
        precioVentaActual: productoSeleccionado?.precioVenta,
      };

      onSuccess?.();
      handleClose();

      const result = await Swal.fire({
        icon: "success",
        title: "¡Lote creado exitosamente!",
        html: `
          <div class="text-left">
            <p class="mb-3">El lote se ha registrado correctamente en el inventario.</p>
            <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-3">
              <p class="text-sm"><strong>Producto:</strong> ${productoInfo.nombre}</p>
              <p class="text-sm"><strong>Código:</strong> ${productoInfo.codigoBarras}</p>
              <p class="text-sm"><strong>Precio de venta actual:</strong> $${productoInfo.precioVentaActual?.toFixed(2) || "0.00"}</p>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">¿Deseas actualizar el precio de venta de este producto?</p>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Sí, actualizar precio",
        cancelButtonText: "No, mantener precio",
        confirmButtonColor: "#2563eb",
        cancelButtonColor: "#6b7280",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        onActualizarPrecioProducto?.(productoInfo.codigoBarras);
      }
    } catch (err) {
      const mensajeBackend =
        err.message ||
        err.response?.data?.mensaje ||
        err.response?.data?.message ||
        err.response?.data?.error ||
        "";

      if (
        mensajeBackend.toLowerCase().includes("producto") &&
        mensajeBackend.toLowerCase().includes("no encontrado")
      ) {
        setMensajeError("El producto seleccionado no existe.");
      } else if (
        mensajeBackend.toLowerCase().includes("datos inválidos") ||
        mensajeBackend.toLowerCase().includes("verifica")
      ) {
        setMensajeError("Datos inválidos. Por favor, verifica los campos.");
      } else if (mensajeBackend) {
        setMensajeError(mensajeBackend);
      } else {
        setMensajeError("Error al crear el lote. Por favor, intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      precioCompraUnitario: "",
      cantidadInicial: "",
      productoId: "",
    });
    setProductoSeleccionado(null);
    setErrores({});
    setMensajeError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-none z-40 transition-opacity" onClick={handleClose} />

      <div className="fixed right-0 top-0 h-full w-full sm:w-[520px] bg-gray-50 dark:bg-slate-800 shadow-2xl z-50 overflow-y-auto transition-transform">
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 dark:bg-blue-700 rounded-xl flex items-center justify-center">
              <Package size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Crear lote</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Agrega un nuevo lote de producto al inventario
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-300 bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition cursor-pointer"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          {mensajeError && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded-md flex items-start gap-2">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span className="text-sm">{mensajeError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Producto */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
                <Package size={16} /> Producto <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Selecciona el producto al que pertenece este lote.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setModalBuscarProducto(true)}
                  className={`flex-1 px-4 py-3 rounded-xl border-2 text-left flex items-center justify-between transition ${
                    errores.productoId
                      ? "border-red-400"
                      : "border-gray-300 dark:border-slate-600 hover:border-blue-500"
                  } ${
                    productoSeleccionado
                      ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300"
                      : "bg-white dark:bg-slate-700/30"
                  } cursor-pointer`}
                >
                  <span
                    className={
                      productoSeleccionado
                        ? "text-gray-900 dark:text-white font-medium"
                        : "text-gray-400 dark:text-gray-500"
                    }
                  >
                    {productoSeleccionado
                      ? productoSeleccionado.nombre
                      : "Seleccionar producto..."}
                  </span>
                  <SearchIcon size={18} className="text-gray-400" />
                </button>
              </div>
              {productoSeleccionado && (
                <div className="mt-2 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">Código de barras</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {productoSeleccionado.codigoBarras || "Sin código"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">Precio de venta</p>
                     <p className="font-medium text-green-600 dark:text-green-400">
  ${productoSeleccionado.precioVenta
    ? new Intl.NumberFormat("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(productoSeleccionado.precioVenta)
    : "0"}
</p>

                    </div>
                  </div>
                </div>
              )}
              {errores.productoId && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {errores.productoId}
                </p>
              )}
            </div>

            {/* Precio de Compra Unitario */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
                <DollarSign size={16} /> Precio de Compra Unitario <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Precio al que compraste cada unidad del producto.
              </p>
              <input
                type="number"
                name="precioCompraUnitario"
                value={formData.precioCompraUnitario}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-700/30 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 transition ${
                  errores.precioCompraUnitario
                    ? "border-red-400 focus:border-red-400"
                    : "border-gray-300 dark:border-slate-600"
                }`}
              />
              {errores.precioCompraUnitario && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {errores.precioCompraUnitario}
                </p>
              )}
            </div>

            {/* Cantidad Inicial */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
                <Hash size={16} /> Cantidad Inicial <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Cantidad de unidades que ingresan con este lote.
              </p>
              <input
                type="number"
                name="cantidadInicial"
                value={formData.cantidadInicial}
                onChange={handleChange}
                placeholder="Ej: 100"
                min="0.01"
                step="0.01"
                className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-700/30 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 transition ${
                  errores.cantidadInicial
                    ? "border-red-400 focus:border-red-400"
                    : "border-gray-300 dark:border-slate-600"
                }`}
              />
              {errores.cantidadInicial && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {errores.cantidadInicial}
                </p>
              )}
            </div>

           {/* Resumen */}
{formData.precioCompraUnitario && formData.cantidadInicial && (
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-900/80">
    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
      Resumen del lote
    </p>
    <div className="space-y-1 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600 dark:text-gray-400">Precio unitario:</span>
        <span className="font-medium text-gray-900 dark:text-gray-100">
          ${new Intl.NumberFormat("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(formData.precioCompraUnitario)}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600 dark:text-gray-400">Cantidad:</span>
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {new Intl.NumberFormat("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(formData.cantidadInicial)}
        </span>
      </div>
      <div className="pt-2 mt-2 border-t border-blue-300 dark:border-blue-800 flex justify-between">
        <span className="font-semibold text-gray-700 dark:text-gray-200">
          Total inversión:
        </span>
        <span className="font-bold text-green-600 dark:text-green-400 text-lg">
          ${new Intl.NumberFormat("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(formData.precioCompraUnitario * formData.cantidadInicial)}
        </span>
      </div>
    </div>
  </div>
)}
            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Crear lote
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-gray-300 dark:bg-slate-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-400/70 dark:hover:bg-slate-600 transition disabled:opacity-50 cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de búsqueda de productos */}
      <BuscarProductoModal
        isOpen={modalBuscarProducto}
        onClose={() => setModalBuscarProducto(false)}
        onSelectProducto={handleSelectProducto}
        productoActual={productoSeleccionado}
      />
    </>
  );
}
