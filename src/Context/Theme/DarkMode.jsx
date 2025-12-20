import { useEffect, useState } from "react";

// Obtenemos el valor inicial del tema
const getInitialDark = () => {
  try {
    const stored = localStorage.getItem("theme"); // obtenemos de localStorage
    if (stored === "dark") return true;
    if (stored === "light") return false;
    // obtenemos según preferencia del sistema
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
};

// Hook para modo oscuro
export default function useDarkMode() {
  const [dark, setDark] = useState(getInitialDark);

  // Aplicamos clase y guardamos preferencia
  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark"); // aplicamos dark
      localStorage.setItem("theme", "dark"); // guardamos
    } else {
      root.classList.remove("dark"); // quitamos dark
      localStorage.setItem("theme", "light"); // guardamos
    }
  }, [dark]);

  // Toggleamos el tema
  const toggleDark = () => setDark((d) => !d);

  return [dark, toggleDark];
}
