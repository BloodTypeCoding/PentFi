import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FacturaHeader from "../components/Factura/FacturaHeader";
import FacturaTable from "../components/Factura/FacturaTable";
import FacturaFooter from "../components/Factura/FacturaFooter";

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

function parseId(id) {
  if (id.startsWith("libro-")) {
    const parts = id.split("-");
    return { tipo: "libro", year: parts[1], month: parts[2] };
  }
  const idx = id.lastIndexOf("-");
  const tipo = id.slice(0, idx);
  const index = parseInt(id.slice(idx + 1), 10);
  return { tipo, index };
}

const PREFIJOS = { ingreso: "ING", salida: "SAL", diezmo: "DIE" };
const TITULOS = {
  ingreso: "Comprobante de Ingreso",
  salida: "Comprobante de Salida",
  diezmo: "Comprobante de Diezmo Neto",
  libro: "Libro Diario Mensual",
};

export default function FacturaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [iglesia, setIglesia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const parsed = parseId(id);
      const userRes = await fetch("/Backend/user_data/user.json");
      const user = await userRes.json();
      setIglesia(user);

      if (parsed.tipo === "libro") {
        const [ingresos, salidas, diezmos] = await Promise.all([
          fetch("/Backend/Ingresos/ingresos.json").then((r) => r.json()),
          fetch("/Backend/Salidas/salidas.json").then((r) => r.json()),
          fetch("/Backend/Diezmo_Neto/diezmo_neto.json").then((r) => r.json()),
        ]);

        const mesKey = `${parsed.year}-${parsed.month}`;

        const todos = [
          ...ingresos
            .filter((i) => i.fecha.startsWith(mesKey))
            .map((i) => ({ ...i, tipo: "Ingreso", signo: 1 })),
          ...salidas
            .filter((i) => i.fecha.startsWith(mesKey))
            .map((i) => ({ ...i, tipo: "Salida", signo: -1 })),
          ...diezmos
            .filter((i) => i.fecha.startsWith(mesKey))
            .map((i) => ({ ...i, tipo: "Diezmo Neto", signo: 1, categoria: "Diezmo Neto" })),
        ];

        todos.sort((a, b) => a.fecha.localeCompare(b.fecha));

        let capital = 0;
        const conSaldo = todos.map((item) => {
          capital += item.monto * item.signo;
          return { ...item, capitalTotal: capital };
        });

        setData({ tipo: "libro", items: conSaldo });
      } else {
        let json, list;
        if (parsed.tipo === "ingreso") {
          json = await fetch("/Backend/Ingresos/ingresos.json").then((r) => r.json());
          list = json;
        } else if (parsed.tipo === "salida") {
          json = await fetch("/Backend/Salidas/salidas.json").then((r) => r.json());
          list = json;
        } else {
          json = await fetch("/Backend/Diezmo_Neto/diezmo_neto.json").then((r) => r.json());
          list = json;
        }

        const item = list[parsed.index];
        if (!item) throw new Error("Item no encontrado");

        setData({
          tipo: parsed.tipo,
          item,
          index: parsed.index,
          prefijo: PREFIJOS[parsed.tipo],
        });
      }

      setLoading(false);
    }

    load().catch(() => navigate(-1));
  }, [id, navigate]);

  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      window.print();
    }, 500);

    const onAfterPrint = () => navigate(-1);
    window.addEventListener("afterprint", onAfterPrint);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("afterprint", onAfterPrint);
    };
  }, [loading, navigate]);

  if (loading) return null;

  const numeroFactura = data.tipo === "libro"
    ? `LD-${data.items.length > 0 ? data.items[0].fecha.slice(0, 7).replace("-", "") : ""}`
    : `${data.prefijo}-${String(data.index + 1).padStart(4, "0")}`;

  const titulo = TITULOS[data.tipo];
  const fecha = data.tipo === "libro"
    ? `${meses[parseInt(data.items[0]?.fecha.split("-")[1], 10) - 1] || ""} ${data.items[0]?.fecha.split("-")[0] || ""}`
    : data.item.fecha;

  const columnas = data.tipo === "libro"
    ? [
        { key: "fecha", label: "Fecha" },
        { key: "categoria", label: "Categoría" },
        { key: "monto", label: "Monto", align: "text-right", render: (i) => `${i.signo > 0 ? "+" : "-"}${formatCurrency(Math.abs(i.monto))}` },
        { key: "capital", label: "Capital Total", align: "text-right", render: (i) => formatCurrency(i.capitalTotal) },
      ]
    : [
        { key: "fecha", label: "Fecha" },
        { key: "categoria", label: "Categoría", render: (i) => i.categoria || (data.tipo === "diezmo" ? "Diezmo Neto" : "-") },
        { key: "monto", label: "Monto", align: "text-right", render: (i) => formatCurrency(i.monto) },
      ];

  const total = data.tipo === "libro"
    ? data.items.reduce((s, i) => s + i.monto * i.signo, 0)
    : data.item.monto;

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-8 print:bg-white print:py-0">
      <div className="bg-white shadow-lg p-8 w-full max-w-[210mm] min-h-[297mm] print:shadow-none print:p-6 print:m-0 print:w-auto print:min-h-0">
        <FacturaHeader
          titulo={titulo}
          numeroFactura={numeroFactura}
          fecha={fecha}
          iglesia={iglesia}
        />

        {data.tipo === "libro" && data.items.length > 0 ? (
          <>
            <p className="text-xs mb-3 text-gray-600">
              Movimientos del mes de {fecha}
            </p>
            <FacturaTable
              items={data.items}
              columnas={columnas}
            />
            <FacturaFooter
              label="Capital del Mes"
              total={formatCurrency(total)}
            />
          </>
        ) : data.tipo !== "libro" ? (
          <>
            <FacturaTable
              items={[data.item]}
              columnas={columnas}
            />
            <FacturaFooter total={formatCurrency(total)} />
          </>
        ) : (
          <p className="text-center text-gray-400 py-10">
            No hay movimientos en este mes
          </p>
        )}
      </div>

      <style>{`
        @page {
          size: A4;
          margin: 1.5cm;
        }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}
