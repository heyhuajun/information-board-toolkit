import type { MarkdownComponent } from '@/types'
import ReactMarkdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'

// 安全的 Markdown 渲染配置
const sanitizeSchema = {
  // 允许的标签
  tagNames: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'div', 'span', 'br', 'hr',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'strong', 'em', 'b', 'i', 'u', 's', 'del', 'ins',
    'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ],
  // 允许的属性
  attributes: {
    a: ['href', 'title'],
    img: ['src', 'alt', 'title'],
    code: ['className'],
    pre: ['className'],
  },
  // 协议白名单
  protocols: {
    href: ['http', 'https', 'mailto'],
    src: ['http', 'https', 'data'],
  },
}

export default function Markdown({ content }: MarkdownComponent) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown 
          rehypePlugins={[[rehypeSanitize, sanitizeSchema]]}
          components={{
            // 强制所有链接在新窗口打开
            a: ({ href, children, ...props }) => (
              <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer"
                {...props}
              >
                {children}
              </a>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}