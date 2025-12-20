import { useState, useEffect } from "react";
import { Lock } from "lucide-react";
import { Footer } from "../Navigation/Footer";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { cambiarContrasena } from "../../Services/AuthService/CambiarPasswordService";

export function ResetPassword() {
  const location = useLocation();

  // Tokens desde la URL
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
    setIsPasswordValid(password.length >= 10 && password.length <= 64);
  }, [password]);

  useEffect(() => {
    setPasswordsMatch(confirmPassword === "" || password === confirmPassword);
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cooldown) {
      toast.info("Por favor, espera unos segundos.");
      return;
    }

    if (!passwordsMatch) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    if (!isPasswordValid) {
      toast.error("La contraseña debe tener entre 10 y 64 caracteres.");
      return;
    }

    setCooldown(true);

    try {
      const data = await cambiarContrasena({
        resetTokenId,
        resetToken,
        password,
      });

      toast.success(
        data.mensaje || "¡Contraseña cambiada exitosamente!"
      );

      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setTimeout(() => setCooldown(false), 4000);
    }
  };


return (
  <main className="min-h-screen flex items-center justify-center
    bg-gray-100 dark:bg-gradient-to-b dark:from-blue-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-700 relative overflow-hidden px-4">
    
    {/* Fondos animados suaves */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute top-1/3 left-1/4 w-[400px] h-[400px]
          dark:bg-blue-600/20 bg-blue-300/10 rounded-full blur-3xl "
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px]
          dark:bg-blue-900/20 bg-blue-200/10 rounded-full blur-3xl "
        />
      </div>


    {/* Card principal */}
    <div className="relative z-10 w-full max-w-md bg-white/95 dark:bg-gray-900/90
      backdrop-blur-xl rounded-2xl shadow-2xl p-8">
      
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
        Restablecer Contraseña
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
