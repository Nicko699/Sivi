import { useState } from "react";
import { Search, DollarSign, Calendar, FileText } from "lucide-react";
import { obtenerVentasPorRango } from "../../../Services/ReporteService/ReporteService";

export function ReporteVentas() {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  
  const buscar = async () => {
    if (!fechaInicio || !fechaFin) return;
    setLoading(true);
    try {
      const data = await obtenerVentasPorRango(fechaInicio, fechaFin);
      setResultado(data);
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Error al obtener reporte";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Reporte Detallado de Ventas
      </h2>

      {/* Filtros estilo Sivi */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex gap-4 items-end mb-8 border border-gray-100 dark:border-gray-700">
        <div className="flex-1">
          <label htmlFor="fechaInicio" className="text-sm font-medium text-gray-500">
            Desde
          </label>
          <input
            id="fechaInicio"
            name="fechaInicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="w-full mt-1 p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="fechaFin" className="text-sm font-medium text-gray-500">
            Hasta
          </label>
          <input
            id="fechaFin"
            name="fechaFin"
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="w-full mt-1 p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
          />
        </div>
        <button
          onClick={buscar}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-bold transition-all flex items-center gap-2"
        >
          {loading ? "Cargando..." : <><Search size={18} /> Consultar</>}
        </button>
      </div>

      {/* Resultados */}
      {resultado && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-8 rounded-3xl text-white shadow-lg">
            <DollarSign size={48} className="mb-4 opacity-30" />
            <p className="text-sm uppercase font-bold tracking-wider">Total Recaudado</p>
            <h3 className="text-5xl font-black mt-2">
              ${resultado.totalVendido?.toLocaleString("es-CO")}
            </h3>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <Calendar size={48} className="mb-4 text-gray-300" />
            <p className="text-sm text-gray-500 uppercase font-bold">Ventas registradas</p>
            <h3 className="text-5xl font-black text-gray-800 dark:text-white mt-2">
              {resultado.cantidadVentas}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}