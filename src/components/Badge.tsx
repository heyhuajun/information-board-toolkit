import type { Component } from '@/types'
import ComponentRenderer from './ComponentRenderer'

interface BadgeProps {
  count?: number
  dot?: boolean
  color?: string
  content?: string
  children?: Component[]
}

export default function Badge({
  count,
  dot = false,
  color,
  content,
  children
}: BadgeProps) {
  // 显示徽章的条件
  const showBadge = dot || (count !== undefined && count > 0)

  // 格式化数字
  const formatCount = (num: number) => {
    if (num > 99) return '99+'
    return num.toString()
  }

  return (
    <div className="relative inline-flex">
      {content && <span>{content}</span>}
      {children && children.map((child, idx) => (
        <ComponentRenderer key={idx} component={child} />
      ))}
      {showBadge && (
        <span 
          className="absolute -top-1 -right-1 flex items-center justify-center"
          style={color ? { backgroundColor: color } : {}}
        >
          {dot ? (
            <span 
              className={`w-2 h-2 rounded-full ${color ? '' : 'bg-red-500'}`}
              style={color ? { backgroundColor: color } : {}}
            />
          ) : (
            <span 
              className={`
                min-w-[18px] h-[18px] px-1 rounded-full
                text-xs font-medium text-white
                flex items-center justify-center
                ${color ? '' : 'bg-red-500'}
              `}
              style={color ? { backgroundColor: color } : {}}
            >
              {count !== undefined && formatCount(count)}
            </span>
          )}
        </span>
      )}
    </div>
  )
}
