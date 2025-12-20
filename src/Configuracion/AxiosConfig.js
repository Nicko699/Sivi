import axios from "axios";

let accessToken = null;

// Getters / setters
export const setAxiosAccessToken = (token) => {
  accessToken = token;
};

export const getAxiosAccessToken = () => accessToken;

const BASE_URL = "/api";

// ================================
// 🔹 Instancia solo para refresh
// ================================
const refreshApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// ================================
// 🔹 Instancia principal
// ================================
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// ================================
// 🔹 Interceptor REQUEST
// ================================
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ================================
// 🔹 Interceptor RESPONSE (refresh)
// ================================
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el token expiró y no es un reintento
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      window.dispatchEvent(new Event("refreshStart"));

      try {
        console.log("🔄 Renovando token...");
        const res = await refreshApi.post("/refreshToken/renovarToken");

        const newToken = res.data.accessToken;

        if (!newToken) {
          throw new Error("El backend no envió accessToken en el body");
        }

        setAxiosAccessToken(newToken);

        window.dispatchEvent(
          new CustomEvent("tokenRefreshed", { detail: { token: newToken } })
        );

        processQueue(null, newToken);

        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        console.log("✅ Token renovado correctamente");

        return api(originalRequest);
      } catch (err) {
        console.error("❌ Error en refresh token:", err);
        processQueue(err, null);
        window.dispatchEvent(new Event("tokenRefreshed"));
        cerrarSesion("Error en refresh");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ================================
// 🔹 Cerrar sesión
// ================================
const cerrarSesion = (razon = "desconocida") => {
  console.log("🔒 Cerrando sesión por:", razon);
  setAxiosAccessToken(null);
  window.dispatchEvent(new CustomEvent("logout"));
};

export default api;
