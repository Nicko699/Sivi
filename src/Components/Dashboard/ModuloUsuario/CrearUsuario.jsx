import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Eye, EyeOff, User, Mail, Lock, Shield, CheckCircle, AlertCircle } from "lucide-react";
import { crearUsuario } from "../../../Services/UsuarioServiceP/UsuarioService"; //import del service

export function CrearUsuario() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    password: "",
    confirmarPassword: "",
    listaRol: [],
  });

  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState({});
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const rolesDisponibles = [
    { id: 1, nombre: "Administrador", value: "ADMIN" },
    { id: 2, nombre: "Vendedor", value: "VEND" },
  ];

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    } else if (formData.nombre.trim().length < 3) {
      nuevosErrores.nombre = "El nombre debe tener al menos 3 caracteres";
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correo.trim()) {
      nuevosErrores.correo = "El correo es obligatorio";
    } else if (!regexEmail.test(formData.correo)) {
      nuevosErrores.correo = "El formato del correo no es válido";
    }

    if (!formData.password) {
      nuevosErrores.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      nuevosErrores.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!formData.confirmarPassword) {
      nuevosErrores.confirmarPassword = "Debes confirmar la contraseña";
    } else if (formData.password !== formData.confirmarPassword) {
      nuevosErrores.confirmarPassword = "Las contraseñas no coinciden";
    }

    if (formData.listaRol.length === 0) {
      nuevosErrores.listaRol = "Debes seleccionar al menos un rol";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errores[name]) {
      setErrores((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRolChange = (rolId) => {
    setFormData((prev) => {
      const listaActual = [...prev.listaRol];
      const index = listaActual.indexOf(rolId);

      if (index > -1) {
        listaActual.splice(index, 1);
      } else {
        listaActual.push(rolId);
      }

      return {
        ...prev,
        listaRol: listaActual,
      };
    });

    if (errores.listaRol) {
      setErrores((prev) => ({
        ...prev,
        listaRol: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMensajeError("");
    setMensajeExito("");

    if (!validarFormulario()) return;

    try {
      setLoading(true);

      const datosEnviar = {
        nombre: formData.nombre.trim(),
        correo: formData.correo.trim().toLowerCase(),
        password: formData.password,
        listaRol: formData.listaRol,
      };

      // ✅ Llamada al service en vez de usar api.post directamente
      await crearUsuario(datosEnviar);

      setMensajeExito("Usuario creado exitosamente");

      setFormData({
        nombre: "",
        correo: "",
        password: "",
        confirmarPassword: "",
        listaRol: [],
      });

      setTimeout(() => {
        navigate("/dashboard/usuarios");
      }, 2000);
    } catch (err) {
      // ✅ Manejo de errores centralizado en el service
      setMensajeError(err.message || "Error de conexión. Intenta nuevamente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-10 md:py-15 bg-gray-100 dark:bg-gray-900  min-h-screen transition-colors">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex items-center gap-4">
          <div className="w-14 h-14 md:w-16 md:h-16 dark:bg-blue-700 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <User size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
              Crear nuevo usuario
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
              Completa los datos para agregar un usuario
            </p>
          </div>
        </div>

        {/* Mensajes */}
        {mensajeExito && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-300 rounded-md flex items-center gap-2">
            <CheckCircle size={20} /> {mensajeExito}
          </div>
        )}

        {mensajeError && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded-md flex items-center gap-2">
            <AlertCircle size={20} /> {mensajeError}
          </div>
        )}

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-gray-200 dark:border-[#312d45]/60 rounded-3xl shadow-xl p-6 md:p-10 space-y-6 transition-all"
        >
          {/* Nombre + Correo */}
          <div className="grid md:grid-cols-2 gap-5">
            <Campo
              icono={<User size={16} />}
              label="Nombre"
              tipo="text"
              name="nombre"
              valor={formData.nombre}
              onChange={handleChange}
              error={errores.nombre}
              placeholder="Ej: Juan Pérez"
            />

            <Campo
              icono={<Mail size={16} />}
              label="Correo electrónico"
              tipo="email"
              name="correo"
              valor={formData.correo}
              onChange={handleChange}
              error={errores.correo}
              placeholder="ejemplo@correo.com"
            />
          </div>

          {/* Contraseñas */}
          <div className="grid md:grid-cols-2 gap-5">
            <PasswordCampo
              label="Contraseña"
              name="password"
              valor={formData.password}
              onChange={handleChange}
              mostrar={mostrarPassword}
              setMostrar={setMostrarPassword}
              error={errores.password}
              placeholder="Mínimo 6 caracteres"
            />

            <PasswordCampo
              label="Confirmar contraseña"
              name="confirmarPassword"
              valor={formData.confirmarPassword}
              onChange={handleChange}
              mostrar={mostrarConfirmar}
              setMostrar={setMostrarConfirmar}
              error={errores.confirmarPassword}
              placeholder="Repite la contraseña"
            />
          </div>

          {/* Roles */}
<div className="space-y-2">
  <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
    <Shield size={16} /> Roles <span className="text-red-500">*</span>
  </label>

  <div className="flex flex-wrap gap-2">
    {rolesDisponibles.map((rol) => (
      <label
        key={rol.id}
        className={`flex items-center gap-2 px-4 py-2 border rounded-2xl cursor-pointer transition-all backdrop-blur-sm ${
          formData.listaRol.includes(rol.id)
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300"
                        : "border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/30 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-900/50 hover:border-gray-400 dark:hover:border-slate-600"
                    }`}


      >
        <input
          type="checkbox"
          checked={formData.listaRol.includes(rol.id)}
          onChange={() => handleRolChange(rol.id)}
          className="w-4 h-4 accent-blue-400"
        />
        {rol.nombre}
      </label>
    ))}
  </div>

  {errores.listaRol && (
    <p className="text-xs text-red-500 flex items-center gap-1">
      <AlertCircle size={14} /> {errores.listaRol}
    </p>
  )}
</div>


          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-2xl dark:bg-green-600 bg-green-500  text-white font-semibold dark:hover:bg-green-700 hover:bg-green-600 transition-all shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creando...
                </div>
              ) : (
                <>
                 Crear usuario
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/usuarios")}
              disabled={loading}
              className="flex-1 py-3 rounded-2xl bg-gray-300/90 dark:bg-slate-700/50 dark:hover:bg-slate-700/80 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-400/50 transition-all border border-gray-300 dark:border-[#3b3650] cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* 🔹 Subcomponentes de Inputs */
function Campo({ icono, label, tipo, name, valor, onChange, error, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
        {icono} {label} <span className="text-red-500">*</span>
      </label>
      <input
        type={tipo}
        name={name}
        value={valor}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-2xl border bg-white dark:bg-slate-700/30 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none ring-1 dark:ring-slate-700 ring-slate-300 focus:ring-1 ${
          error
            ? "border-red-400 focus:ring-red-400"
            : "border-gray-300 dark:border-[#332b45] focus:ring-blue-400"
        } transition`}
      />
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle size={14} /> {error}
        </p>
      )}
    </div>
  );
}

function PasswordCampo({
  label,
  name,
  valor,
  onChange,
  mostrar,
  setMostrar,
  error,
  placeholder,
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
        <Lock size={16} /> {label} <span className="text-red-500">*</span>
      </label>

      <div className="relative flex items-center">
        <input
          type={mostrar ? "text" : "password"}
          name={name}
          value={valor}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-[12px] md:py-[14px] rounded-2xl border bg-white dark:bg-slate-700/30 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 pr-11 focus:outline-none focus:ring-1 dark:ring-slate-700 ring-slate-300 ring-1 ${
            error
              ? "border-red-400 focus:ring-red-400"
              : "border-gray-300 dark:border-[#332b45] focus:ring-blue-400"
          } transition`}
        />

        <button
          type="button"
          onClick={() => setMostrar(!mostrar)}
          className="absolute right-3 flex items-center justify-center cursor-pointer text-gray-500 dark:text-gray-400"
          style={{ top: "50%", transform: "translateY(-50%)" }}
        >
          {mostrar ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle size={14} /> {error}
        </p>
      )}
    </div>
  );
}
