import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Home/Navbar";
import ThemeToggle from "../ThemeToggle";
import AddButton from "../Home/CrudDropdown";
import defaultUserImage from "../../Logos/defaultUserImage.svg";
import logoNavbar from "../../Logos/LogoParaNavbar.png";
import logo from "../../Logos/IntentoDeLogo.png";
import UserContext from "../../contexts/UserContext";

const DOCK_ITEMS = [
  { to: "/home", label: "Home", icon: "home" },
  { to: "/ingresos", label: "Ingresos", icon: "ingresos" },
  { to: "/salidas", label: "Salidas", icon: "salidas" },
];

function DockIcon({ name }) {
  if (name === "home")
    return (
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    );
  if (name === "ingresos")
    return (
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    );
  if (name === "salidas")
    return (
      <path d="M17 14v-4M7 14v-4M3 10h18M5 10V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
    );
  return null;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-base-200">
      <img src={logo} alt="Logo" className="w-32 h-auto animate-pulse" />
      <div className="flex flex-col items-center gap-2">
        <span className="loading loading-dots loading-lg text-primary" />
        <p className="text-base-content/70 text-sm font-medium">
          Cargando datos de la congregación...
        </p>
      </div>
    </div>
  );
}

export default function AppLayout({ children, activePage = "home" }) {
  const [isLoading, setIsLoading] = useState(true);
  const [denominacion, setDenominacion] = useState("IPUC");
  const [nombreIglesia, setNombreIglesia] = useState(
    "Iglesia Pentecostal Unida de Colombia - San José de la Montaña",
  );
  const [capitalInicial, setCapitalInicial] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadUserData() {
      const start = Date.now();

      try {
        const res = await fetch("/Backend/user_data/user.json");
        const data = await res.json();
        if (!cancelled) {
          setDenominacion(data.denominacion);
          setNombreIglesia(data.nombre_iglesia);
          setCapitalInicial(data.capital_inicial);
        }
      } catch {
        // usa defaults si falla
      }

      const elapsed = Date.now() - start;
      const remaining = 4000 - elapsed;
      if (remaining > 0 && !cancelled)
        await new Promise((r) => setTimeout(r, remaining));

      if (!cancelled) setIsLoading(false);
    }

    loadUserData();
    return () => { cancelled = true; };
  }, []);

  if (isLoading) return <LoadingScreen />;

  return (
    <UserContext value={{ denominacion, nombreIglesia, capitalInicial }}>
      <div className="drawer min-h-screen">
        <input id="app-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content pb-20 lg:pb-4">
          <div className="hidden lg:block">
            <Navbar name={nombreIglesia} denominacion={denominacion} />
          </div>

          <div className="flex lg:hidden items-center justify-between bg-base-300 rounded-2xl p-3 m-4 mb-2">
            <div className="flex items-center gap-3">
              <label htmlFor="app-drawer" className="btn btn-ghost btn-sm">☰</label>
              <img src={logoNavbar} alt="Logo" className="w-28 h-auto select-none" draggable={false} />
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <div className="avatar">
                <div className="w-8 rounded-full border-2 border-primary">
                  <img src={defaultUserImage} alt="User" draggable={false} />
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-sm font-semibold text-base-content/70 lg:hidden px-4 mb-2 truncate">
            {nombreIglesia}
          </p>

          {children}

          <AddButton denominacion={denominacion} />
        </div>

        <div className="drawer-side">
          <label htmlFor="app-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/ingresos">Ingresos</Link></li>
            <li><Link to="/salidas">Salidas</Link></li>
            <li><Link to="/membresia">Membresía</Link></li>
            <li><Link to="/libro-diario">Libro Diario</Link></li>
          </ul>
        </div>

        <div className="dock flex lg:hidden">
          {DOCK_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 py-1${activePage === item.label.toLowerCase() ? " dock-active" : ""}`}
            >
              <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <DockIcon name={item.icon} />
              </svg>
              <span className="dock-label">{item.label}</span>
            </Link>
          ))}
          <label htmlFor="app-drawer" className="flex flex-col items-center gap-0.5 cursor-pointer py-1">
            <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
            <span className="dock-label">Más</span>
          </label>
        </div>
      </div>
    </UserContext>
  );
}
