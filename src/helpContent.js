/**
 * Contenido de ayuda para cada módulo del sistema.
 *
 * Estructura de cada sección:
 *   icon?       : emoji que acompaña el título
 *   title       : título de la sección
 *   description : texto explicativo
 *   image?      : ruta de imagen (ej. "/assets/help/crear-producto.png")
 *
 * Para agregar imágenes colócalas en public/assets/help/ y referencia
 * la ruta como "/assets/help/nombre-imagen.png".
 */

export const helpContent = {
  // ──────────────────────────────────────────────
  //  MÓDULO PRODUCTOS
  // ──────────────────────────────────────────────
  productos: {
    title: "Guía rápida · Productos",
    sections: [
      {
        icon: "📦",
        title: "¿Qué puedes hacer aquí?",
        description:
          "Este módulo te permite consultar y gestionar todos los productos del inventario. Como administrador puedes crear, editar, desactivar y eliminar productos.",
      },
      {
        icon: "🔍",
        title: "Buscar y filtrar",
        description:
          "Usa la barra de búsqueda para encontrar productos por nombre o código de barras. Filtra también por categoría o por estado (Activo / Inactivo) usando los selectores.",
      },
      {
        icon: "➕",
        title: "Crear un producto (solo Admin)",
        description:
          "Haz clic en el botón verde \"Crear Producto\" para registrar uno nuevo. Deberás indicar nombre, código, categoría, precio de venta, stock mínimo y tipo de venta (Kg o Unidad).",
      },
      {
        icon: "👁️",
        title: "Ver detalles",
        description:
          "El botón verde con ojo abre una vista detallada del producto: descripción completa, imagen, lotes activos y toda su información.",
      },
      {
        icon: "✏️",
        title: "Editar un producto (solo Admin)",
        description:
          "El botón azul con lápiz te permite modificar cualquier campo del producto. Los cambios se guardan inmediatamente.",
      },
      {
        icon: "🗑️",
        title: "Eliminar un producto (solo Admin)",
        description:
          "El botón rojo con papelera elimina el producto. Se mostrará una confirmación antes de proceder. Esta acción no se puede deshacer.",
      },
      {
        icon: "🔴",
        title: "Alerta de stock bajo",
        description:
          "El indicador de stock aparece en rojo cuando el stock actual es menor o igual al stock mínimo configurado. Reabastecer cuanto antes para evitar quiebres.",
      },
    ],
  },

  // ──────────────────────────────────────────────
  //  MÓDULO CATEGORÍAS
  // ──────────────────────────────────────────────
  categorias: {
    title: "Guía rápida · Categorías",
    sections: [
      {
        icon: "🏷️",
        title: "¿Qué son las categorías?",
        description:
          "Las categorías agrupan los productos para facilitar la búsqueda y el reporte. Cada producto pertenece a una categoría.",
      },
      {
        icon: "➕",
        title: "Crear categoría",
        description:
          "Haz clic en \"Nueva Categoría\" e ingresa el nombre. Asegúrate de que sea descriptivo y no dupliques categorías existentes.",
      },
      {
        icon: "✏️",
        title: "Editar categoría",
        description:
          "Cambia el nombre de una categoría existente. Los productos asociados no se verán afectados.",
      },
      {
        icon: "🗑️",
        title: "Eliminar categoría",
        description:
          "Solo puedes eliminar categorías que no tengan productos asignados. Reasigna los productos antes de eliminar.",
      },
    ],
  },

  // ──────────────────────────────────────────────
  //  MÓDULO MARCAS
  // ──────────────────────────────────────────────
  marcas: {
    title: "Guía rápida · Marcas",
    sections: [
      {
        icon: "🏢",
        title: "¿Qué son las marcas?",
        description:
          "Las marcas identifican el fabricante o proveedor de un producto. Se asignan al crear o editar un producto.",
      },
      {
        icon: "➕",
        title: "Crear marca",
        description:
          "Haz clic en \"Nueva Marca\" e ingresa el nombre del fabricante o proveedor.",
      },
      {
        icon: "✏️",
        title: "Editar / Eliminar",
        description:
          "Puedes editar el nombre de una marca o eliminarla si no tiene productos asignados.",
      },
    ],
  },

  // ──────────────────────────────────────────────
  //  MÓDULO LOTES
  // ──────────────────────────────────────────────
  lotes: {
    title: "Guía rápida · Lotes",
    sections: [
      {
        icon: "📋",
        title: "¿Qué es un lote?",
        description:
          "Un lote representa una entrada de mercancía para un producto. Registra la cantidad ingresada, el costo de compra y la fecha de vencimiento.",
      },
      {
        icon: "➕",
        title: "Registrar un lote",
        description:
          "Haz clic en \"Nuevo Lote\", selecciona el producto y completa la cantidad, costo unitario y fecha de vencimiento.",
      },
      {
        icon: "📅",
        title: "Vencimiento",
        description:
          "Los lotes cercanos a vencer aparecen destacados. Revisa periódicamente para evitar pérdidas por productos vencidos.",
      },
    ],
  },

  // ──────────────────────────────────────────────
  //  MÓDULO USUARIOS
  // ──────────────────────────────────────────────
  usuarios: {
    title: "Guía rápida · Usuarios",
    sections: [
      {
        icon: "👤",
        title: "¿Qué puedes hacer aquí?",
        description:
          "Gestiona las cuentas de acceso al sistema. Puedes crear nuevos usuarios, asignarles roles y activar o desactivar su acceso.",
      },
      {
        icon: "🔑",
        title: "Roles disponibles",
        description:
          "Administrador: acceso completo. Vendedor: acceso a ventas y consulta de productos. Los roles determinan qué módulos puede ver cada usuario.",
      },
      {
        icon: "➕",
        title: "Crear usuario",
        description:
          "Haz clic en \"Crear Usuario\", ingresa nombre, correo y contraseña temporal, y asigna el rol correspondiente.",
      },
      {
        icon: "✏️",
        title: "Editar usuario",
        description:
          "Modifica nombre, correo o rol de un usuario existente. También puedes activar o desactivar su cuenta.",
      },
    ],
  },

  // ──────────────────────────────────────────────
  //  MÓDULO VENTAS
  // ──────────────────────────────────────────────
  ventas: {
    title: "Guía rápida · Ventas",
    sections: [
      {
        icon: "🛒",
        title: "¿Cómo registrar una venta?",
        description:
          "Busca el producto por nombre o código, indica la cantidad y agrégalo al carrito. Repite para cada ítem y finaliza con \"Registrar Venta\".",
      },
      {
        icon: "⚖️",
        title: "Venta por peso (kg)",
        description:
          "Para productos vendidos por kilogramo, ingresa el peso exacto en el campo de cantidad. El sistema calcula el total automáticamente.",
      },
      {
        icon: "📊",
        title: "Historial de ventas",
        description:
          "Consulta todas las ventas realizadas, filtra por fecha o vendedor y visualiza el detalle de cada transacción.",
      },
    ],
  },
};
