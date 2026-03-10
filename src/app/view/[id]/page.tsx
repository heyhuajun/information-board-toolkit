'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import ComponentRenderer from '@/components/ComponentRenderer'
import type { ViewBoardResponse } from '@/types'

export default function ViewPage() {
  const params = useParams()
  const token = params.id as string
  const [board, setBoard] = useState<ViewBoardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchBoard() {
      try {
        const res = await fetch(`/api/board/view/${token}`)
        if (!res.ok) {
          throw new Error('Board not found or expired')
        }
        const json = await res.json()
        // 兼容两种 API 响应格式:
        // 1. 直接返回 board: {id, title, layout, ...}
        // 2. 包装返回: {success, data: {...}, meta: {...}}
        const boardData = json.data ? json.data : json
        setBoard(boardData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load board')
      } finally {
        setLoading(false)
      }
    }

    fetchBoard()
  }, [token])

  const exportToPdf = async () => {
    if (!contentRef.current || !board) return

    setExporting(true)

    try {
      // 注入临时 CSS 覆盖 Tailwind CSS 4 的 lab() 颜色函数
      // html2canvas 不支持 lab() 现代颜色函数
      const styleId = 'export-color-override'
      let overrideStyle = document.getElementById(styleId)
      if (!overrideStyle) {
        overrideStyle = document.createElement('style')
        overrideStyle.id = styleId
        overrideStyle.textContent = `
          *, *::before, *::after {
            color: #111827 !important;
            background-color: #ffffff !important;
            border-color: #e5e7eb !important;
          }
          .text-gray-900, .text-gray-800, .text-gray-700, .text-gray-600, .text-gray-500 {
            color: #111827 !important;
          }
          .text-blue-600, .text-blue-700 {
            color: #2563eb !important;
          }
          .text-red-600, .text-red-500 {
            color: #dc2626 !important;
          }
          .text-green-600, .text-green-500 {
            color: #16a34a !important;
          }
          .text-yellow-600, .text-yellow-500 {
            color: #ca8a04 !important;
          }
          .bg-white {
            background-color: #ffffff !important;
          }
          .bg-gray-50 {
            background-color: #f9fafb !important;
          }
          .bg-blue-600, .bg-blue-700 {
            background-color: #2563eb !important;
          }
        `
        document.head.appendChild(overrideStyle)
      }

      // 等待样式生效
      await new Promise(resolve => setTimeout(resolve, 100))

      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')

      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#f9fafb'
      })

      // 移除临时样式
      if (overrideStyle && overrideStyle.parentNode) {
        overrideStyle.parentNode.removeChild(overrideStyle)
      }

      const imgWidth = 210
      const pageHeight = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      const pdf = new jsPDF('p', 'mm', 'a4')
      let position = 0

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      const filename = board.title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_') || 'board'
      pdf.save(`${filename}.pdf`)
    } catch (err) {
      console.error('Export failed:', err)
      alert('导出失败，请重试')
    } finally {
      setExporting(false)
    }
  }

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
      <header className="bg-white shadow-sm print:shadow-none">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{board.title}</h1>
              {board.description && (
                <p className="text-gray-600 mt-2">{board.description}</p>
              )}
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                {board.meta?.author && <span>✍️ {board.meta.author}</span>}
                {board.expiresAt && (
                  <span>⏰ 有效期至 {new Date(board.expiresAt).toLocaleString('zh-CN')}</span>
                )}
              </div>
            </div>
            <button
              onClick={exportToPdf}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors print:hidden"
            >
              {exporting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  导出中...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  导出 PDF
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main ref={contentRef} className="max-w-5xl mx-auto px-4 py-8 bg-gray-50">
        <ComponentRenderer component={board.layout} />
      </main>

      <footer className="bg-white border-t mt-12 print:hidden">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>由 Information Board 生成</p>
          <p className="mt-1">创建于 {new Date(board.createdAt).toLocaleString('zh-CN')}</p>
        </div>
      </footer>
    </div>
  )
}
