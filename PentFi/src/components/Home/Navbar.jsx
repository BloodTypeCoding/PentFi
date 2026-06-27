import React from "react";
import logoNavbar from "../../Logos/LogoParaNavbar.png";
import defaultUserImage from "../../Logos/defaultUserImage.svg";
import { useState } from "react";
import ThemeToggle from "../ThemeToggle";
export default function Navbar({ name }) {
  return (
    <nav className="navbar flex items-center rounded-2xl bg-base-300 w-full justify-between">
      <label htmlFor="home-drawer" className="btn btn-ghost">
        ☰
      </label>
      <div className="flex-1">
        <img src={logoNavbar} alt="Logo" className="w-36 h-auto select-none" draggable={false} />
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <p className="text-lg font-bold select-none">{name}</p>
        <div className="avatar">
          <div className="w-10 rounded-full border-2 border-primary p-1 select-none">
            <img src={defaultUserImage} alt="User" draggable={false} />
          </div>
        </div>
      </div>
    </nav>
  );
}
