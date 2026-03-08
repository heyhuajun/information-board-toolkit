import type { CollapseComponent, Component } from '@/types'
import ComponentRenderer from './ComponentRenderer'
import { useState } from 'react'

export default function Collapse({
  title,
  content,
  children,
  defaultExpanded = false
}: Omit<CollapseComponent, 'type'>) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-medium text-gray-900">{title}</span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isExpanded && (
        <div className="px-4 py-3 bg-white border-t border-gray-200">
          {content && (
            <p className="text-gray-700 text-sm leading-relaxed">{content}</p>
          )}
          {children && children.length > 0 && (
            <div className="space-y-2 mt-2">
              {children.map((child, index) => (
                <ComponentRenderer key={index} component={child} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
