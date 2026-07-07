import { useState, useEffect } from "react";

const meses = {
  Enero: 1, Febrero: 2, Marzo: 3, Abril: 4, Mayo: 5, Junio: 6,
  Julio: 7, Agosto: 8, Septiembre: 9, Octubre: 10, Noviembre: 11, Diciembre: 12,
};

function sumarPorMes(data, mesNum) {
  return data
    .filter((item) => {
      const [, month] = item.fecha.split("-");
      return parseInt(month, 10) === mesNum;
    })
    .reduce((acc, item) => acc + item.monto, 0);
}

export function useReporteMensual(mes) {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mesNum = meses[mes];
    if (!mesNum) {
      setReportData([
        { concept: "Ingresos", value: 0 },
        { concept: "Salidas", value: 0 },
        { concept: "Diezmo Neto", value: 0 },
      ]);
      setLoading(false);
      return;
    }

    async function load() {
      const [ingresos, salidas, diezmos] = await Promise.all([
        fetch("/Backend/Ingresos/ingresos.json").then((r) => r.json()),
        fetch("/Backend/Salidas/salidas.json").then((r) => r.json()),
        fetch("/Backend/Diezmo_Neto/diezmo_neto.json").then((r) => r.json()),
      ]);

      setReportData([
        { concept: "Ingresos", value: sumarPorMes(ingresos, mesNum) },
        { concept: "Salidas", value: sumarPorMes(salidas, mesNum) },
        { concept: "Diezmo Neto", value: sumarPorMes(diezmos, mesNum) },
      ]);
      setLoading(false);
    }

    load();
  }, [mes]);

  return { reportData, loading };
}
