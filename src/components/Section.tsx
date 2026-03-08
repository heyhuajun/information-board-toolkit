import type { SectionComponent } from '@/types'
import ComponentRenderer from './ComponentRenderer'

export default function Section({ title, description, children }: SectionComponent) {
  return (
    <div className="mb-8">
      {(title || description) && (
        <div className="mb-4">
          {title && <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>}
          {description && <p className="text-gray-600">{description}</p>}
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
