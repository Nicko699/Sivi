import api from "../../Configuracion/AxiosConfigPublic";

export async function cambiarContrasena({
  resetTokenId,
  resetToken,
  password,
}) {
  try {
    const res = await api.post("/resetToken/cambiarContraseña", {
      resetTokenId,
      resetToken,
      password,
    });
    return res.data;
  } catch (error) {
    const status = error.response?.status;
    const mensaje = error.response?.data?.mensaje;

    let errorMsg = "No se pudo cambiar la contraseña. Intenta nuevamente.";

    if (status === 400) {
      switch (mensaje) {
        case "El token ya se ha usado":
          errorMsg = "Este enlace ya fue utilizado para cambiar la contraseña.";
          break;
        case "Token caducado":
          errorMsg = "El enlace ha expirado. Solicita uno nuevo.";
          break;
        case "El token de restablecimiento no coincide o es inválido.":
          errorMsg =
            "El enlace es inválido o está dañado. Verifica el correo recibido.";
          break;
        default:
          errorMsg = mensaje;
      }
    } else if (status === 404) {
      errorMsg =
        "No se encontró el enlace de restablecimiento. Solicita uno nuevo.";
    }

    throw new Error(errorMsg);
  }
}
