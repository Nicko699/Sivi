import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { eliminarUsuario } from "../../../Services/UsuarioServiceP/UsuarioService";

const MySwal = withReactContent(Swal);

export async function EliminarUsuario(usuario, onUsuarioEliminado) {
  if (!usuario) return;

  const result = await MySwal.fire({
    // Título con formato moderno y consistente
    title: (
      <span className="text-2xl font-bold text-slate-800 border-none">
        ¿Eliminar usuario?
      </span>
    ),
    // Texto descriptivo debajo del título
    html: (
      <div className="mt-1">
        <p className="text-slate-500 text-lg tracking-tight">
          Estás por eliminar a{" "}
          <span className="font-bold text-slate-900">
            "{usuario.nombre}"
          </span>
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
    width: "400px", // Igual al de EliminarMarca
    padding: "1.5rem",
    customClass: {
      popup: 'rounded-[2rem] bg-white border border-slate-100 shadow-xl',
      confirmButton: 'rounded-xl px-6 py-2.5 text-sm font-bold active:scale-95 transition-all outline-none mx-1',
      cancelButton: 'rounded-xl px-6 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-200 active:scale-95 transition-all outline-none mx-1'
    },
    showLoaderOnConfirm: true,

    preConfirm: async () => {
      try {
        await eliminarUsuario(usuario.id);
        return true;
      } catch (error) {
        let backendMessage = "Error al eliminar el usuario.";

        if (error.response) {
          const { status, data } = error.response;
          if (status === 400 && data?.message) {
            backendMessage = data.message;
          } else if (status === 404) {
            backendMessage = data?.message || "Usuario no encontrado o ya eliminado.";
          } else if (status === 401) {
            backendMessage = "No tienes permisos para eliminar este usuario.";
          } else {
            backendMessage = data?.message || error.message || backendMessage;
          }
        } else if (error.message) {
          backendMessage = error.message;
        }

        MySwal.showValidationMessage(backendMessage);
        return false;
      }
    },
    allowOutsideClick: () => !Swal.isLoading(),
  });

  if (result.isConfirmed) {
    if (onUsuarioEliminado) onUsuarioEliminado();

    Swal.fire({
      title: "¡Usuario eliminado!",
      text: `"${usuario.nombre}" fue eliminado con éxito`,
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
