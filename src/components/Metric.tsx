import type { MetricComponent } from '@/types'

export default function Metric({ label, value, change, changeType }: MetricComponent) {
  const changeColor = changeType === 'positive' 
    ? 'text-green-600' 
    : changeType === 'negative' 
    ? 'text-red-600' 
    : 'text-gray-600'

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-gray-500 text-sm mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-4xl font-bold text-gray-900">{value}</p>
        {change && (
          <span className={`text-lg font-medium ${changeColor}`}>
            {change}
          </span>
        )}
      </div>
    </div>
  )
}
