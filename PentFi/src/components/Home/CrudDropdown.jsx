import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import plus_icon from "../../assets/Icons/plus_icon.png";
import income_icon from "../../assets/Icons/income_icon.svg";
import expense_icon from "../../assets/Icons/expense_icon.svg";
import category_icon from "../../assets/Icons/category_icon.svg";
import edit_icon from "../../assets/Icons/edit_icon.svg";

export default function CrudDropdown() {
  return (
    <div className="dropdown dropdown-top dropdown-end fixed bottom-4 right-4 btn rounded-full btn-primary">
      <div tabIndex={0} role="button" className="btn btn-primary  m-1">
        <img src={plus_icon} alt="Plus Icon" className="w-6 h-6" />
      </div>
      <ul
        tabIndex="-1"
        className="dropdown-content menu bg-base-100 text-base-content rounded-box z-1 w-45 p-2 shadow-sm"
      >
        <li>
          <a>
            <img src={income_icon} alt="Income Icon" className="w-5 h-5 ml-2" />
            Nuevo Ingreso
          </a>
        </li>
        <li>
          <a>
            <img
              src={expense_icon}
              alt="Expense Icon"
              className="w-5 h-5 ml-2"
            ></img>
            Nueva Salida
          </a>
        </li>
        <li>
          <a>
            <img
              src={category_icon}
              alt="Category Icon"
              className="w-5 h-5 ml-2"
            ></img>
            Nueva Categoría
          </a>
        </li>
        <li>
          <a>
            <img
              src={edit_icon}
              alt="Edit Icon"
              className="w-5 h-5 ml-2"
            ></img>
            Editar ingreso/salida
          </a>
        </li>
      </ul>
    </div>
  );
}
