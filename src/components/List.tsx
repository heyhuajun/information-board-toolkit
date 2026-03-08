import type { ListComponent } from '@/types'

export default function List({ title, items }: ListComponent) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            {item.icon && (
              <span className="text-xl flex-shrink-0">{item.icon}</span>
            )}
            <span className="text-gray-700">{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
