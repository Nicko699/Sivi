import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { eliminarMarca } from "../../../Services/MarcaServiceP/MarcaService";

const MySwal = withReactContent(Swal);

export async function EliminarMarca(marca, onMarcaEliminada) {
  if (!marca) return;

  const result = await MySwal.fire({
    title: `<strong>¿Deseas eliminar la marca "${marca.nombre}"?</strong>`,
    html: `
      <p style="margin: 3px 0 0; font-size: 16px; font-weight: 400; color: #6B7280;">
        ${marca.descripcion || 'Sin descripción'}
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
        await eliminarMarca(marca.id);
        return true;
      } catch (error) {
        const backendMessage =
          error.response?.data?.message || 
          error.response?.data?.mensaje || 
          error.message || 
          "Error al eliminar la marca.";
        Swal.showValidationMessage(backendMessage);
        return false;
      }
    },
    allowOutsideClick: () => !Swal.isLoading(),
  });

  if (result.isConfirmed) {
    if (onMarcaEliminada) onMarcaEliminada();

    Swal.fire({
      title: "¡Marca eliminada!",
      text: `La marca "${marca.nombre}" fue eliminada del sistema`,
      icon: "success",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#2563eb",
      timer: 3000,
      timerProgressBar: true,
    });
  }
}