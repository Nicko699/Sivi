import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { Footer } from "../src/Footer";
import { login } from "../src/Configuracion/Backend";
import { Link } from "react-router-dom";

export function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(correo, password);

      // ✅ Guardar tokens solo si el login fue exitoso
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshTokenId", data.refreshToken.refreshTokenId);
      localStorage.setItem("refreshToken", data.refreshToken.refreshToken);

      alert(data.mensaje || "Inicio de sesión exitoso ✅");
    } catch (err) {
      // ⚠️ Mostrar el error sin recargar la página
      setError(err.message || "Credenciales incorrectas ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-start justify-center pt-60 sm:pt-23
        bg-blue-100 dark:bg-blue-950 transition-colors duration-700 relative overflow-hidden px-4 sm:px-6 lg:px-0"
    >
      {/* Fondos del login */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-56 h-56 sm:w-72 sm:h-72 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 sm:w-[30rem] sm:h-[30rem] bg-green-400/20 dark:bg-green-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Card login */}
      <div
        className="relative z-10 w-full max-w-xs sm:max-w-md bg-gray-100 dark:bg-gray-900/80
        backdrop-blur-lg border border-blue-200 dark:border-blue-700/40
        rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.15)] p-6 sm:p-10"
      >
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="dark:bg-gray-100 rounded-lg p-2 flex items-center justify-center">
            <img
              src="/src/assets/Sivi.png"
              alt="Logo SIVI"
              className="h-16 w-16 sm:h-20 sm:w-20 object-contain
                dark:brightness-125 dark:drop-shadow-[0_0_20px_rgba(16,185,129,0.7)]"
            />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-blue-900 dark:text-white mb-6 sm:mb-8 tracking-tight">
          Bienvenido a SIVI
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 sm:mt-6">
          <div className="relative">
            <Mail className="absolute left-3 sm:left-4 top-3 sm:top-3.5 text-blue-500 dark:text-blue-400" />
            <input
              type="email"
              required
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 rounded-xl bg-white/90 dark:bg-gray-800/80 
                border border-gray-300 dark:border-gray-700 
                focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 
                text-gray-800 dark:text-gray-100 placeholder-gray-500 text-sm sm:text-base"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 sm:left-4 top-3 sm:top-3.5 text-blue-500 dark:text-blue-400" />
            <input
              type="password"
              required
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 rounded-xl bg-white/90 dark:bg-gray-800/80 
                border border-gray-300 dark:border-gray-700 
                focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 
                text-gray-800 dark:text-gray-100 placeholder-gray-500 text-sm sm:text-base"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-left font-semibold animate-fade-in">
              {error}
            </p>
          )}

          <div className="mt-1 sm:mt-2 text-sm text-left">
            <Link
              to={"/RecuperarContraseña"}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium underline-offset-4 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 sm:py-3.5 rounded-xl font-bold text-white bg-gradient-to-r 
              from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
              dark:from-blue-400 dark:to-blue-500 dark:hover:from-blue-500 
              dark:hover:to-blue-600 shadow-lg hover:shadow-blue-400/30 
              transition-all duration-300 text-sm sm:text-base cursor-pointer
              ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {loading ? "Verificando..." : "Ingresar"}
          </button>
        </form>
      </div>

      <Footer />
    </main>
  );
}
