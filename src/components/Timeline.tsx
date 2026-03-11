import type { TimelineComponent } from '@/types'

export default function Timeline({
  items,
  direction = 'vertical'
}: Omit<TimelineComponent, 'type'>) {
  const getStatusStyles = (status?: 'completed' | 'current' | 'pending') => {
    switch (status) {
      case 'completed':
        return {
          dot: 'bg-green-500 border-green-500',
          line: 'bg-green-200',
          text: 'text-gray-900'
        }
      case 'current':
        return {
          dot: 'bg-blue-500 border-blue-500 ring-4 ring-blue-100',
          line: 'bg-blue-200',
          text: 'text-gray-900 font-medium'
        }
      case 'pending':
        return {
          dot: 'bg-gray-200 border-gray-300',
          line: 'bg-gray-200',
          text: 'text-gray-500'
        }
      default:
        return {
          dot: 'bg-gray-400 border-gray-400',
          line: 'bg-gray-200',
          text: 'text-gray-700'
        }
    }
  }

  const formatDate = (date?: Date | string) => {
    if (!date) return ''
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (direction === 'horizontal') {
    return (
      <div className="overflow-x-auto">
        <div className="flex items-start gap-4 min-w-max py-4">
          {items.map((item, index) => {
            const styles = getStatusStyles(item.status)
            return (
              <div key={index} className="flex flex-col items-center" style={{ minWidth: '150px' }}>
                <div className={`w-4 h-4 rounded-full border-2 ${styles.dot} mb-2`} />
                {index < items.length - 1 && (
                  <div className={`absolute top-6 left-1/2 w-full h-0.5 ${styles.line}`} 
                       style={{ width: 'calc(100% - 2rem)' }} />
                )}
                <div className="text-center">
                  {item.date && (
                    <p className="text-xs text-gray-500 mb-1">{formatDate(item.date)}</p>
                  )}
                  <p className={`text-sm ${styles.text}`}>{item.title}</p>
                  {item.description && (
                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {items.map((item, index) => {
        const styles = getStatusStyles(item.status)
        return (
          <div key={index} className="relative flex gap-4 pb-8 last:pb-0">
            {/* Line */}
            {index < items.length - 1 && (
              <div 
                className={`absolute left-[7px] top-4 w-0.5 h-full ${styles.line}`}
              />
            )}
            
            {/* Dot */}
            <div className="relative z-10">
              <div className={`w-4 h-4 rounded-full border-2 ${styles.dot}`} />
            </div>
            
            {/* Content */}
            <div className="flex-1 pt-0.5">
              {item.date && (
                <p className="text-xs text-gray-500 mb-1">{formatDate(item.date)}</p>
              )}
              <p className={`text-base ${styles.text}`}>{item.title}</p>
              {item.description && (
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
