import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import { Home } from "../Principal";
import { Login } from "../Login";   
import { ForgotPassword } from "../RecuperarPassword";    
import { Navbar } from "../Navbar"; 
import { ResetPassword } from "../CambiarPassword";

// Componente que define las rutas de la aplicación
export function Ruta() {
  return (
    <Router>
      <Navbar />  {/*Visible en las 2 rutas que hay*/}
      <Routes>
        
        <Route path="/" element={<Home/>}/>      {/* Ruta principal */}
        <Route path="/login" element={<Login />} /> {/* Ruta de login */}
        <Route path="/RecuperarContraseña" element={<ForgotPassword />} /> {/* Ruta de recuperar contraseña */}
        <Route path="/CambiarPassword" element={<ResetPassword />} /> {/* Ruta de cambiar contraseña */}
      </Routes>
    </Router>
  );
}
