import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Search, DollarSign, Calendar, TrendingUp, FileText } from "lucide-react";
import { obtenerVentasPorRango } from "../../../Services/ReporteService/ReporteService";

export function ReporteVentas() {
  const location = useLocation();
  // Estado para controlar qué reporte ver (Ventas o Ganancias)
  const [tabActiva, setTabActiva] = useState(location.state?.tabInicial || 'ventas');
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const buscar = async () => {
    if (!fechaInicio || !fechaFin) {
      alert("Por favor selecciona ambas fechas");
      return;
    }
    
    setLoading(true);
    try {
      const data = await obtenerVentasPorRango(fechaInicio, fechaFin);
      setResultado(data);
    } catch (error) {
      console.error(error);
      alert("Error al obtener el reporte del servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 text-gray-800 dark:text-white">
      <h2 className="text-3xl font-bold mb-2">Informes Financieros</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Consulta el rendimiento de tu farmacia por periodos.</p>

      {/* TABS: Navegación interna entre Ventas y Ganancias */}
      <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
        <button 
          onClick={() => setTabActiva('ventas')}
          className={`pb-3 px-6 font-bold transition-all cursor-pointer ${
            tabActiva === 'ventas' 
            ? 'border-b-4 border-blue-500 text-blue-600' 
            : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Reporte de Ventas
        </button>
        <button 
          onClick={() => setTabActiva('ganancias')}
          className={`pb-3 px-6 font-bold transition-all cursor-pointer ${
            tabActiva === 'ganancias' 
            ? 'border-b-4 border-emerald-500 text-emerald-600' 
            : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Reporte de Ganancias
        </button>
      </div>

      {/* FILTROS */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 items-end mb-8">
        <div className="flex-1">
          <label htmlFor="inicio" className="block text-sm font-medium text-gray-500 mb-1">Desde</label>
          <input 
            id="inicio"
            type="date" 
            value={fechaInicio} 
            onChange={(e)=>setFechaInicio(e.target.value)} 
            className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700" 
          />
        </div>
        <div className="flex-1">
          <label htmlFor="fin" className="block text-sm font-medium text-gray-500 mb-1">Hasta</label>
          <input 
            id="fin"
            type="date" 
            value={fechaFin} 
            onChange={(e)=>setFechaFin(e.target.value)} 
            className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700" 
          />
        </div>
        <button 
          onClick={buscar} 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? "Consultando..." : <><Search size={18} /> Consultar</>}
        </button>
      </div>

      {/* RESULTADOS CONDICIONALES */}
      {resultado && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {tabActiva === 'ventas' ? (
            /* --- VISTA DE SOLO VENTAS --- */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl">
                <DollarSign size={48} className="mb-4 opacity-30" />
                <p className="text-sm font-bold uppercase tracking-wider opacity-80">Total Ventas Brutas</p>
                <h3 className="text-5xl font-black mt-2">
                  ${resultado.totalVendido?.toLocaleString('es-CO')}
                </h3>
              </div>
              <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <FileText size={40} className="mb-4 text-blue-500 opacity-20" />
                <p className="text-gray-500">Transacciones realizadas</p>
                <h3 className="text-4xl font-bold dark:text-white">{resultado.cantidadVentas}</h3>
              </div>
            </div>
          ) : (
            /* --- VISTA DE SOLO GANANCIAS --- */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-emerald-600 p-8 rounded-3xl text-white shadow-xl">
                <TrendingUp size={48} className="mb-4 opacity-30" />
                <p className="text-sm font-bold uppercase tracking-wider opacity-80">Ganancia Neta (Utilidad)</p>
                <h3 className="text-5xl font-black mt-2">
                  ${resultado.totalGanancia?.toLocaleString('es-CO')}
                </h3>
              </div>
              <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <TrendingUp size={40} className="mb-4 text-emerald-500 opacity-20" />
                <p className="text-gray-500">Margen de utilidad</p>
                <h3 className="text-4xl font-bold text-emerald-600">
                  {resultado.totalVendido > 0 
                    ? ((resultado.totalGanancia / resultado.totalVendido) * 100).toFixed(1) 
                    : 0}%
                </h3>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}