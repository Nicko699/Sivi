import axios from "axios";

const BASE_URL = "http://localhost:8080";

// 🔹 Crear instancia de Axios
const api = axios.create({
  baseURL: BASE_URL,
});

//  Interceptor para añadir el accessToken automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//Refrescar token si el accessToken ha expirado
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    
    if (error.response && error.response.status === 401) {
      // Intentamos refrescar token
      try {

        const refreshToken = localStorage.getItem("refreshToken");
        const refreshTokenId = localStorage.getItem("refreshTokenId");

        if (!refreshToken || !refreshTokenId) {
    throw new Error("No hay refresh token disponible");
}


        // 1️ Pedir nuevo accessToken
        const res = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshTokenId,refreshToken });

        const newAccessToken = res.data.accessToken;

        //Actualizar tokens en localStorage
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshTokenId", res.data.refreshTokenId);
      localStorage.setItem("refreshToken", res.data.refreshToken);

        // 2️ Reintentar la petición original
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(error.config);

      } catch (refreshError) {
        //  Aquí es donde sabemos que el refresh token expiró o es inválido
        console.warn("Refresh token expirado o inválido, cerrar sesión");
        localStorage.clear();
        window.location.href = "/login"; // Redirigir al login
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);


export default api;
