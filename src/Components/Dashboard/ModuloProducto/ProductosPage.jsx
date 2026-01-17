import { useState } from "react";

// listas para los selects
const ESTADOS = ["Activo", "Inactivo", "Agotado"];
const CATEGORIAS = [
  "Alimentos",
  "Bebidas",
  "Aseo del hogar",
  "Higiene personal",
  "Tecnología",
  "Papelería",
  "Ropa",
  "Hogar y decoración",
];

function ProductosPage() {
  // Estado del formulario, con nombres iguales a la tabla producto
  const [producto, setProducto] = useState({
    Nombre_producto: "",
    Descripcion: "",
    Precio_compra: "",
    Precio_venta: "",
    stock: "",
    Stock_minimo_alerta: "",
    id_categoria_fk: "",
    Marca: "",
    Estado: "Activo",
  });

  // Controla si se ve el formulario
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Datos de ejemplo para la tabla (después se conecta a backend)
  const [productos, setProductos] = useState([
    {
      id: "P-0001",
      nombre: "Leche entera",
      descripcion: "Alimento lácteo refrigerado",
      precioCompra: "$1.200",
      precioVenta: "$2.300",
      stock: "30",
      stockMinimo: "5",
      estado: "Activo",
      marca: "Alpina"
    }
  ]);

  // Maneja el cambio de cualquier input del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Enviar formulario (de momento solo en consola)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Producto listo para enviar al backend:", producto);
    // Aquí después: POST al backend + limpiar formulario
    limpiarFormulario();
    setMostrarFormulario(false);
  };

  // Limpiar formulario
  const limpiarFormulario = () => {
    setProducto({
      Nombre_producto: "",
      Descripcion: "",
      Precio_compra: "",
      Precio_venta: "",
      stock: "",
      Stock_minimo_alerta: "",
      id_categoria_fk: "",
      Marca: "",
      Estado: "Activo",
    });
  };

  return (
    <section className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Columna izquierda: título, filtros y tabla */}
        {!mostrarFormulario ? (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold bg-slate-800 p-4 rounded-lg shadow-lg">
              Gestión de productos
            </h2>

            {/* Barra de filtros */}
            <div className="bg-slate-800 p-4 rounded-lg shadow-lg flex flex-col lg:flex-row gap-4">
              <input
                type="text"
                placeholder="Buscar por nombre..."
                className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Todas las categorías</option>
                {CATEGORIAS.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Todos los estados</option>
                {ESTADOS.map((estado) => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>

            {/* Tabla */}
            <div className="bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-hidden">
              <div className="flex justify-between items-center px-6 py-4 bg-slate-700 border-b border-slate-600">
                <p className="text-sm text-slate-400">Productos encontrados: {productos.length}</p>
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(true)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Nuevo
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-700 text-slate-300 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4 text-left">Id producto</th>
                      <th className="px-6 py-4 text-left">Nombre</th>
                      <th className="px-6 py-4 text-left">Descripción</th>
                      <th className="px-6 py-4 text-left">Precio compra</th>
                      <th className="px-6 py-4 text-left">Precio venta</th>
                      <th className="px-6 py-4 text-left">Stock</th>
                      <th className="px-6 py-4 text-left">Stock mínimo</th>
                      <th className="px-6 py-4 text-left">Estado</th>
                      <th className="px-6 py-4 text-left">Marca</th>
                      <th className="px-6 py-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {productos.map((prod, index) => (
                      <tr key={prod.id} className={`${index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-900'} hover:bg-slate-700 transition-colors`}>
                        <td className="px-6 py-4 font-medium">{prod.id}</td>
                        <td className="px-6 py-4">{prod.nombre}</td>
                        <td className="px-6 py-4">{prod.descripcion}</td>
                        <td className="px-6 py-4">{prod.precioCompra}</td>
                        <td className="px-6 py-4 font-medium text-green-400">{prod.precioVenta}</td>
                        <td className="px-6 py-4">{prod.stock}</td>
                        <td className="px-6 py-4 text-yellow-400">{prod.stockMinimo}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            prod.estado === 'Activo' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                            'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}>
                            {prod.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4">{prod.marca}</td>
                        <td className="px-6 py-4 text-center space-x-1">
                          <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors">
                            Editar
                          </button>
                          <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors">
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              <div className="px-6 py-4 bg-slate-850 border-t border-slate-700 flex justify-between items-center">
                <span className="text-sm text-slate-400">Página 1 de 10</span>
                <div className="space-x-2">
                  <button className="px-3 py-1 bg-slate-700 text-slate-300 text-xs rounded hover:bg-slate-600">Anterior</button>
                  <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 font-medium">1</button>
                  <button className="px-3 py-1 bg-slate-700 text-slate-300 text-xs rounded hover:bg-slate-600">Siguiente</button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Formulario overlay */
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl p-8">
              {/* Título + botón X ROJO OSCURO */}
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-slate-100">
                  Registrar producto
                </h3>
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-600/90 hover:bg-red-500 text-white text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  title="Cerrar"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Nombre_producto */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Nombre del producto *
                    </label>
                    <input
                      type="text"
                      name="Nombre_producto"
                      value={producto.Nombre_producto}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Ej: Leche entera"
                      required
                    />
                  </div>

                  {/* Categoría (ahora select) */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Categoría *
                    </label>
                    <select
                      name="id_categoria_fk"
                      value={producto.id_categoria_fk}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Seleccionar categoría</option>
                      {CATEGORIAS.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Marca */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Marca *
                    </label>
                    <input
                      type="text"
                      name="Marca"
                      value={producto.Marca}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: Alpina"
                      required
                    />
                  </div>

                  {/* Estado */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Estado *
                    </label>
                    <select
                      name="Estado"
                      value={producto.Estado}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {ESTADOS.map((estado) => (
                        <option key={estado} value={estado}>{estado}</option>
                      ))}
                    </select>
                  </div>

                  {/* Descripcion */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Descripción
                    </label>
                    <textarea
                      name="Descripcion"
                      value={producto.Descripcion}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                      placeholder="Descripción detallada del producto..."
                    />
                  </div>

                  {/* Precios y Stock */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Precio compra *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="Precio_compra"
                      value={producto.Precio_compra}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Precio venta *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="Precio_venta"
                      value={producto.Precio_venta}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Stock actual *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={producto.stock}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Stock mínimo alerta *
                    </label>
                    <input
                      type="number"
                      name="Stock_minimo_alerta"
                      value={producto.Stock_minimo_alerta}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-3 pt-8 border-t border-slate-700">
                  <button
                    type="button"
                    onClick={limpiarFormulario}
                    className="flex-1 px-6 py-3 bg-slate-700 text-slate-200 text-sm font-medium rounded-xl hover:bg-slate-600 transition-colors"
                  >
                    Limpiar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                  >
                    Guardar producto
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductosPage;