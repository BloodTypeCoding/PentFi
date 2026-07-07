import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
}

function monthKey(fecha) {
  const [y, m] = fecha.split("-");
  return `${y}-${m}`;
}

function monthLabel(key) {
  const [y, m] = key.split("-");
  return `${meses[parseInt(m, 10) - 1]} ${y}`;
}

export default function LibroDiario() {
  const navigate = useNavigate();
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("todos");

  const mesesDisponibles = useMemo(() => {
    const keys = [...new Set(movimientos.map((m) => monthKey(m.fecha)))];
    return keys.sort((a, b) => b.localeCompare(a));
  }, [movimientos]);

  const movimientosFiltrados = useMemo(() => {
    if (selectedMonth === "todos") return movimientos;
    return movimientos.filter((m) => monthKey(m.fecha) === selectedMonth);
  }, [movimientos, selectedMonth]);

  useEffect(() => {
    async function load() {
      const [ingresos, salidas, diezmos] = await Promise.all([
        fetch("/Backend/Ingresos/ingresos.json").then((r) => r.json()),
        fetch("/Backend/Salidas/salidas.json").then((r) => r.json()),
        fetch("/Backend/Diezmo_Neto/diezmo_neto.json").then((r) => r.json()),
      ]);

      const todos = [
        ...ingresos.map((i, idx) => ({ ...i, tipo: "Ingreso", signo: 1, facturaId: `ingreso-${idx}` })),
        ...salidas.map((i, idx) => ({ ...i, tipo: "Salida", signo: -1, categoria: i.categoria, facturaId: `salida-${idx}` })),
        ...diezmos.map((i, idx) => ({ ...i, tipo: "Diezmo Neto", signo: 1, categoria: "Diezmo Neto", facturaId: `diezmo-${idx}` })),
      ];

      todos.sort((a, b) => a.fecha.localeCompare(b.fecha));

      let capital = 0;
      const conSaldo = todos.map((item) => {
        capital += item.monto * item.signo;
        return { ...item, capitalTotal: capital };
      });

      setMovimientos(conSaldo.reverse());
      setLoading(false);
    }

    load();
  }, []);

  return (
    <AppLayout activePage="libro-diario">
      <div className="px-4 mt-4 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Libro Diario</h1>
          {!loading && movimientos.length > 0 && (
            <div className="flex items-center gap-2">
              <select
                className="select select-bordered select-sm w-44"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="todos">Todos los meses</option>
                {mesesDisponibles.map((key) => (
                  <option key={key} value={key}>{monthLabel(key)}</option>
                ))}
              </select>
              {selectedMonth !== "todos" && (
                <button
                  onClick={() => navigate(`/factura/libro-${selectedMonth}`)}
                  className="btn btn-ghost btn-sm btn-square"
                  title="Imprimir libro del mes"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
                    <path d="M6 9V2h12v7" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <path d="M6 14h12v8H6z" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : movimientos.length === 0 ? (
          <div className="text-center py-20 text-base-content/50">
            <p className="text-lg font-medium">No hay movimientos registrados</p>
            <p className="text-sm mt-1">Los movimientos aparecerán aquí cuando registres ingresos, salidas o diezmos</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zinc w-full">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Categoría</th>
                  <th className="text-right">Monto</th>
                  <th className="text-right">Capital Total</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {movimientosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-base-content/50">
                      No hay movimientos en este mes
                    </td>
                  </tr>
                ) : (
                  movimientosFiltrados.map((item, idx) => (
                    <tr key={idx}>
                      <td className="text-sm text-base-content/60 tabular-nums">
                        {item.fecha}
                      </td>
                      <td className="font-medium">{item.categoria}</td>
                      <td
                        className={`text-right tabular-nums font-semibold ${item.signo > 0 ? "text-success" : "text-error"}`}
                      >
                        {item.signo > 0 ? "+" : "-"}
                        {formatCurrency(Math.abs(item.monto))}
                      </td>
                      <td className="text-right tabular-nums font-semibold">
                        {formatCurrency(item.capitalTotal)}
                      </td>
                      <td>
                        <button
                          onClick={() => navigate(`/factura/${item.facturaId}`)}
                          className="btn btn-ghost btn-xs btn-square"
                          title="Imprimir comprobante"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
                            <path d="M6 9V2h12v7" />
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                            <path d="M6 14h12v8H6z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
