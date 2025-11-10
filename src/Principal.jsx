import { Footer } from "./Footer";

//creamos la funcion de inicio
export function Home() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center text-center 
      bg-blue-100 dark:bg-blue-950 transition-colors duration-700 px-6 relative overflow-hidden"
    >
      {/* Fondos del cuerpo d ela página*/}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-32 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-green-400/20 dark:bg-green-400/10 rounded-full blur-3xl animate-pulse delay-300"></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo con fondo blanco fijo */}
        <div className="mb-10 flex items-center justify-center bg-white rounded-2xl shadow-xl p-6 backdrop-blur-md ">
          <img
            src="/src/assets/Sivi.png"
            alt="Logo SIVI"
            className="h-24 w-24 object-contain drop-shadow-md"
          />
        </div>

        {/* Título */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 dark:text-white mb-5 tracking-tight drop-shadow-sm">
          Sistema de Ventas e Inventario
        </h1>

        {/* Subtítulo */}
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed">
          <span className="font-semibold text-green-600 dark:text-green-400">Acceso exclusivo.</span>{" "}
          Solo el personal autorizado puede ingresar. Inicia sesión con tus{" "}
          <span className="font-semibold text-green-600 dark:text-green-400">
            credenciales de acceso
          </span>.
        </p>

        {/* Línea decorativa  */}
        <div className="mt-10 h-1.5 w-40 bg-gradient-to-r from-blue-600 to-green-500 dark:from-blue-400 dark:to-green-300 rounded-full shadow-md animate-[pulse_2s_ease-in-out_infinite]"></div>
      </div>
       <Footer />
    </main>
  );
}



