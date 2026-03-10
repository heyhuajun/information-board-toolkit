import type { CardComponent } from '@/types'
import Image from 'next/image'

export default function Card({ title, value, change, changeType, image, footer }: Omit<CardComponent, 'type'>) {
  const changeColor = changeType === 'positive' 
    ? 'text-emerald-600' 
    : changeType === 'negative' 
    ? 'text-rose-500' 
    : 'text-slate-500'

  const changeBg = changeType === 'positive'
    ? 'bg-emerald-50'
    : changeType === 'negative'
    ? 'bg-rose-50'
    : 'bg-slate-50'

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.04)' }}>
      {image && (
        <Image 
          src={image} 
          alt={title} 
          width={400}
          height={192}
          className="w-full h-48 object-cover rounded-xl mb-4"
          unoptimized
        />
      )}
      <p className="text-sm text-slate-500 mb-2">{title}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        {change && (
          <span className={`text-sm font-medium ${changeColor} ${changeBg} px-2 py-0.5 rounded-full`}>
            {change}
          </span>
        )}
      </div>
      {footer && (
        <p className="text-slate-400 text-xs mt-2">{footer}</p>
      )}
    </div>
  )
}
