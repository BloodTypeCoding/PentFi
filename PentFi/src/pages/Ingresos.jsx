import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Home/Navbar";
import defaultUserImage from "../Logos/defaultUserImage.svg";
import logoNavbar from "../Logos/LogoParaNavbar.png";
import ThemeToggle from "../components/ThemeToggle";

export default function Ingresos() {
  return (
    <div className="drawer min-h-screen">
      <input id="app-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content pb-20 lg:pb-4">
        <div className="hidden lg:block">
          <Navbar name="Iglesia Pentecostal Unida de Colombia - San José de la Montaña" />
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

        <div className="px-4 mt-4">
          <h1 className="text-3xl font-bold">Ingresos</h1>
          <p className="text-base-content/70 mt-2">Sección de ingresos — próximamente</p>
        </div>
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
        <Link to="/home" className="flex flex-col items-center gap-0.5 py-1">
          <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="dock-label">Home</span>
        </Link>
        <Link to="/ingresos" className="dock-active flex flex-col items-center gap-0.5 py-1">
          <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <span className="dock-label">Ingresos</span>
        </Link>
        <Link to="/salidas" className="flex flex-col items-center gap-0.5 py-1">
          <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 14v-4M7 14v-4M3 10h18M5 10V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
          </svg>
          <span className="dock-label">Salidas</span>
        </Link>
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
  );
}
