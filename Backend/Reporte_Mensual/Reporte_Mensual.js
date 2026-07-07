const fs = require("fs");
const path = require("path");

const ingresos = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../Ingresos/ingresos.json"), "utf-8")
);
const salidas = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../Salidas/salidas.json"), "utf-8")
);
const diezmos = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../Diezmo_Neto/diezmo_neto.json"), "utf-8")
);

const meses = {
  Enero: 1, Febrero: 2, Marzo: 3, Abril: 4, Mayo: 5, Junio: 6,
  Julio: 7, Agosto: 8, Septiembre: 9, Octubre: 10, Noviembre: 11, Diciembre: 12,
};

function obtenerReporteMensual(mes) {
  const mesNum = meses[mes];
  if (!mesNum) return { totalIngresos: 0, totalSalidas: 0, totalDiezmos: 0 };

  function sumarPorMes(data) {
    return data
      .filter((item) => {
        const [, month] = item.fecha.split("-");
        return parseInt(month, 10) === mesNum;
      })
      .reduce((acc, item) => acc + item.monto, 0);
  }

  const totalIngresos = sumarPorMes(ingresos);
  const totalSalidas = sumarPorMes(salidas);
  const totalDiezmos = sumarPorMes(diezmos);

  return { totalIngresos, totalSalidas, totalDiezmos };
}

module.exports = { ingresos, salidas, diezmos, obtenerReporteMensual };
