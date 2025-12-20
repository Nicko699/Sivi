// src/Dashboard/Inicio.js
import { useAccessToken } from "../../Context/Auht/UseAccessToken";

export function Inicio() {
  const { getNombreUsuario } = useAccessToken();
  const nombreUsuario = getNombreUsuario() || "Usuario";

  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400">
        ¡Hola, {nombreUsuario}!
      </h1>
      <p className="mt-3 text-gray-600 dark:text-gray-300 text-lg">
        Selecciona una opción del menú para comenzar a trabajar.
      </p>
    </div>
  );
}
