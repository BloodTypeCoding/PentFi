import {
  EvilPieChart,
  Pie,
  Label,
  Tooltip,
  Legend,
  Background,
} from "@/components/evilcharts/charts/pie-chart";

const data = [
  { concept: "Ingresos", value: 850000 },
  { concept: "Salidas", value: 620000 },
  { concept: "Diezmo Neto", value: 5000000 },
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

export default function ReportChart() {
  return (
    <EvilPieChart
      data={data}
      dataKey="value"
      backgroundVariant="dots"
      nameKey="concept"
      config={chartConfig}
    >
      <Legend isClickable />
      <Tooltip variant="frosted-glass" defaultIndex={4} />
      <Pie isClickable innerRadius={150} />
    </EvilPieChart>
  );
}
