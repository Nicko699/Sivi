import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ Agregado Link aquí
import { Mail, Lock } from "lucide-react";
import { login } from "../../Services/AuthService/LoginService";
import { useAccessToken } from "../../Context/Auht/UseAccessToken";
import { Footer } from "../../Components/Navigation/Footer"; // ✅ Si tienes un componente Footer

export function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setAccessToken } = useAccessToken();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(correo, password);

      // ✅ Sincroniza token con Axios y contexto
      setAccessToken(data.accessToken);

      // Redirige al dashboard
      navigate("/dashboard");

    } catch (err) {
      setError(err.message || "Credenciales incorrectas ❌");
    } finally {
      setLoading(false);
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

      {/* Card login */}
      <div className="relative z-10 w-full max-w-md bg-white/95 dark:bg-gray-900/90
        backdrop-blur-xl  dark:border-blue-700/30
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
          Iniciar Sesión
        </h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              required
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50
                border-2 border-gray-300 dark:border-gray-700 
                focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none
                text-gray-800 dark:text-gray-100 placeholder-gray-400
                transition-colors"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              required
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50
                border-2 border-gray-300 dark:border-gray-700 
                focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none
                text-gray-800 dark:text-gray-100 placeholder-gray-400
                transition-colors"
            />
          </div>

{error && (
  <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
    {error}
  </div>
)}

          <div className="text-left">
            <Link
              to="/RecuperarContraseña"
              className="text-sm text-blue-600 dark:text-blue-500 hover:text-blue-700 
                dark:hover:text-blue-400 font-medium transition-colors underline-offset-4 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white 
              bg-gradient-to-r from-blue-500 to-blue-600 
              hover:from-blue-600 hover:to-blue-700 
              dark:from-blue-400 dark:to-blue-500 
              dark:hover:from-blue-500 dark:hover:to-blue-600 
              shadow-lg hover:shadow-xl transition-all
              disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Verificando..." : "Ingresar"}
          </button>
        </form>
      </div>

      <Footer />
    </main>
  );
}

