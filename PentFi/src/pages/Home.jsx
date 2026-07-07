import { useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { useUser } from "../contexts/UserContext";
import { useReporteMensual } from "../hooks/useReporteMensual";
import ReportChart from "../components/Home/ReportChart";

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const chartConfig = {
  Ingresos: {
    label: "Ingresos",
    colors: { light: ["#3b82f6"], dark: ["#60a5fa"] },
  },
  Salidas: {
    label: "Salidas",
    colors: { light: ["#10b981"], dark: ["#34d399"] },
  },
  "Diezmo Neto": {
    label: "Diezmo Neto",
    colors: { light: ["#f59e0b"], dark: ["#fbbf24"] },
  },
};

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
}

function HomeContent() {
  const { capitalDisponible } = useUser();
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
  const { reportData, loading } = useReporteMensual(selectedMonth);

  return (
    <div className="px-4">
      <div className="card bg-base-100 shadow-xl mt-2 lg:mt-6">
        <div className="card-body border-b border-base-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-base-content/70 uppercase tracking-wider">Capital Disponible</p>
              <p className="text-3xl font-bold text-success mt-1">{formatCurrency(capitalDisponible)}</p>
            </div>
            <div className="size-12 rounded-full bg-success/10 flex items-center justify-center">
              <svg className="size-6 text-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h2 className="card-title text-2xl font-bold">Reporte General</h2>
            <select
              className="select select-bordered select-sm w-40"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {months.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="w-full lg:w-2/3">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <span className="loading loading-spinner loading-lg text-primary" />
                </div>
              ) : (
                <ReportChart data={reportData} config={chartConfig} />
              )}
            </div>
            <div className="w-full lg:w-1/3 space-y-3">
              {reportData.map((item) => {
                const color = chartConfig[item.concept]?.colors?.light?.[0] ?? "#6b7280";
                return (
                  <div
                    key={item.concept}
                    className="stat bg-base-200 rounded-box p-4 border-l-4"
                    style={{ borderLeftColor: color }}
                  >
                    <div className="stat-title text-base font-medium">{item.concept}</div>
                    <div className="stat-value text-2xl mt-1">{formatCurrency(item.value)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Home() {
  return (
    <AppLayout activePage="home">
      <HomeContent />
    </AppLayout>
  );
}

export default Home;
