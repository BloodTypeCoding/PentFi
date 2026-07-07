import { useState, useEffect } from "react";
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

function groupByMonth(data) {
  const groups = {};
  for (const item of data) {
    const [year, month] = item.fecha.split("-");
    const key = `${year}-${month}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }
  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
}

export default function Salidas() {
  const navigate = useNavigate();
  const [salidas, setSalidas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/Backend/Salidas/salidas.json")
      .then((r) => r.json())
      .then((data) => {
        data.forEach((item, idx) => { item._fileIdx = idx; });
        data.sort((a, b) => b.fecha.localeCompare(a.fecha));
        setSalidas(data);
        setLoading(false);
      });
  }, []);

  const grouped = groupByMonth(salidas);

  return (
    <AppLayout activePage="salidas">
      <div className="px-4 mt-4 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Salidas</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : grouped.length === 0 ? (
          <div className="text-center py-20 text-base-content/50">
            <p className="text-lg font-medium">No hay salidas registradas</p>
            <p className="text-sm mt-1">Usá el botón + para agregar la primera</p>
          </div>
        ) : (
          <div className="space-y-6">
            {grouped.map(([key, items]) => {
              const [year, monthNum] = key.split("-");
              const total = items.reduce((s, i) => s + i.monto, 0);
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold">
                      {meses[parseInt(monthNum, 10) - 1]} {year}
                    </h2>
                    <span className="text-sm font-bold text-error">
                      {formatCurrency(total)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {items.map((item) => (
                      <div
                        key={item._fileIdx}
                        className="flex items-center justify-between bg-base-200 rounded-box px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-base-content/60 w-20 tabular-nums">
                            {item.fecha}
                          </span>
                          <span className="font-medium">{item.categoria}</span>
                        </div>
                        <span className="font-semibold tabular-nums text-sm flex items-center gap-2">
                          {formatCurrency(item.monto)}
                          <button
                            onClick={() => navigate(`/factura/salida-${item._fileIdx}`)}
                            className="btn btn-ghost btn-xs btn-square"
                            title="Imprimir comprobante"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
                              <path d="M6 9V2h12v7" />
                              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                              <path d="M6 14h12v8H6z" />
                            </svg>
                          </button>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
