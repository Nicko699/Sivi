import api from "../../Configuracion/AxiosConfigPublic";

export async function enviarCorreoRecuperacion(correo) {
  try {
    const res = await api.post(
      "/resetToken/recuperarContraseña",
      { correo }
    );
    return res.data;
  } catch (error) {
    const mensaje =
      error.response?.data?.mensaje ||
      "No se pudo procesar la solicitud. Intenta más tarde.";
    throw new Error(mensaje);
  }
}
