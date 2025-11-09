import { useState, useEffect } from "react";
import { Lock } from "lucide-react";
import { Footer } from "./Footer";
import api from "./Configuracion/AxiosConfigPublic";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export function ResetPassword() {
  const location = useLocation();
  

  // Captura automáticamente los tokens de la URL
  const [resetTokenId, setResetTokenId] = useState("");
  const [resetToken, setResetToken] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cooldown, setCooldown] = useState(false);

  // Validaciones
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  useEffect(() => {
     const queryParams = new URLSearchParams(location.search);
    setResetTokenId(queryParams.get("resetTokenId") || "");
    setResetToken(queryParams.get("resetToken") || "");
  }, [location.search]);

  useEffect(() => {
    // Valida que la contraseña tenga entre 10 y 64 caracteres
    setIsPasswordValid(password.length >= 10 && password.length <= 64);
  }, [password]);

  useEffect(() => {
    // Comprueba si ambas contraseñas coinciden
    setPasswordsMatch(confirmPassword === "" || password === confirmPassword);
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (cooldown) {
    toast.info("Por favor, espera unos segundos antes de intentarlo nuevamente.");
    return;
  }

  if (password !== confirmPassword) {
    toast.error("Las contraseñas no coinciden.");
    return;
  }

  if (!isPasswordValid) {
    toast.error("La contraseña debe tener entre 10 y 64 caracteres.");
    return;
  }

  setCooldown(true);

  try {
    const res = await api.post("/resetToken/cambiarContraseña", {
      resetTokenId,
      resetToken,
      password,
    });

    // Si todo salió bien
    const mensaje = res.data.mensaje || "¡Contraseña cambiada exitosamente!";
    toast.success(mensaje);

    setPassword("");
    setConfirmPassword("");
  } catch (err) {
    // Aquí interceptamos los distintos errores y personalizamos los mensajes
    let errorMsg = "No se pudo cambiar la contraseña. Intenta nuevamente.";

    if (err.response?.status === 400) {
      // BadRequestException
      switch (err.response.data.mensaje) {
        case "El token ya se ha usado":
          errorMsg = "Este enlace ya fue utilizado para cambiar la contraseña.";
          break;
        case "Token caducado":
          errorMsg = "El enlace ha expirado. Solicita uno nuevo.";
          break;
        case "El token de restablecimiento no coincide o es inválido.":
          errorMsg = "El enlace es inválido o está dañado. Verifica el enlace enviado a tu correo.";
          break;
        default:
          errorMsg = err.response.data.mensaje;
      }
    } else if (err.response?.status === 404) {
      // NotFoundException
      errorMsg = "No se encontró el enlace de restablecimiento. Solicita uno nuevo.";
    }

    toast.error(errorMsg);
  } finally {
    setTimeout(() => setCooldown(false), 4000);
  }
};

return (
  <main className="min-h-screen flex items-center justify-center
    bg-blue-100 dark:bg-blue-950 transition-colors duration-700 relative overflow-hidden px-4">
    
    {/* Fondos decorativos */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-400/20 dark:bg-green-400/10 rounded-full blur-3xl animate-pulse"></div>
    </div>

    {/* Card principal */}
    <div className="relative z-10 w-full max-w-md bg-white/95 dark:bg-gray-900/90
      backdrop-blur-xl border border-blue-200/50 dark:border-blue-700/30
      rounded-2xl shadow-2xl p-8">
      
      {/* Logo con fondo blanco fijo */}
      <div className="flex justify-center mb-6">
        <div className="bg-white rounded-xl p-3 shadow-md">
          <img
            src="/src/assets/Sivi.png"
            alt="Logo SIVI"
            className="h-16 w-16 object-contain"
          />
        </div>
      </div>

      {/* Título */}
      <h2 className="text-2xl font-bold text-center text-blue-900 dark:text-white mb-6">
        Cambiar Contraseña
      </h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nueva contraseña */}
        <div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              required
              placeholder=" Ingresa tu nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={cooldown}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50
                border-2 border-gray-200 dark:border-gray-700 
                focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none
                text-gray-800 dark:text-gray-100 placeholder-gray-400
                transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          {/* Mensaje de validación */}
          {password.length > 0 && (
            <p className={`text-sm mt-2 ${
              isPasswordValid
                ? "text-green-600 dark:text-green-400 font-semibold"
                : "text-red-600 dark:text-red-400 font-semibold"
            }`}>
              {isPasswordValid
                ? "Contraseña válida"
                : "La contraseña debe tener entre 10 y 64 caracteres"}
            </p>
          )}
        </div>

        {/* Confirmar contraseña */}
        <div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              required
              placeholder="Confirma tu nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={cooldown}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50
                border-2 border-gray-200 dark:border-gray-700 
                focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none
                text-gray-800 dark:text-gray-100 placeholder-gray-400
                transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          {/* Mensaje de coincidencia */}
          {confirmPassword && (
            <p className={`text-sm mt-2 ${
              passwordsMatch
                ? "text-green-600 dark:text-green-400 font-semibold"
                : "text-red-600 dark:text-red-400 font-semibold"
            }`}>
              {passwordsMatch
                ? "Las contraseñas coinciden"
                : "Las contraseñas no coinciden"}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={cooldown || !isPasswordValid || !passwordsMatch}
          className="w-full py-3 rounded-xl font-semibold text-white 
            bg-gradient-to-r from-blue-500 to-blue-600 
            hover:from-blue-600 hover:to-blue-700 
            dark:from-blue-400 dark:to-blue-500 
            dark:hover:from-blue-500 dark:hover:to-blue-600 
            shadow-lg hover:shadow-xl transition-all
            disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {cooldown ? "Procesando..." : "Cambiar contraseña"}
        </button>
      </form>

      {/* Link de regreso a la izquierda */}
      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 
            dark:hover:text-blue-400 font-medium transition-colors inline-flex items-center gap-1"
        >
          ← Volver al inicio de sesión
        </Link>
      </div>
    </div>

    <Footer />
  </main>
);
}
