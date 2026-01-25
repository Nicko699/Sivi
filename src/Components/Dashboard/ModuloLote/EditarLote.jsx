import { useState, useEffect } from "react";
import { X, Package, DollarSign, Hash, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import { editarLote } from "../../../Services/LoteServiceP/LoteService";
import Swal from "sweetalert2";

export function EditarLote({ isOpen, onClose, lote, onSuccess }) {
  const [formData, setFormData] = useState({
    precioCompraUnitario: "",
    cantidadInicial: "",
  });

  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState({});
  const [mensajeError, setMensajeError] = useState("");

  useEffect(() => {
    if (isOpen && lote) {
      setFormData({
        precioCompraUnitario: lote.precioCompraUnitario || "",
        cantidadInicial: lote.cantidadInicial || "",
      });
      setErrores({});
      setMensajeError("");
    }
  }, [isOpen, lote]);

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

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: "" }));
    setMensajeError("");
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
      };

      await editarLote(lote.id, datosEnviar);

      onSuccess?.();

      Swal.fire({
        icon: "success",
        title: "¡Lote actualizado!",
        text: "Los cambios se han guardado correctamente",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#2563eb",
        timer: 3000,
        timerProgressBar: true,
      });

      handleClose();
    } catch (err) {
      const mensajeBackend =
        err.message ||
        err.response?.data?.mensaje ||
        err.response?.data?.message ||
        err.response?.data?.error ||
        "";

      if (
        mensajeBackend.toLowerCase().includes("lote") &&
        mensajeBackend.toLowerCase().includes("no encontrado")
      ) {
        setMensajeError("El lote no existe o fue eliminado.");
      } else if (
        mensajeBackend.toLowerCase().includes("datos inválidos") ||
        mensajeBackend.toLowerCase().includes("verifica")
      ) {
        setMensajeError("Datos inválidos. Por favor, verifica los campos.");
      } else if (mensajeBackend) {
        setMensajeError(mensajeBackend);
      } else {
        setMensajeError("Error al actualizar el lote. Por favor, intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrores({});
    setMensajeError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Fondo borroso */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-none z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Panel lateral */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[520px] bg-gray-50 dark:bg-slate-800 shadow-2xl z-50 overflow-y-auto">
        {/* Encabezado */}
        <div className="sticky top-0 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 dark:bg-blue-700 rounded-xl flex items-center justify-center">
              <Package size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Editar lote
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {lote?.producto?.nombre || "Lote"} - #{lote?.id}
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

        {/* Contenido */}
        <div className="p-6">
          {mensajeError && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded-md flex items-start gap-2">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span className="text-sm">{mensajeError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

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
                className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-700/30 
                text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 
                focus:outline-none focus:border-blue-500 transition ${
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
                Cantidad total que ingresó con este lote.
              </p>
              <input
                type="number"
                name="cantidadInicial"
                value={formData.cantidadInicial}
                onChange={handleChange}
                placeholder="Ej: 100"
                min="0.01"
                step="0.01"
                className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-700/30 
                text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 
                focus:outline-none focus:border-blue-500 transition ${
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

           {/* Resumen actualizado */}
{formData.precioCompraUnitario && formData.cantidadInicial && (
  <div className="p-4 bg-blue-50 dark:bg-gray-800/50 rounded-xl border border-blue-200 dark:border-gray-700">
    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
      Resumen actualizado
    </p>
    <div className="flex justify-between">
      <span className="text-gray-600 dark:text-gray-400">Precio unitario:</span>
      <span className="font-medium text-gray-900 dark:text-gray-100">
        {new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(formData.precioCompraUnitario)}
      </span>
    </div>
    <div className="flex justify-between">
      <span className="text-gray-600 dark:text-gray-400">Cantidad:</span>
      <span className="font-medium text-gray-900 dark:text-gray-100">
        {new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(formData.cantidadInicial)}
      </span>
    </div>
    <div className="pt-2 mt-2 border-t border-blue-300 dark:border-gray-600 flex justify-between">
      <span className="font-semibold text-gray-700 dark:text-gray-200">
        Total inversión:
      </span>
      <span className="font-bold text-green-600 dark:text-green-400 text-lg">
        {new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(
          formData.precioCompraUnitario * formData.cantidadInicial
        )}
      </span>
    </div>
  </div>
)}


            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold 
                hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed 
                flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Guardar cambios
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-gray-300 dark:bg-slate-700 text-gray-700 
                dark:text-gray-200 font-semibold hover:bg-gray-400/70 dark:hover:bg-slate-600 
                transition disabled:opacity-50 cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
