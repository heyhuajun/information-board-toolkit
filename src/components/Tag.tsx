import type { TagComponent } from '@/types'

export default function Tag({
  label,
  color = 'default',
  icon,
  size = 'md',
  closable = false,
  onClick
}: Omit<TagComponent, 'type'>) {
  // 颜色配置
  const colorConfig = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    primary: 'bg-blue-100 text-blue-700 border-blue-200',
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    danger: 'bg-red-100 text-red-700 border-red-200'
  }

  // 尺寸配置
  const sizeConfig = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  }

  return (
    <span 
      className={`
        inline-flex items-center gap-1 rounded-full border font-medium
        ${sizeConfig[size]}
        ${colorConfig[color]}
        ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
      `}
      onClick={onClick}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
      {closable && (
        <button 
          type="button"
          className="ml-1 hover:opacity-70"
          onClick={(e) => {
            e.stopPropagation()
            // 触发关闭事件
          }}
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path 
              fillRule="evenodd" 
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>
      )}
    </span>
  )
}
