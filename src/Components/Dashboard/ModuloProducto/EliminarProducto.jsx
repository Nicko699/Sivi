import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { eliminarProducto } from "../../../Services/ProductoServiceP/ProductoService";

const MySwal = withReactContent(Swal);

export async function EliminarProducto(producto, onProductoEliminado) {
  if (!producto) return;

  const result = await MySwal.fire({
    // Título pegado al icono
    title: (
      <span className="text-2xl font-bold text-slate-800 border-none">
        ¿Eliminar producto?
      </span>
    ),
    // Reducimos el margen superior (mt-1) para que esté más cerca del título
    html: (
      <div className="mt-1">
        <p className="text-slate-500 text-lg tracking-tight">
          Estás por eliminar a <span className="font-bold text-slate-900">"{producto.nombre}"</span>
        </p>
      </div>
    ),
    icon: "warning",
    iconColor: "#ef4444",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    reverseButtons: true,
    width: "400px", // Un poco más estrecho para que no se vea tan vacío
    padding: "1.5rem", // Padding interno más ajustado
    customClass: {
      popup: 'rounded-[2rem] bg-white border border-slate-100 shadow-xl',
      confirmButton: 'rounded-xl px-6 py-2.5 text-sm font-bold active:scale-95 transition-all outline-none mx-1',
      cancelButton: 'rounded-xl px-6 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-200 active:scale-95 transition-all outline-none mx-1'
    },
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      try {
        await eliminarProducto(producto.id);
        return true;
      } catch (error) {
        const msg = error.response?.data?.message || error.message || "Error al eliminar";
        MySwal.showValidationMessage(msg);
        return false;
      }
    },
    allowOutsideClick: () => !Swal.isLoading(),
  });

  if (result.isConfirmed) {
    if (onProductoEliminado) onProductoEliminado();

    Swal.fire({
      title: "¡Producto eliminado!",
      text: `"${producto.nombre}" fue eliminado con éxito`,
      icon: "success",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#2563eb",
      timer: 2000,
      timerProgressBar: true,
      customClass: {
        popup: 'rounded-[1.5rem] bg-white shadow-lg',
        confirmButton: 'rounded-xl px-8 py-2 font-bold'
      }
    });
  }
}