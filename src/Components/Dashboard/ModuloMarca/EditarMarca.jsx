import { useState, useEffect } from "react";
import { X, Tag, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { editarMarca } from "../../../Services/MarcaServiceP/MarcaService";
import Swal from "sweetalert2";

export function EditarMarca({ isOpen, onClose, marca, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    activo: true,
  });

  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState({});
  const [mensajeError, setMensajeError] = useState("");

  // Cargar datos de la marca cuando se abre el modal
  useEffect(() => {
    if (isOpen && marca) {
      setFormData({
        nombre: marca.nombre || "",
        descripcion: marca.descripcion || "",
        activo: marca.activo ?? true,
      });
      setErrores({});
      setMensajeError("");
    }
  }, [isOpen, marca]);

  const validarFormulario = () => {
    const nuevosErrores = {};
    
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    } else if (formData.nombre.trim().length < 2) {
      nuevosErrores.nombre = "El nombre debe tener al menos 2 caracteres";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: "" }));
    setMensajeError("");
  };

  const handleActivoChange = (valor) => {
    setFormData(prev => ({ ...prev, activo: valor }));
    setMensajeError("");
    if (errores.activo) setErrores(prev => ({ ...prev, activo: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError("");
    
    if (!validarFormulario()) return;

    try {
      setLoading(true);

      const datosEnviar = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || undefined,
        activo: formData.activo,
      };

      await editarMarca(marca.id, datosEnviar);

      onSuccess?.();
      
      Swal.fire({
        icon: "success",
        title: "¡Marca actualizada!",
        text: "Los cambios se han guardado correctamente",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#2563eb",
        timer: 3000,
        timerProgressBar: true,
      });

      onClose();
    } catch (err) {
      const mensajeBackend = err.message || err.response?.data?.message || err.response?.data?.error || "";
      
      if (mensajeBackend.toLowerCase().includes("ya existe") || 
          mensajeBackend.toLowerCase().includes("duplicado")) {
        setMensajeError("Ya existe una marca con este nombre. Por favor, elige otro nombre.");
      } else if (mensajeBackend) {
        setMensajeError(mensajeBackend);
      } else {
        setMensajeError("Error al editar la marca. Por favor, intenta nuevamente.");
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
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={handleClose}
      />

      <div className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white dark:bg-slate-800 shadow-2xl z-50 overflow-y-auto transition-transform">
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 dark:bg-blue-700 rounded-xl flex items-center justify-center">
              <Tag size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Editar marca
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {marca?.nombre}
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

          <div className="space-y-5">
            {/* Nombre */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
                <Tag size={16} /> Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Samsung, Apple, LG..."
                className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-700/30 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 ${
                  errores.nombre
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-300 dark:border-slate-600 focus:ring-blue-400"
                } transition`}
              />
              {errores.nombre && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {errores.nombre}
                </p>
              )}
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
                <FileText size={16} /> Descripción
                <span className="text-gray-400 text-sm font-normal">(opcional)</span>
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Descripción breve de la marca..."
                maxLength={50}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700/30 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
              />
              <div className="flex justify-end">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formData.descripcion.length}/50 caracteres
                </span>
              </div>
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
                Estado
              </label>
              <div className="flex gap-3">
                <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border rounded-xl transition cursor-pointer ${
                  formData.activo
                    ? "border-green-500 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-300"
                    : "border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/30 text-gray-600 dark:text-gray-400"
                }`}>
                  <input
                    type="radio"
                    name="activo"
                    checked={formData.activo === true}
                    onChange={() => handleActivoChange(true)}
                    className="w-4 h-4 accent-green-500"
                  />
                  Activo
                </label>
                <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border rounded-xl transition cursor-pointer ${
                  !formData.activo
                    ? "border-red-500 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300"
                    : "border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/30 text-gray-600 dark:text-gray-400"
                }`}>
                  <input
                    type="radio"
                    name="activo"
                    checked={formData.activo === false}
                    onChange={() => handleActivoChange(false)}
                    className="w-4 h-4 accent-red-500"
                  />
                  Inactivo
                </label>
              </div>
              {errores.activo && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {errores.activo}
                </p>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
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
                onClick={handleClose}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-gray-300 dark:bg-slate-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-400/70 dark:hover:bg-slate-600 transition disabled:opacity-50 cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}