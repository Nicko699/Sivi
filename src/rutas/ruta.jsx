import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "../Components/Auth/Principal";
import { Login } from "../Components/Auth/Login";
import { ForgotPassword } from "../Components/Auth/RecuperarPassword";
import { Navbar } from "../Components/Navigation/Navbar";
import { ResetPassword } from "../Components/Auth/CambiarPassword";
import { Dashboard } from "../Components/Dashboard/Dashboard";
import { AccessTokenProvider } from "../Context/Auht/AccessTokenProvider";
import { ProtectedRoute } from "../Context/Auht/protectedRoute"; // ✅ Importa esto

// Componente que define las rutas de la aplicación
export function Ruta() {
  return (
    <AccessTokenProvider>
      <Router>
        <Routes>
          {/* 🌐 Rutas públicas */}
          <Route path="/" element={<><Navbar /><Home /></>} />
          <Route path="/login" element={<><Navbar /><Login /></>} />
          <Route path="/RecuperarContraseña" element={<><Navbar /><ForgotPassword /></>} />
          <Route path="/CambiarPassword" element={<><Navbar /><ResetPassword /></>} />

          {/* 🔒 Dashboard protegido */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AccessTokenProvider>
  );
}
