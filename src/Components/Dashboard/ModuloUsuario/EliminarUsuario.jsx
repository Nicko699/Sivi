import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { eliminarUsuario } from "../../../Services/UsuarioServiceP/UsuarioService";

const MySwal = withReactContent(Swal);

export async function EliminarUsuario(usuario, onUsuarioEliminado) {
  if (!usuario) return;

  const result = await MySwal.fire({
    title: `<strong>¿Deseas eliminar a ${usuario.nombre}?</strong>`,
    html: `
      <p style="margin: 3px 0 0; font-size: 14px; font-weight: 500; color: #4B5563;">
        ${usuario.correo}
      </p>
      <p style="margin: 6px 0 0; font-weight: 600; color: #B91C1C;">
        Acción irreversible
      </p>
    `,
    icon: "warning",
    iconColor: "#F87171",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#DC2626",
    cancelButtonColor: "#6B7280",
    reverseButtons: true,
    width: "450px",
    padding: "1rem 1.25rem",
    showLoaderOnConfirm: true,

    preConfirm: async () => {
      try {
        await eliminarUsuario(usuario.id);
        return true;
      } catch (error) {
        // Si el backend devuelve mensaje JSON (Spring)
        const backendMessage =
          error.response?.data?.message || error.message || "Error al eliminar el usuario.";
        Swal.showValidationMessage(backendMessage);
        return false;
      }
    },
    allowOutsideClick: () => !Swal.isLoading(),
  });

  if (result.isConfirmed) {
    await MySwal.fire({
      title: "<strong>¡Usuario eliminado!</strong>",
      html: `<p style="font-weight: 500; color: #374151; margin: 0;">${usuario.nombre} fue eliminado del sistema.</p>`,
      icon: "success",
      iconColor: "#22C55E",
      timer: 1500,
      showConfirmButton: false,
      width: "450px",
      padding: "4rem 1rem",
    });

    if (onUsuarioEliminado) onUsuarioEliminado();
  }
}
