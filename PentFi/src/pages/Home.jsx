import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Home/Navbar";
import AddButton from "../components/Home/CrudDropdown";
import ReportChart from "../components/Home/ReportChart";

function Home() {
  const [userName, setUserName] = useState(
    "Iglesia Pentecostal Unida de Colombia - San José de la Montaña",
  );

  return (
    <div className="drawer min-h-screen">
      <input id="home-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content p-4">
        <Navbar name={userName} />
        <ReportChart />
        <AddButton />
      </div>
      <div className="drawer-side">
        <label htmlFor="home-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <li>
            <a>Home</a>
          </li>
          <li>
            <a>Ingresos</a>
          </li>
          <li>
            <a>Salidas</a>
          </li>
          <li>
            <a>Membresía</a>
          </li>
          <li>
            <a>Libro Diario</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
