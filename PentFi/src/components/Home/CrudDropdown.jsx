import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import plus_icon from "../../assets/Icons/homeIcons/plus_icon.png";
import income_icon from "../../assets/Icons/homeIcons/income_icon.svg";
import expense_icon from "../../assets/Icons/homeIcons/expense_icon.svg";
import category_icon from "../../assets/Icons/homeIcons/category_icon.svg";
import edit_icon from "../../assets/Icons/homeIcons/edit_icon.svg";
import Diezmo_icon from "../../assets/Icons/homeIcons/Diezmo_icon.svg";

export default function CrudDropdown({ denominacion = "IPUC" }) {
  const { refreshUser } = useUser();
  const diezmoRef = useRef(null);
  const ingresoRef = useRef(null);
  const salidaRef = useRef(null);
  const categoriaRef = useRef(null);
  const [fecha, setFecha] = useState("");
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [salidaFecha, setSalidaFecha] = useState("");
  const [salidaCategoria, setSalidaCategoria] = useState("");
  const [salidaCantidad, setSalidaCantidad] = useState("");
  const [categoriaTipo, setCategoriaTipo] = useState("");
  const [categoriaNombre, setCategoriaNombre] = useState("");

  function openDiezmoModal() {
    setFecha("");
    setMonto("");
    diezmoRef.current?.showModal();
  }

  function closeDiezmoModal() {
    diezmoRef.current?.close();
  }

  async function handleDiezmoSubmit(e) {
    e.preventDefault();
    const montoTotal = Number(monto);
    const montoNeto = montoTotal * (0.21 + 0.028);

    await Promise.all([
      fetch("/Backend/Diezmo_Neto/diezmo_neto.json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fecha, monto: montoNeto }),
      }),
      fetch("/Backend/user_data/user.json")
        .then((r) => r.json())
        .then((user) => {
          user.capital_disponible += montoNeto;
          return fetch("/Backend/user_data/user.json", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
          });
        }),
    ]);

    refreshUser();
    closeDiezmoModal();
  }

  function openIngresoModal() {
    setCategoria("");
    setCantidad("");
    ingresoRef.current?.showModal();
  }

  function closeIngresoModal() {
    ingresoRef.current?.close();
  }

  function handleIngresoSubmit(e) {
    e.preventDefault();
    console.log({ tipo: "ingreso", denominacion, categoria, cantidad });
    closeIngresoModal();
  }

  function openSalidaModal() {
    setSalidaFecha("");
    setSalidaCategoria("");
    setSalidaCantidad("");
    salidaRef.current?.showModal();
  }

  function closeSalidaModal() {
    salidaRef.current?.close();
  }

  function handleSalidaSubmit(e) {
    e.preventDefault();
    console.log({ tipo: "salida", denominacion, categoria: salidaCategoria, cantidad: salidaCantidad });
    closeSalidaModal();
  }

  function openCategoriaModal() {
    setCategoriaTipo("");
    setCategoriaNombre("");
    categoriaRef.current?.showModal();
  }

  function closeCategoriaModal() {
    categoriaRef.current?.close();
  }

  function handleCategoriaSubmit(e) {
    e.preventDefault();
    console.log({ tipo: "categoria", denominacion, tipo: categoriaTipo, nombre: categoriaNombre });
    closeCategoriaModal();
  }

  return (
    <>
      <dialog ref={diezmoRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Registro de Diezmo
            <span className="badge badge-soft badge-primary ml-2">
              {denominacion}
            </span>
          </h3>
          <form onSubmit={handleDiezmoSubmit} className="space-y-4 mt-4">
            <label className="form-control w-full">
              <span className="label-text font-medium">Fecha</span>
              <input
                type="date"
                className="input input-bordered w-full"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text font-medium">
                Monto total (Alfolí)
              </span>
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="0"
                min="0"
                step="1"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                required
              />
            </label>
            {denominacion === "IPUC" && (
              <div className="flex flex-col gap-2 p-3 bg-base-200 rounded-box">
                <p className="text-sm font-semibold text-base-content/70 uppercase tracking-wider">
                  Desglose IPUC
                </p>
                <div className="flex justify-between text-sm">
                  <span>21 % (Obra Nacional)</span>
                  <span className="font-semibold tabular-nums">
                    ${(Number(monto) * 0.21).toLocaleString("es-CO")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>2.8 % (Obra Local)</span>
                  <span className="font-semibold tabular-nums">
                    ${(Number(monto) * 0.028).toLocaleString("es-CO")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total a Fondo</span>
                  <span className="font-semibold tabular-nums">
                    $
                    {(
                      Number(monto) * 0.028 +
                      Number(monto) * 0.21
                    ).toLocaleString("es-CO")}
                  </span>
                </div>
              </div>
            )}
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Guardar
              </button>
              <button type="button" className="btn" onClick={closeDiezmoModal}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={closeDiezmoModal}>
            close
          </button>
        </form>
      </dialog>

      <dialog ref={ingresoRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Nuevo Ingreso
            <span className="badge badge-soft badge-primary ml-2">
              {denominacion}
            </span>
          </h3>
          <form onSubmit={handleIngresoSubmit} className="space-y-4 mt-4">
            <label className="form-control w-full">
              <span className="label-text font-medium">Fecha</span>
              <input
                type="date"
                className="input input-bordered w-full"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text font-medium">
                Categoría de Ingreso
              </span>
              <select
                className="select select-bordered w-full"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                required
              >
                <option value="" disabled>
                  Seleccioná una categoría
                </option>
                <option value="Culto de Jovenes">Culto de Jóvenes</option>
                <option value="Culto de Dorcas">Culto de Dorcas</option>
                <option value="Dominical">Dominical</option>
              </select>
            </label>
            <label className="form-control w-full">
              <span className="label-text font-medium">Cantidad</span>
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="0"
                min="0"
                step="1"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                required
              />
            </label>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Guardar
              </button>
              <button type="button" className="btn" onClick={closeIngresoModal}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={closeIngresoModal}>
            close
          </button>
        </form>
      </dialog>

      <dialog ref={salidaRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Nueva Salida
            <span className="badge badge-soft badge-primary ml-2">
              {denominacion}
            </span>
          </h3>
          <form onSubmit={handleSalidaSubmit} className="space-y-4 mt-4">
            <label className="form-control w-full">
              <span className="label-text font-medium">Fecha</span>
              <input
                type="date"
                className="input input-bordered w-full"
                value={salidaFecha}
                onChange={(e) => setSalidaFecha(e.target.value)}
                required
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text font-medium">
                Categoría de Salida
              </span>
              <select
                className="select select-bordered w-full"
                value={salidaCategoria}
                onChange={(e) => setSalidaCategoria(e.target.value)}
                required
              >
                <option value="" disabled>
                  Seleccioná una categoría
                </option>
                <option value="Servicios">Servicios</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Ofrendas">Ofrendas</option>
              </select>
            </label>
            <label className="form-control w-full">
              <span className="label-text font-medium">Cantidad</span>
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="0"
                min="0"
                step="1"
                value={salidaCantidad}
                onChange={(e) => setSalidaCantidad(e.target.value)}
                required
              />
            </label>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Guardar
              </button>
              <button type="button" className="btn" onClick={closeSalidaModal}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={closeSalidaModal}>
            close
          </button>
        </form>
      </dialog>

      <dialog ref={categoriaRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Nueva Categoría
            <span className="badge badge-soft badge-primary ml-2">
              {denominacion}
            </span>
          </h3>
          <form onSubmit={handleCategoriaSubmit} className="space-y-4 mt-4">
            <label className="form-control w-full">
              <span className="label-text font-medium">Tipo de Categoría</span>
              <select
                className="select select-bordered w-full"
                value={categoriaTipo}
                onChange={(e) => setCategoriaTipo(e.target.value)}
                required
              >
                <option value="" disabled>
                  Seleccioná un tipo
                </option>
                <option value="Ingreso">Ingreso</option>
                <option value="Salida">Salida</option>
              </select>
            </label>
            <label className="form-control w-full">
              <span className="label-text font-medium">Nombre de la categoría</span>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Ej: Diezmo, Ofrendas..."
                value={categoriaNombre}
                onChange={(e) => setCategoriaNombre(e.target.value)}
                required
              />
            </label>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Guardar
              </button>
              <button type="button" className="btn" onClick={closeCategoriaModal}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={closeCategoriaModal}>
            close
          </button>
        </form>
      </dialog>

      <div className="dropdown dropdown-top dropdown-end fixed bottom-4 right-4 btn rounded-full btn-primary">
        <div tabIndex={0} role="button" className="btn btn-primary  m-1">
          <img src={plus_icon} alt="Plus Icon" className="w-6 h-6" />
        </div>
        <ul
          tabIndex="-1"
          className="dropdown-content menu bg-base-100 text-base-content rounded-box z-1 w-45 p-2 shadow-sm"
        >
          <li>
            <a onClick={openDiezmoModal}>
              <img
                src={Diezmo_icon}
                alt="Diezmo Icon"
                className="w-5 h-5 ml-2"
              ></img>
              Registro Diezmo
            </a>
          </li>
          <li>
            <a onClick={openIngresoModal}>
              <img
                src={income_icon}
                alt="Income Icon"
                className="w-5 h-5 ml-2"
              />
              Nuevo Ingreso
            </a>
          </li>
          <li>
            <a onClick={openSalidaModal}>
              <img
                src={expense_icon}
                alt="Expense Icon"
                className="w-5 h-5 ml-2"
              ></img>
              Nueva Salida
            </a>
          </li>
          <li>
            <a onClick={openCategoriaModal}>
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
    </>
  );
}
