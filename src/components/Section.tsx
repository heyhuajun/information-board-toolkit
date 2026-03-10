import type { SectionComponent } from '@/types'
import ComponentRenderer from './ComponentRenderer'

export default function Section({ title, description, children }: SectionComponent) {
  return (
    <div className="mb-8">
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-5 bg-slate-900 rounded-full"></div>
              <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            </div>
          )}
          {description && <p className="text-slate-500 ml-3">{description}</p>}
        </div>
      )}
      <div className="space-y-6">
        {children.map((child, index) => (
          <ComponentRenderer key={index} component={child} />
        ))}
      </div>
    </div>
  )
}
