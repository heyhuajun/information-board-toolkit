import type { QuoteComponent } from '@/types'
import Image from 'next/image'

export default function Quote({
  content,
  author,
  avatar,
  source,
  role
}: Omit<QuoteComponent, 'type'>) {
  return (
    <blockquote className="relative border-l-4 border-gray-300 bg-gray-50 p-4 my-4">
      <div className="flex items-start gap-3">
        {avatar && (
          <Image 
            src={avatar} 
            alt={author}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            unoptimized
          />
        )}
        <div className="flex-1">
          <p className="text-gray-700 text-lg italic leading-relaxed">
            &ldquo;{content}&rdquo;
          </p>
          <footer className="mt-3 flex items-center gap-2 text-sm text-gray-500">
            <cite className="not-italic font-medium text-gray-900">
              {author}
            </cite>
            {role && (
              <>
                <span className="text-gray-300">·</span>
                <span>{role}</span>
              </>
            )}
            {source && (
              <>
                <span className="text-gray-300">·</span>
                <span className="text-blue-600">{source}</span>
              </>
            )}
          </footer>
        </div>
      </div>
    </blockquote>
  )
}
