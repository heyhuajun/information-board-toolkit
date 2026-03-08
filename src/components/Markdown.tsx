import type { MarkdownComponent } from '@/types'
import ReactMarkdown from 'react-markdown'

export default function Markdown({ content }: MarkdownComponent) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  )
}
