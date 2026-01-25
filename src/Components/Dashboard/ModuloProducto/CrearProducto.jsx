import { useState } from "react";
import { X, Package, FileText, DollarSign, TrendingDown, Tag, AlertCircle, Loader2, CheckCircle, Barcode, Search as SearchIcon } from "lucide-react";
import { crearProducto } from "../../../Services/ProductoServiceP/ProductoService";
import { BuscarMarcaModal } from "./BuscarMarcaModal";
import { BuscarCategoriaModal } from "./BuscarCategoriaModal";
import Swal from "sweetalert2";

export function CrearProducto({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    codigoBarras: "",
    nombre: "",
    descripcion: "",
    precioVenta: "",
    stockMinimoAlerta: "",
    tipoVenta: "UNIDAD",
    categoriaId: "",
    marcaId: "",
  });

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState(null);
  const [modalBuscarCategoria, setModalBuscarCategoria] = useState(false);
  const [modalBuscarMarca, setModalBuscarMarca] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState({});
  const [mensajeError, setMensajeError] = useState("");

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    } else if (formData.nombre.trim().length < 2) {
      nuevosErrores.nombre = "El nombre debe tener al menos 2 caracteres";
    } else if (formData.nombre.trim().length > 30) {
      nuevosErrores.nombre = "El nombre no puede superar los 30 caracteres";
    }

    if (formData.codigoBarras && formData.codigoBarras.length > 50) {
      nuevosErrores.codigoBarras =
        "El código de barras no puede superar los 50 caracteres";
    }

    if (formData.descripcion && formData.descripcion.length > 250) {
      nuevosErrores.descripcion =
        "La descripción no puede superar los 250 caracteres";
    }

    if (!formData.precioVenta) {
      nuevosErrores.precioVenta = "El precio de venta es obligatorio";
    } else if (parseFloat(formData.precioVenta) < 0.1) {
      nuevosErrores.precioVenta = "El precio de venta debe ser mayor a 0.1";
    }

    if (!formData.stockMinimoAlerta && formData.stockMinimoAlerta !== "0") {
      nuevosErrores.stockMinimoAlerta = "El stock mínimo es obligatorio";
    } else if (parseFloat(formData.stockMinimoAlerta) < 0) {
      nuevosErrores.stockMinimoAlerta =
        "El stock mínimo no puede ser negativo";
    }

    if (!formData.tipoVenta) {
      nuevosErrores.tipoVenta = "El tipo de venta es obligatorio";
    }

    if (!formData.categoriaId) {
      nuevosErrores.categoriaId = "La categoría es obligatoria";
    }

    if (!formData.marcaId) {
      nuevosErrores.marcaId = "La marca es obligatoria";
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

  const handleSelectMarca = (marca) => {
    setMarcaSeleccionada(marca);
    setFormData((prev) => ({ ...prev, marcaId: marca.id.toString() }));
    if (errores.marcaId) setErrores((prev) => ({ ...prev, marcaId: "" }));
  };

  const handleSelectCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setFormData((prev) => ({ ...prev, categoriaId: categoria.id.toString() }));
    if (errores.categoriaId) setErrores((prev) => ({ ...prev, categoriaId: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError("");

    if (!validarFormulario()) return;

    try {
      setLoading(true);

      const datosEnviar = {
        nombre: formData.nombre.trim(),
        precioVenta: parseFloat(formData.precioVenta),
        stockMinimoAlerta: parseFloat(formData.stockMinimoAlerta),
        tipoVenta: formData.tipoVenta,
        categoriaId: parseInt(formData.categoriaId),
        marcaId: parseInt(formData.marcaId),
      };

      if (formData.codigoBarras.trim()) {
        datosEnviar.codigoBarras = formData.codigoBarras.trim();
      }
      if (formData.descripcion.trim()) {
        datosEnviar.descripcion = formData.descripcion.trim();
      }

      await crearProducto(datosEnviar);

      onSuccess?.();

      Swal.fire({
        icon: "success",
        title: "¡Producto creado!",
        text: "El producto se ha creado correctamente",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#2563eb",
        timer: 3000,
        timerProgressBar: true,
      });

      handleClose();
    } catch (err) {
      const mensajeBackend =
        err.message ||
        err.response?.data?.message ||
        err.response?.data?.error ||
        "";

      if (
        mensajeBackend.toLowerCase().includes("ya existe") ||
        mensajeBackend.toLowerCase().includes("duplicado")
      ) {
        setMensajeError(
          "Ya existe un producto con este nombre o código de barras. Por favor, verifica los datos."
        );
      } else if (
        mensajeBackend.toLowerCase().includes("categoría") &&
        mensajeBackend.toLowerCase().includes("no encontrada")
      ) {
        setMensajeError("La categoría seleccionada no existe.");
      } else if (
        mensajeBackend.toLowerCase().includes("marca") &&
        mensajeBackend.toLowerCase().includes("no encontrada")
      ) {
        setMensajeError("La marca seleccionada no existe.");
      } else if (mensajeBackend) {
        setMensajeError(mensajeBackend);
      } else {
        setMensajeError(
          "Error al crear el producto. Por favor, intenta nuevamente."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      codigoBarras: "",
      nombre: "",
      descripcion: "",
      precioVenta: "",
      stockMinimoAlerta: "",
      tipoVenta: "UNIDAD",
      categoriaId: "",
      marcaId: "",
    });
    setCategoriaSeleccionada(null);
    setMarcaSeleccionada(null);
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

      <div className="fixed right-0 top-0 h-full w-full sm:w-[520px] bg-gray-50 dark:bg-slate-800 shadow-2xl z-50 overflow-y-auto transition-transform">
        <div className="sticky top-0 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 dark:bg-blue-700 rounded-xl flex items-center justify-center">
              <Package size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Crear producto
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Agrega un nuevo producto al inventario
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
            
            {/* Código de Barras */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
                <Barcode size={16} /> Código de Barras
                <span className="text-gray-400 text-sm font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                name="codigoBarras"
                value={formData.codigoBarras}
                onChange={handleChange}
                placeholder="Ej: 7501234567890"
                maxLength={50}
                className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-700/30 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 transition ${
                  errores.codigoBarras
                    ? "border-red-400 focus:border-red-400"
                    : "border-gray-300 dark:border-slate-600"
                }`}
              />
              {errores.codigoBarras && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {errores.codigoBarras}
                </p>
              )}
            </div>

            {/* Nombre */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
                <Package size={16} /> Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Leche entera 1L"
                maxLength={30}
                className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-700/30 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 transition ${
                  errores.nombre
                    ? "border-red-400 focus:border-red-400"
                    : "border-gray-300 dark:border-slate-600"
                }`}
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
                placeholder="Descripción del producto..."
                maxLength={250}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700/30 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 transition resize-none"
              />
              <div className="flex justify-end">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formData.descripcion.length}/250 caracteres
                </span>
              </div>
            </div>

            {/* Precio de Venta */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
                <DollarSign size={16} /> Precio de Venta <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="precioVenta"
                value={formData.precioVenta}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0.1"
                className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-700/30 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 transition ${
                  errores.precioVenta
                    ? "border-red-400 focus:border-red-400"
                    : "border-gray-300 dark:border-slate-600"
                }`}
              />
              {errores.precioVenta && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {errores.precioVenta}
                </p>
              )}
            </div>

            {/* Stock Mínimo */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
                <TrendingDown size={16} /> Stock Mínimo de Alerta <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Cantidad mínima antes de que el sistema te avise que hay poco stock.
              </p>
              <input
                type="number"
                name="stockMinimoAlerta"
                value={formData.stockMinimoAlerta}
                onChange={handleChange}
                placeholder="Ej: 5"
                min="0"
                step="1"
                className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-700/30 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 transition ${
                  errores.stockMinimoAlerta
                    ? "border-red-400 focus:border-red-400"
                    : "border-gray-300 dark:border-slate-600"
                }`}
              />
              {errores.stockMinimoAlerta && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {errores.stockMinimoAlerta}
                </p>
              )}
            </div>

            {/* Tipo de Venta */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
                <Tag size={16} /> Tipo de Venta <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Define si el producto se vende por unidades (ej: gaseosa) o por peso en kilogramos (ej: queso).
              </p>
              <select
                name="tipoVenta"
                value={formData.tipoVenta}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-700/30 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 transition cursor-pointer ${
                  errores.tipoVenta
                    ? "border-red-400 focus:border-red-400"
                    : "border-gray-300 dark:border-slate-600"
                }`}
              >
                <option value="UNIDAD">Por Unidad</option>
                <option value="PESO">Por Peso (Kg)</option>
              </select>
              {errores.tipoVenta && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {errores.tipoVenta}
                </p>
              )}
            </div>

            {/* Categoría */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
                <Tag size={16} /> Categoría <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Selecciona el tipo de producto al que pertenece (ej: Lácteos, Aseo, Granos...).
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setModalBuscarCategoria(true)}
                  className={`flex-1 px-4 py-3 rounded-xl border-2 text-left flex items-center justify-between transition ${
                    errores.categoriaId
                      ? "border-red-400"
                      : "border-gray-300 dark:border-slate-600 hover:border-blue-500"
                  } ${
                    categoriaSeleccionada
                      ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300"
                      : "bg-white dark:bg-slate-700/30"
                  } cursor-pointer`}
                >
                  <span
                    className={
                      categoriaSeleccionada
                        ? "text-gray-900 dark:text-white font-medium"
                        : "text-gray-400 dark:text-gray-500"
                    }
                  >
                    {categoriaSeleccionada
                      ? categoriaSeleccionada.nombre
                      : "Seleccionar categoría..."}
                  </span>
                  <SearchIcon size={18} className="text-gray-400" />
                </button>
              </div>
              {errores.categoriaId && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {errores.categoriaId}
                </p>
              )}
            </div>

            {/* Marca */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
                <Tag size={16} /> Marca <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Selecciona la marca o proveedor del producto.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setModalBuscarMarca(true)}
                  className={`flex-1 px-4 py-3 rounded-xl border-2 text-left flex items-center justify-between transition ${
                    errores.marcaId
                      ? "border-red-400"
                      : "border-gray-300 dark:border-slate-600 hover:border-blue-500"
                  } ${
                    marcaSeleccionada
                      ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300"
                      : "bg-white dark:bg-slate-700/30"
                  } cursor-pointer`}
                >
                  <span
                    className={
                      marcaSeleccionada
                        ? "text-gray-900 dark:text-white font-medium"
                        : "text-gray-400 dark:text-gray-500"
                    }
                  >
                    {marcaSeleccionada
                      ? marcaSeleccionada.nombre
                      : "Seleccionar marca..."}
                  </span>
                  <SearchIcon size={18} className="text-gray-400" />
                </button>
              </div>
              {errores.marcaId && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {errores.marcaId}
                </p>
              )}
            </div>

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
                    Crear producto
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

      {/* Modal de búsqueda de categorías */}
      <BuscarCategoriaModal
        isOpen={modalBuscarCategoria}
        onClose={() => setModalBuscarCategoria(false)}
        onSelectCategoria={handleSelectCategoria}
        categoriaActual={categoriaSeleccionada}
      />

      {/* Modal de búsqueda de marcas */}
      <BuscarMarcaModal
        isOpen={modalBuscarMarca}
        onClose={() => setModalBuscarMarca(false)}
        onSelectMarca={handleSelectMarca}
        marcaActual={marcaSeleccionada}
      />
    </>
  );
}