'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ComponentRenderer from '@/components/ComponentRenderer'
import type { ViewBoardResponse } from '@/types'

export default function ViewPage() {
  const params = useParams()
  const token = params.id as string
  const [board, setBoard] = useState<ViewBoardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBoard() {
      try {
        const res = await fetch(`/api/board/view/${token}`)
        if (!res.ok) {
          throw new Error('Board not found or expired')
        }
        const data = await res.json()
        setBoard(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load board')
      } finally {
        setLoading(false)
      }
    }

    fetchBoard()
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (error || !board) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-2">😕</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">内容不存在或已过期</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">{board.title}</h1>
          {board.description && (
            <p className="text-gray-600 mt-2">{board.description}</p>
          )}
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <span>👁️ {board.stats.views} 次浏览</span>
            {board.meta?.author && <span>✍️ {board.meta.author}</span>}
            {board.expiresAt && (
              <span>⏰ 有效期至 {new Date(board.expiresAt).toLocaleString('zh-CN')}</span>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <ComponentRenderer component={board.layout} />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>由 Information Board 生成</p>
          <p className="mt-1">创建于 {new Date(board.createdAt).toLocaleString('zh-CN')}</p>
        </div>
      </footer>
    </div>
  )
}
