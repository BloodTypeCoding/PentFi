import logo from "../../Logos/IntentoDeLogo.png";

export default function FacturaHeader({ titulo, numeroFactura, fecha, iglesia }) {
  return (
    <div className="text-center mb-6">
      <img src={logo} alt="Logo" className="w-16 h-16 mx-auto mb-2 print:w-16" />
      <h1 className="text-lg font-bold uppercase">{iglesia?.nombre || "Iglesia"}</h1>
      <p className="text-xs text-gray-500">{iglesia?.denominacion || ""}</p>
      <hr className="my-3 border-gray-300" />
      <h2 className="text-base font-semibold uppercase tracking-wide">{titulo}</h2>
      <div className="flex justify-between text-xs mt-2 text-gray-600">
        <span>No. {numeroFactura}</span>
        <span>Fecha: {fecha}</span>
      </div>
    </div>
  );
}
