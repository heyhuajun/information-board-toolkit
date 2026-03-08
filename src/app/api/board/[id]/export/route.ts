import { NextRequest, NextResponse } from 'next/server'
import { getBoardById } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'json'

    // 获取 Board
    const board = getBoardById(id)
    if (!board) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      )
    }

    // JSON 格式
    if (format === 'json') {
      return NextResponse.json(board)
    }

    // PNG/PDF 格式需要客户端渲染
    // 这里返回提示信息
    return NextResponse.json({
      error: 'PNG/PDF export requires client-side rendering',
      hint: 'Use /view/[token]?export=png or /view/[token]?export=pdf to export',
    })
  } catch (error) {
    console.error('Error exporting board:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
