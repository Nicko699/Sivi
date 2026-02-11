import { useEffect, useState } from "react";
import { AlertTriangle, DollarSign, TrendingUp, ArrowRight } from "lucide-react";
import { useAccessToken } from "../../Context/Auht/UseAccessToken";
import { alertarProductosBajoStock } from "../../Services/ProductoServiceP/ProductoService";
import { ProductosBajoStock } from "../../Components/Dashboard/ModuloProducto/ProductosBajoStockModal";
import { obtenerTotalVentasHoy } from "../../Services/ReporteService/ReporteService";
import { Link } from "react-router-dom";

export function Inicio() {
  const { getNombreUsuario } = useAccessToken();
  const nombreUsuario = getNombreUsuario() || "Usuario";
    const [totalBajoStock, setTotalBajoStock] = useState(0);

    // Estado para guardar el reporte de ventas
  const [reporte, setReporte] = useState({ totalVendido: 0, cantidadVentas: 0 });
  
  const [loading, setLoading] = useState(true);
  const [modalBajoStock, setModalBajoStock] = useState(false);
  const [productosIniciales, setProductosIniciales] = useState(null);

  const LoaderOverlay = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  useEffect(() => {
    const cargarInformacionDashboard = async () => {
      try {
        setLoading(true);
        // Carga Stock y Ventas
        const [dataStock, dataVentas] = await Promise.all([
          alertarProductosBajoStock({ page: 0, size: 10 }),
          obtenerTotalVentasHoy()
        ]);

        setTotalBajoStock(dataStock.page.totalElements || 0);
        setProductosIniciales(dataStock);
        
        // Guarda el total vendido
        setReporte(dataVentas);
      } catch (error) {
        console.error("Error al cargar el dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarInformacionDashboard();
  }, []);

  return (
    <div className="px-6 py-6 max-w-7xl mx-auto">
      {loading && <LoaderOverlay />}

      {/* Bienvenida */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          ¡Hola, {nombreUsuario}!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Aquí tienes un resumen de tu negocio
        </p>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* CARD: PRODUCTOS BAJO STOCK  */}
        <div className={`relative overflow-hidden rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-2xl ${
          totalBajoStock > 0 
            ? 'bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-900' 
            : 'bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-900'
        }`}>
          <div className="absolute -top-6 -right-6 opacity-20">
            <AlertTriangle className="w-32 h-32" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Stock Bajo</h3>
          <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">{totalBajoStock}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{totalBajoStock === 1 ? 'producto' : 'productos'}</p>
          <button onClick={() => setModalBajoStock(true)} className="w-full py-3 rounded-lg font-semibold bg-red-600/90 text-white cursor-pointer hover:bg-red-700 transition-all">
            Ver productos
          </button>
        </div>

        {/* --- CARD VENTAS DE HOY --- */}
        <div className="relative overflow-hidden rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-900">
          
          {/* Icono de fondo decorativo */}
          <div className="absolute -top-6 -right-6 opacity-20">
            <DollarSign className="w-32 h-32 text-blue-600" />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Ventas de Hoy</h3>
            <span className="flex items-center gap-1 text-[10px] bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-100 px-2 py-0.5 rounded-full uppercase font-bold">
              <TrendingUp size={10} /> En vivo
            </span>
          </div>

          <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            ${reporte.totalVendido.toLocaleString('es-CO')}
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {reporte.cantidadVentas} transacciones hoy
          </p>

          <Link
            to="/dashboard/reportes"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
          >
            Ver más detalles <ArrowRight size={18} />
          </Link>
        </div>

      </div>

      {/* Modal Productos Bajo Stock */}
      <ProductosBajoStock
        isOpen={modalBajoStock}
        onClose={() => setModalBajoStock(false)}
        datosIniciales={productosIniciales}
      />
    </div>
  );
}