import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useAccessToken } from "../../Context/Auht/UseAccessToken";
import { alertarProductosBajoStock } from "../../Services/ProductoServiceP/ProductoService";
import { ProductosBajoStock } from "../../Components/Dashboard/ModuloProducto/ProductosBajoStockModal";

export function Inicio() {
  const { getNombreUsuario } = useAccessToken();
  const nombreUsuario = getNombreUsuario() || "Usuario";

  const [totalBajoStock, setTotalBajoStock] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalBajoStock, setModalBajoStock] = useState(false);
  const [productosIniciales, setProductosIniciales] = useState(null);

  // ✅ Loader Overlay similar al de tu segundo ejemplo
  const LoaderOverlay = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  useEffect(() => {
    const obtenerCantidadBajoStock = async () => {
      try {
        const data = await alertarProductosBajoStock({ page: 0, size: 10 });
        setTotalBajoStock(data.page.totalElements || 0);
        setProductosIniciales(data);
      } catch (error) {
        console.error("Error al obtener productos bajo stock:", error);
        setTotalBajoStock(0);
      } finally {
        setLoading(false);
      }
    };
    obtenerCantidadBajoStock();
  }, []);

  return (
    <div className="px-6 py-6 max-w-7xl mx-auto">
      {/* Loader overlay */}
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
        {/* Card: Productos Bajo Stock */}
        <div className={`relative overflow-hidden rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-2xl ${
          totalBajoStock > 0 
            ? 'bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-900' 
            : 'bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-900'
        }`}>
          
          <div className="absolute -top-6 -right-6 opacity-20">
            <AlertTriangle className="w-32 h-32" />
          </div>

          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Stock Bajo
          </h3>

          {loading ? (
            <div className="h-12 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mb-2"></div>
          ) : (
            <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {totalBajoStock}
            </p>
          )}

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {totalBajoStock === 1 ? 'producto' : 'productos'}
          </p>

          <button
            onClick={() => setModalBajoStock(true)}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 cursor-pointer ${
              totalBajoStock > 0
                ? 'bg-red-600/90 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-700 dark:text-gray-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {totalBajoStock > 0 ? 'Ver productos' : 'Todo en orden'}
          </button>
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
