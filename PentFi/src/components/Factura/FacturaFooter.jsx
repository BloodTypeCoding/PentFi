export default function FacturaFooter({ total, label = "Total" }) {
  return (
    <div className="mt-6">
      <div className="flex justify-between font-bold text-sm border-t-2 border-gray-700 pt-2">
        <span>{label}</span>
        <span>{total}</span>
      </div>

      <div className="flex justify-between mt-12 pt-4 text-xs text-center">
        <div className="w-40">
          <hr className="border-gray-400 mb-1" />
          <span>Recibido por</span>
        </div>
        <div className="w-40">
          <hr className="border-gray-400 mb-1" />
          <span>Tesorero</span>
        </div>
        <div className="w-40">
          <hr className="border-gray-400 mb-1" />
          <span>Contador</span>
        </div>
      </div>
    </div>
  );
}
