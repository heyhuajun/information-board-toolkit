import type { CompareTableComponent } from '@/types'

export default function CompareTable({
  title,
  columns,
  rows,
  highlightDiff = true,
  recommend
}: Omit<CompareTableComponent, 'type'>) {
  // 判断值是否不同
  const isDifferent = (row: typeof rows[0]) => {
    return row.valueA !== row.valueB
  }

  // 获取胜出者样式
  const getWinnerStyle = (winner?: 'A' | 'B' | 'tie', column: 'A' | 'B' = 'A') => {
    if (winner === 'tie') return 'bg-gray-100'
    if (winner === column) return 'bg-green-50 text-green-700 font-medium'
    return ''
  }

  // 获取差异高亮样式
  const getDiffStyle = (row: typeof rows[0], column: 'A' | 'B') => {
    if (!highlightDiff) return ''
    if (!isDifferent(row)) return 'bg-gray-50 text-gray-500'
    return ''
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {title && (
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                特性
              </th>
              {columns.map((col) => (
                <th 
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                推荐
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {row.feature}
                </td>
                <td className={`px-4 py-3 text-sm ${getWinnerStyle(row.winner, 'A')} ${getDiffStyle(row, 'A')}`}>
                  <div className="flex items-center gap-2">
                    {row.valueA}
                    {row.winner === 'A' && (
                      <span className="text-green-600">✓</span>
                    )}
                  </div>
                </td>
                <td className={`px-4 py-3 text-sm ${getWinnerStyle(row.winner, 'B')} ${getDiffStyle(row, 'B')}`}>
                  <div className="flex items-center gap-2">
                    {row.valueB}
                    {row.winner === 'B' && (
                      <span className="text-green-600">✓</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  {row.winner === 'A' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      方案 A
                    </span>
                  )}
                  {row.winner === 'B' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      方案 B
                    </span>
                  )}
                  {row.winner === 'tie' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                      平局
                    </span>
                  )}
                  {!row.winner && (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {recommend && (
        <div className="px-4 py-3 bg-blue-50 border-t border-blue-100">
          <div className="flex items-center gap-2">
            <span className="text-blue-600">💡</span>
            <span className="text-sm text-blue-800">
              推荐方案: <strong>{recommend === 'A' ? columns[0]?.label : columns[1]?.label}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
