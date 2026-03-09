import type { ContentCardComponent } from '@/types'

export default function ContentCard({ title, content, icon, accent }: Omit<ContentCardComponent, 'type'>) {
  return (
    <div className={`rounded-lg shadow p-6 ${accent ? 'bg-blue-50 border-2 border-blue-200' : 'bg-white'}`}>
      <h3 className="text-gray-700 font-semibold text-base mb-3 flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {title}
      </h3>
      <div className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">
        {content}
      </div>
    </div>
  )
}
