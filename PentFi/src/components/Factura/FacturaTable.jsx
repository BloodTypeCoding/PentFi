export default function FacturaTable({ items, columnas, resaltar }) {
  return (
    <table className="w-full text-xs border-collapse">
      <thead>
        <tr className="border-b-2 border-gray-700">
          {columnas.map((col) => (
            <th key={col.key} className={`py-2 ${col.align || "text-left"}`}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((item, idx) => (
          <tr key={idx} className="border-b border-gray-300">
            {columnas.map((col) => (
              <td key={col.key} className={`py-2 ${col.align || "text-left"}`}>
                {col.render ? col.render(item) : item[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
