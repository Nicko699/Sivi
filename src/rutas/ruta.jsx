import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "../Principal"; 
import { Login } from "../Login";     
import { Navbar } from "../Navbar"; 

// Componente que define las rutas de la aplicación
export function Ruta() {
  return (
    <Router>
      <Navbar />  {/*Visible en las 2 rutas que hay*/}
      <Routes>
        <Route path="/" element={<Home />} />      {/* Ruta principal */}
        <Route path="/login" element={<Login />} /> {/* Ruta de login */}
      </Routes>
    </Router>
  );
}
