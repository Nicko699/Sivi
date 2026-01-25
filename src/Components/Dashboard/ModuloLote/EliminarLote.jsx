import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { eliminarLote } from "../../../Services/LoteServiceP/LoteService";

const MySwal = withReactContent(Swal);

export async function EliminarLote(lote, onLoteEliminado) {
  if (!lote) return;

  const result = await MySwal.fire({
    title: (
      <span className="text-2xl font-bold text-slate-800 border-none">
        ¿Eliminar este lote?
      </span>
    ),
    html: (
      <div className="mt-1">
        <p className="text-slate-600 text-base leading-snug">
          Estás a punto de eliminar el lote asociado al producto{" "}
          <span className="font-semibold text-slate-900">
            {lote.producto?.nombre || "producto desconocido"}
          </span>{" "}
          {lote.producto?.marca?.nombre && (
            <span className="font-medium text-slate-700">
              (Marca: {lote.producto.marca.nombre})
            </span>
          )}
          .
        </p>
        <p className="text-slate-500 text-sm mt-2">
          <span className="font-medium">Código del lote:</span>{" "}
          {lote.codigoLote || lote.numeroLote || `#${lote.id}`}
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
    width: "420px",
    padding: "1.5rem",
    customClass: {
      popup: "rounded-[2rem] bg-white border border-slate-100 shadow-xl",
      confirmButton:
        "rounded-xl px-6 py-2.5 text-sm font-bold active:scale-95 transition-all outline-none mx-1",
      cancelButton:
        "rounded-xl px-6 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-200 active:scale-95 transition-all outline-none mx-1",
    },
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      try {
        await eliminarLote(lote.id);
        return true;
      } catch (error) {
        const msg = error.message || "Error al eliminar el lote";
        MySwal.showValidationMessage(msg);
        return false;
      }
    },
    allowOutsideClick: () => !Swal.isLoading(),
  });

  if (result.isConfirmed) {
    onLoteEliminado?.();

    Swal.fire({
      title: "¡Lote eliminado!",
      text: `El lote del producto "${lote.producto?.nombre || "sin nombre"}"${
        lote.producto?.marca?.nombre ? ` (Marca: ${lote.producto.marca.nombre})` : ""
      } fue eliminado con éxito.`,
      icon: "success",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#2563eb",
      timer: 2000,
      timerProgressBar: true,
      customClass: {
        popup: "rounded-[1.5rem] bg-white shadow-lg",
        confirmButton: "rounded-xl px-8 py-2 font-bold",
      },
    });
  }
}
