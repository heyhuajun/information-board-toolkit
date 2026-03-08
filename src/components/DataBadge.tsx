import type { DataBadgeComponent } from '@/types'

export default function DataBadge({
  confidence,
  freshness,
  showConfidence = true,
  showFreshness = true,
  size = 'md'
}: Omit<DataBadgeComponent, 'type'>) {
  // 计算新鲜度
  const calculateDays = (date: Date | string | number) => {
    if (typeof date === 'number') return date
    const d = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24))
  }

  // 置信度配置
  const getConfidenceConfig = (conf: number) => {
    if (conf >= 90) return { 
      stars: '⭐⭐⭐', 
      color: 'bg-green-100 text-green-800 border-green-200',
      label: '高置信度'
    }
    if (conf >= 70) return { 
      stars: '⭐⭐', 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      label: '中置信度'
    }
    return { 
      stars: '⭐', 
      color: 'bg-red-100 text-red-800 border-red-200',
      label: '低置信度'
    }
  }

  // 新鲜度配置
  const getFreshnessConfig = (days: number) => {
    if (days <= 7) return { 
      emoji: '🟢', 
      color: 'bg-green-100 text-green-800 border-green-200',
      label: '新鲜'
    }
    if (days <= 30) return { 
      emoji: '🟡', 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      label: '一般'
    }
    return { 
      emoji: '🔴', 
      color: 'bg-red-100 text-red-800 border-red-200',
      label: '过期'
    }
  }

  // 尺寸配置
  const sizeConfig = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  }

  const days = freshness !== undefined ? calculateDays(freshness) : undefined
  const confidenceConfig = confidence !== undefined ? getConfidenceConfig(confidence) : undefined
  const freshnessConfig = days !== undefined ? getFreshnessConfig(days) : undefined

  return (
    <div className="inline-flex items-center gap-2">
      {showConfidence && confidenceConfig && (
        <span 
          className={`inline-flex items-center gap-1 rounded-full border font-medium ${sizeConfig[size]} ${confidenceConfig.color}`}
          title={`置信度: ${confidence}% - ${confidenceConfig.label}`}
        >
          <span>{confidenceConfig.stars}</span>
          {confidence !== undefined && (
            <span>{confidence}%</span>
          )}
        </span>
      )}

      {showFreshness && freshnessConfig && days !== undefined && (
        <span 
          className={`inline-flex items-center gap-1 rounded-full border font-medium ${sizeConfig[size]} ${freshnessConfig.color}`}
          title={`新鲜度: ${days}天 - ${freshnessConfig.label}`}
        >
          <span>{freshnessConfig.emoji}</span>
          <span>{days}天</span>
        </span>
      )}
    </div>
  )
}
