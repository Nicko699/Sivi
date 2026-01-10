import { useState } from "react";
import { Mail } from "lucide-react";
import { Footer } from "../Navigation/Footer";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { enviarCorreoRecuperacion } from "../../Services/AuthService/RecuperarPasswordService";

export function ForgotPassword() {
  const [correo, setCorreo] = useState("");
  const [cooldown, setCooldown] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cooldown) {
      toast.info("Por favor, espera unos segundos.");
      return;
    }

    setCooldown(true);

    try {
      const data = await enviarCorreoRecuperacion(correo);
      toast.success(
        data.message || "Si el correo existe, se envió el enlace"
      );
      setCorreo("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setTimeout(() => setCooldown(false), 4000);
    }
  };

 return (
  <main
    className="min-h-screen flex items-center justify-center
    bg-gray-100 dark:bg-gradient-to-b dark:from-blue-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-700 relative overflow-hidden px-4"
  >
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
    <div
      className="relative z-10 w-full max-w-md bg-white/95 dark:bg-gray-900/90
      backdrop-blur-xl 
      rounded-2xl shadow-2xl p-8"
    >
      {/* Logo con fondo blanco siempre */}
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
      <h2 className="text-2xl font-bold text-center text-blue-900 dark:text-white mb-2">
        ¿Olvidaste tu contraseña?
      </h2>
      
      <p className="text-center text-gray-600 dark:text-gray-400 mb-6 text-[15px]">
        Te enviaremos un enlace de recuperación
      </p>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="email"
            required
            placeholder="Ingresa tu correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            disabled={cooldown}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50
              border-2 border-gray-300 dark:border-gray-700 
              focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none
              text-gray-800 dark:text-gray-100 placeholder-gray-400
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={cooldown}
          className="w-full py-3 rounded-xl font-semibold text-white 
            bg-gradient-to-r from-blue-500 to-blue-600 
            hover:from-blue-600 hover:to-blue-700 
            dark:from-blue-400 dark:to-blue-500 
            dark:hover:from-blue-500 dark:hover:to-blue-600 
            shadow-lg hover:shadow-xl transition-all
            disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {cooldown ? "Enviando..." : "Enviar enlace"}
        </button>
      </form>

      {/* Link de regreso */}
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
