import { useEffect, useState } from "react";
import { AlertTriangle, DollarSign, TrendingUp, ArrowRight } from "lucide-react"; // Importar iconos nuevos
import { useAccessToken } from "../../Context/Auht/UseAccessToken";
import { alertarProductosBajoStock } from "../../Services/ProductoServiceP/ProductoService";
import { ProductosBajoStock } from "../../Components/Dashboard/ModuloProducto/ProductosBajoStockModal";
import { obtenerTotalVentasHoy } from "../../Services/ReporteService/ReporteService"; // Servicio que crearemos
import { Link } from "react-router-dom";

export function Inicio() {
  const { getNombreUsuario } = useAccessToken();
  const nombreUsuario = getNombreUsuario() || "Usuario";

  const [totalBajoStock, setTotalBajoStock] = useState(0);
  const [reporte, setReporte] = useState({ totalVendido: 0, totalGanancia: 0, cantidadVentas: 0 });
  const [loading, setLoading] = useState(true);
  const [modalBajoStock, setModalBajoStock] = useState(false);
  const [productosIniciales, setProductosIniciales] = useState(null);

  const LoaderOverlay = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const [dataStock, dataVentas] = await Promise.all([
          alertarProductosBajoStock({ page: 0, size: 10 }),
          obtenerTotalVentasHoy()
        ]);
        
        setTotalBajoStock(dataStock.page.totalElements || 0);
        setProductosIniciales(dataStock);
        setReporte(dataVentas);
      } catch (error) {
        console.error("Error al cargar dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  return (
    <div className="px-6 py-6 max-w-7xl mx-auto">
      {loading && <LoaderOverlay />}

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">¡Hola, {nombreUsuario}!</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Resumen actual de la farmacia</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Stock Bajo */}
        <div className={`relative overflow-hidden rounded-xl p-6 shadow-lg border ${totalBajoStock > 0 ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'}`}>
          <AlertTriangle className="absolute -top-4 -right-4 w-24 h-24 opacity-10" />
          <h3 className="text-lg font-semibold text-gray-700">Stock Bajo</h3>
          <p className="text-4xl font-bold text-gray-900">{totalBajoStock}</p>
          <button onClick={() => setModalBajoStock(true)} className="mt-6 w-full py-2 bg-red-600 text-white rounded-lg font-bold">Ver productos</button>
        </div>

        {/* Card 2: Ventas de Hoy */}
        <div className="relative overflow-hidden rounded-xl p-6 shadow-lg border bg-blue-50 border-blue-300">
          <DollarSign className="absolute -top-4 -right-4 w-24 h-24 opacity-10" />
          <h3 className="text-lg font-semibold text-gray-700">Ventas de Hoy</h3>
          <p className="text-4xl font-bold text-gray-900">${reporte.totalVendido?.toLocaleString('es-CO') || 0}</p>
          <p className="text-sm text-gray-500">{reporte.cantidadVentas} transacciones</p>
          <Link to="/dashboard/reportes"  state={{ tabInicial: 'ventas' }}  className="mt-4 inline-flex items-center gap-1 text-blue-600 font-bold hover:underline">Detalles <ArrowRight size={14}/></Link>
        </div>

        {/* Card 3: Ganancias de Hoy */}
        <div className="relative overflow-hidden rounded-xl p-6 shadow-lg border bg-emerald-50 border-emerald-300">
          <TrendingUp className="absolute -top-4 -right-4 w-24 h-24 opacity-10" />
          <h3 className="text-lg font-semibold text-gray-700">Ganancia Neta</h3>
          <p className="text-4xl font-bold text-emerald-700">${reporte.totalGanancia?.toLocaleString('es-CO')  || 0}</p>
          <p className="text-sm text-emerald-600">Margen del día</p>
          <Link to="/dashboard/reportes" state={{ tabInicial: 'ganancias' }} className="mt-4 inline-flex items-center gap-1 text-emerald-600 font-bold hover:underline">Detalles <ArrowRight size={14}/></Link>
        </div>

      </div>

      <ProductosBajoStock isOpen={modalBajoStock} onClose={() => setModalBajoStock(false)} datosIniciales={productosIniciales} />
    </div>
  );
}