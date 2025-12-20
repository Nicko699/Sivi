import { Footer } from "../Navigation/Footer";

export function Home() {
  return (
    <main
      className="min-h-screen flex flex-col pt-16 pb-20 relative overflow-hidden
      bg-gray-100 dark:bg-gradient-to-b dark:from-blue-950 dark:via-slate-900 dark:to-slate-950"
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

      {/* Contenido principal */}
      <div className="relative flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-3xl text-center">

          {/* Logo */}
          <div className="mb-10 flex justify-center">
            <div className="p-6 bg-gray-100 dark:bg-gray-100 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800">
              <img src="/src/assets/Sivi.png" alt="SIVI" className="w-20 opacity-90" />
            </div>
          </div>

          {/* Títulos */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
            Sistema de Ventas
          </h1>
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text
            bg-gradient-to-r from-blue-600 to-teal-400 dark:from-blue-400 dark:to-teal-500">
            e Inventario
          </h2>

          {/* Descripción */}
          <p className="mt-6 text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            <span className="font-semibold text-green-600 dark:text-green-400">Acceso exclusivo. </span>  
            Solo el personal autorizado puede ingresar.  
            Inicia sesión con tus <span className="font-semibold text-green-600 dark:text-green-400">credenciales</span>.
          </p>

          {/* Línea decorativa */}
          <div className="flex justify-center mt-10">
            <div className="h-1 w-40 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 dark:from-blue-500 dark:to-teal-400" />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
