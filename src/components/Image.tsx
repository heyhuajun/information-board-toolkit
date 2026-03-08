import type { ImageComponent } from '@/types'

export default function Image({ src, caption, width = 'full' }: ImageComponent) {
  const widthClass = {
    full: 'w-full',
    half: 'w-full md:w-1/2',
    third: 'w-full md:w-1/3',
  }

  return (
    <div className={`${widthClass[width]} mx-auto`}>
      <img src={src} alt={caption || ''} className="w-full rounded-lg shadow" />
      {caption && (
        <p className="text-center text-sm text-gray-600 mt-2">{caption}</p>
      )}
    </div>
  )
}
