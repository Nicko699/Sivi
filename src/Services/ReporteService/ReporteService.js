import api from "../../Configuracion/AxiosConfig";

export const obtenerTotalVentasHoy = async () => {
    const res = await api.get("/reportes/ventas-hoy"); 
    return res.data;
};

export const obtenerVentasPorRango = async (inicio, fin) => {
    const res = await api.get(`/reportes/ventas-rango?inicio=${inicio}&fin=${fin}`);
    return res.data;
};