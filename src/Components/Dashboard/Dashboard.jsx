import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "../Dashboard/MenuLateral";
import { DashboardHeader } from "./Header";
import { Inicio } from "../Dashboard/Inicio";
import { Ventas } from "../Dashboard/Ventas";
import { Usuarios } from "./ModuloUsuario/Usuarios";
import { CrearUsuario } from "./ModuloUsuario/CrearUsuario";
import { Marcas } from "./ModuloMarca/Marcas";
import { Categorias } from "./ModuloCategoria/Categorias";
import { Productos } from "./ModuloProducto/Productos";
import { Lotes } from "./ModuloLote/Lotes";
import { ProtectedRoute } from "../../Context/Auht/protectedRoute";


export function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Sidebar responsive */}
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col w-full transition-all duration-300">
        {/* Header superior (solo visible en móviles) */}
        <DashboardHeader onMenuClick={() => setMenuOpen(true)} title="Panel principal" />

        {/* Contenido dinámico */}
        <section className="flex-1 pt-16 lg:pt-0">
          <Routes>
            {/* Ruta visible para todos los usuarios autenticados */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Inicio />
                </ProtectedRoute>
              }
            />

            {/* Ruta para ADMIN y VENDEDOR */}
            <Route
              path="ventas"
              element={
                <ProtectedRoute rolesPermitidos={["ROLE_ADMIN", "ROLE_VEND"]}>
                  <Ventas />
                </ProtectedRoute>
              }
            />

            {/* Ruta para ADMIN y VENDEDOR - Productos */}
            <Route
              path="productos"
              element={
                <ProtectedRoute rolesPermitidos={["ROLE_ADMIN", "ROLE_VEND"]}>
                  <Productos />
                </ProtectedRoute>
              }
            />

            {/* Ruta solo para ADMIN - Lotes */}
            <Route
              path="lotes"
              element={
                <ProtectedRoute rolesPermitidos={["ROLE_ADMIN"]}>
                  <Lotes />
                </ProtectedRoute>
              }
            />

            {/* Ruta solo para ADMIN - Usuarios */}
            <Route
              path="usuarios"
              element={
                <ProtectedRoute rolesPermitidos={["ROLE_ADMIN"]}>
                  <Usuarios />
                </ProtectedRoute>
              }
            />

            {/* Ruta solo para ADMIN - Crear usuario */}
            <Route
              path="usuarios/crear"
              element={
                <ProtectedRoute rolesPermitidos={["ROLE_ADMIN"]}>
                  <CrearUsuario />
                </ProtectedRoute>
              }
            />

            {/* Ruta solo para ADMIN - Marcas */}
            <Route
              path="marcas"
              element={
                <ProtectedRoute rolesPermitidos={["ROLE_ADMIN"]}>
                  <Marcas />
                </ProtectedRoute>
              }
            />

             {/* Ruta para ADMIN y VENDEDOR - Categorías */}
            <Route
              path="categorias"
              element={
                <ProtectedRoute rolesPermitidos={["ROLE_ADMIN", "ROLE_VEND"]}>
                  <Categorias />
                </ProtectedRoute>
              }
            />

            {/* Cualquier otra ruta redirige al inicio */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </section>
      </div>
    </main>
  );
}
