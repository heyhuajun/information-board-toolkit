import type { ImageComponent } from '@/types'
import Image from 'next/image'

// 允许的 URL 协议
const ALLOWED_PROTOCOLS = ['http:', 'https:', 'data:']

// 验证 URL 是否安全
function isSafeUrl(url: string): boolean {
  try {
    // 处理相对路径
    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
      return true
    }
    
    const parsed = new URL(url, 'https://example.com')
    return ALLOWED_PROTOCOLS.includes(parsed.protocol)
  } catch {
    return false
  }
}

export default function ImageComponent({ src, caption, width = 'full' }: ImageComponent) {
  const widthClass = {
    full: 'w-full',
    half: 'w-full md:w-1/2',
    third: 'w-full md:w-1/3',
  }

  // 验证 URL 安全性
  if (!isSafeUrl(src)) {
    return (
      <div className={`${widthClass[width]} mx-auto`}>
        <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500">
          <span className="text-2xl">🖼️</span>
          <p className="mt-2 text-sm">图片地址无效</p>
        </div>
        {caption && (
          <p className="text-center text-sm text-gray-600 mt-2">{caption}</p>
        )}
      </div>
    )
  }

  return (
    <div className={`${widthClass[width]} mx-auto`}>
      <Image 
        src={src} 
        alt={caption || ''} 
        width={800}
        height={600}
        className="w-full rounded-lg shadow" 
        loading="lazy"
        unoptimized
      />
      {caption && (
        <p className="text-center text-sm text-gray-600 mt-2">{caption}</p>
      )}
    </div>
  )
}
