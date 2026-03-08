import type { ProgressComponent } from '@/types'

export default function Progress({
  percent,
  status,
  showLabel = true,
  size = 'md'
}: Omit<ProgressComponent, 'type'>) {
  // 自动判断状态
  const getStatus = () => {
    if (status) return status
    if (percent >= 100) return 'success'
    if (percent >= 70) return 'success'
    if (percent >= 30) return 'warning'
    return 'error'
  }

  const currentStatus = getStatus()

  // 颜色配置
  const colorConfig = {
    success: {
      bar: 'bg-green-500',
      text: 'text-green-600'
    },
    warning: {
      bar: 'bg-yellow-500',
      text: 'text-yellow-600'
    },
    error: {
      bar: 'bg-red-500',
      text: 'text-red-600'
    }
  }

  // 尺寸配置
  const sizeConfig = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  }

  const colors = colorConfig[currentStatus]
  const clampedPercent = Math.min(100, Math.max(0, percent))

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        {showLabel && (
          <span className={`text-sm font-medium ${colors.text}`}>
            {clampedPercent}%
          </span>
        )}
      </div>
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeConfig[size]}`}>
        <div
          className={`${sizeConfig[size]} ${colors.bar} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${clampedPercent}%` }}
        />
      </div>
      {clampedPercent >= 100 && (
        <div className="flex items-center gap-1 mt-1 text-green-600 text-xs">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>已完成</span>
        </div>
      )}
    </div>
  )
}
