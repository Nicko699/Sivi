
import { StrictMode } from 'react'; 
// StrictMode es solo para desarrollo, nos ayuda a detectar errores y malas prácticas
import { createRoot } from 'react-dom/client'; 
// createRoot nos ayuda a  montar nuestra app en el DOM

import './index.css'; 
// importamos los estilos de tailwind desde la carpeta index.css

import { ToastContainer } from "react-toastify"; // <-- esto faltaba
import "react-toastify/dist/ReactToastify.css";

import { Ruta } from "./rutas/ruta.jsx"; 
// Importamos la carpeta que maneja las rutas

// Buscamos en el HTML el div donde React va a poner toda la app
const root = createRoot(document.getElementById('root'));

// Ahora le decimos a React que renderice nuestra app
root.render(
  <StrictMode>
    <Ruta /> 
    <ToastContainer position="top-right" autoClose={4000}/>
  </StrictMode>
);