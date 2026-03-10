import type { TableComponent } from '@/types'

export default function Table({ title, headers, rows, highlightRow }: TableComponent) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.04)' }}>
      {title && (
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`transition-colors ${highlightRow === rowIndex ? 'bg-blue-50' : 'hover:bg-slate-50/50'}`}
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-6 py-4 text-sm text-slate-900"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
