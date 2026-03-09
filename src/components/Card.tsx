import type { CardComponent } from '@/types'
import Image from 'next/image'

export default function Card({ title, value, change, changeType, image, footer }: Omit<CardComponent, 'type'>) {
  const changeColor = changeType === 'positive' 
    ? 'text-green-600' 
    : changeType === 'negative' 
    ? 'text-red-600' 
    : 'text-gray-600'

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {image && (
        <Image 
          src={image} 
          alt={title} 
          width={400}
          height={192}
          className="w-full h-48 object-cover rounded-lg mb-4"
          unoptimized
        />
      )}
      <h3 className="text-gray-500 text-sm mb-2">{title}</h3>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {change && (
          <span className={`text-sm font-medium ${changeColor}`}>
            {change}
          </span>
        )}
      </div>
      {footer && (
        <p className="text-gray-500 text-xs mt-2">{footer}</p>
      )}
    </div>
  )
}
