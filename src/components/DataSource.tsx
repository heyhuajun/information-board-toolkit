import { useState } from 'react'
import type { Component } from '@/types'
import ComponentRenderer from './ComponentRenderer'

interface DataSourceProps {
  source: string
  url?: string
  timestamp?: Date | string
  confidence?: number
  freshness?: number
  content?: string
  children?: Component[]
}

export default function DataSource({
  source,
  url,
  timestamp,
  confidence,
  freshness,
  content,
  children
}: DataSourceProps) {
  const [expanded, setExpanded] = useState(false)

  // 计算新鲜度标签
  const getFreshnessBadge = (days: number) => {
    if (days <= 7) return { emoji: '🟢', label: '新鲜', color: 'text-green-600' }
    if (days <= 30) return { emoji: '🟡', label: '一般', color: 'text-yellow-600' }
    return { emoji: '🔴', label: '过期', color: 'text-red-600' }
  }

  // 计算置信度星级
  const getConfidenceStars = (conf: number) => {
    if (conf >= 90) return { stars: '⭐⭐⭐', color: 'text-green-600' }
    if (conf >= 70) return { stars: '⭐⭐', color: 'text-yellow-600' }
    return { stars: '⭐', color: 'text-red-600' }
  }

  // 计算天数差
  const calculateDays = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24))
  }

  const days = freshness ?? (timestamp ? calculateDays(timestamp) : 0)
  const freshnessInfo = getFreshnessBadge(days)
  const confidenceInfo = confidence !== undefined ? getConfidenceStars(confidence) : null

  const formattedTime = !timestamp
    ? '未知时间'
    : typeof timestamp === 'string'
      ? timestamp
      : timestamp.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {content && <p className="text-gray-900">{content}</p>}
            {children && children.map((child, idx) => (
              <ComponentRenderer key={idx} component={child} />
            ))}
          </div>
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm">{freshnessInfo.emoji}</span>
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span>📊</span>
              <span className="text-gray-500">来源:</span>
              {url ? (
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {source}
                </a>
              ) : (
                <span className="text-gray-900">{source}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span>🕐</span>
              <span className="text-gray-500">时间:</span>
              <span className="text-gray-900">{formattedTime}</span>
            </div>

            {confidenceInfo && (
              <div className="flex items-center gap-2">
                <span>⭐</span>
                <span className="text-gray-500">置信度:</span>
                <span className={confidenceInfo.color}>
                  {confidenceInfo.stars} {confidence}%
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span>📅</span>
              <span className="text-gray-500">新鲜度:</span>
              <span className={freshnessInfo.color}>
                {freshnessInfo.emoji} {days}天
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
