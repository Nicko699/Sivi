import { useState } from "react";
import { X, Tag, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { crearCategoria } from "../../../Services/CategoriaServiceP/CategoriaService";
import Swal from "sweetalert2";

export function CrearCategoria({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });

  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState({});
  const [mensajeError, setMensajeError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError("");
    
    if (!validarFormulario()) return;

    try {
      setLoading(true);

      const datosEnviar = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || undefined,
      };

      await crearCategoria(datosEnviar);

      onSuccess?.();
      
      Swal.fire({
        icon: "success",
        title: "¡Categoria creada!",
        text: "La categoria se ha creado correctamente",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#2563eb",
        timer: 3000,
        timerProgressBar: true,
      });

      // Limpiar formulario
      setFormData({ nombre: "", descripcion: "" });
      setErrores({});
      onClose();
    } catch (err) {
      const mensajeBackend = err.response?.data?.mensaje || err.response?.data?.message || "Error inesperado";   
  
  if (err.response?.status === 400) {
    setMensajeError(mensajeBackend); // Aquí aparecerá "El nombre de la categoría ya existe"
  } else {
    setMensajeError("Error al conectar con el servidor.");
  }
  } finally {
    setLoading(false);
} 
  };

  const handleClose = () => {
    setFormData({ nombre: "", descripcion: "" });
    setErrores({});
    setMensajeError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-none z-40 transition-opacity"
        onClick={handleClose}
      />

      <div className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-gray-50 dark:bg-slate-800 shadow-2xl z-50 overflow-y-auto transition-transform">
        <div className="sticky top-0 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 dark:bg-blue-700 rounded-xl flex items-center justify-center">
              <Tag size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Crear categoria
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Agrega una nueva categoria al sistema
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
                className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-700/30 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 transition ${
                  errores.nombre
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-300 dark:border-slate-600"
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
                placeholder="Descripción de la categoria..."
                maxLength={250}
                rows={5}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700/30 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 transition resize-none"
              />
              <div className="flex justify-end">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formData.descripcion.length}/250 caracteres
                </span>
              </div>
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
                    Creando...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Crear categoria
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