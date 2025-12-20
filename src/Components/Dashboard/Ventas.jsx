import { useEffect, useState } from "react";
import api from "../../Configuracion/AxiosConfigPublic";

export function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/ventas")
      .then((res) => setVentas(res.data))
      .catch(() => setError("No se pudieron cargar las ventas."));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Ventas recientes</h2>

      {error && <p className="text-red-500">{error}</p>}

      {ventas.length > 0 ? (
        <ul className="space-y-2">
          {ventas.map((venta) => (
            <li key={venta.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
              <strong>{venta.producto}</strong> — ${venta.total}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No hay ventas registradas.</p>
      )}
    </div>
  );
}
