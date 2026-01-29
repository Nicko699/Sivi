import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { eliminarCategoria } from "../../../Services/CategoriaServiceP/CategoriaService";

const MySwal = withReactContent(Swal);

export async function EliminarCategoria(categoria, onCategoriaEliminada) {
  if (!categoria) return;

  const result = await MySwal.fire({
    title: (
      <span className="text-2xl font-bold text-slate-800 border-none">
        ¿Eliminar categoria?
      </span>
    ),
    html: (
      <div className="mt-1">
        <p className="text-slate-500 text-lg tracking-tight">
          Estás por eliminar a <span className="font-bold text-slate-900">"{categoria.nombre}"</span>
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
    width: "400px",
    padding: "1.5rem",
    customClass: {
      popup: 'rounded-[2rem] bg-white border border-slate-100 shadow-xl',
      confirmButton: 'rounded-xl px-6 py-2.5 text-sm font-bold active:scale-95 transition-all outline-none mx-1',
      cancelButton: 'rounded-xl px-6 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-200 active:scale-95 transition-all outline-none mx-1'
    },
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      try {
        await eliminarCategoria(categoria.id);
        return { success: true }; // ✅ Retorna objeto con éxito
      } catch (error) {
        // ✅ Ahora el mensaje viene del error.message (lanzado en el servicio)
        const msg = error.message || "Error al eliminar";
        MySwal.showValidationMessage(msg); // ✅ Muestra el error
        return false; // ✅ Evita que cierre el modal
      }
    },
    allowOutsideClick: () => !Swal.isLoading(),
  });

  // ✅ Solo si fue confirmado Y el preConfirm retornó success
  if (result.isConfirmed && result.value?.success) {
    if (onCategoriaEliminada) onCategoriaEliminada();

    Swal.fire({
      title: "¡Categoria eliminada!",
      text: `"${categoria.nombre}" fue eliminada con éxito`,
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