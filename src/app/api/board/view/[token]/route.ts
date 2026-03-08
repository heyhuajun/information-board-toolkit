import { NextRequest, NextResponse } from 'next/server'
import { getBoardByToken, incrementViews, getViewStats } from '@/lib/db'
import type { ViewBoardResponse } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params

    // 获取 Board
    const board = getBoardByToken(token)

    if (!board) {
      return NextResponse.json(
        { error: 'Board not found or expired' },
        { status: 404 }
      )
    }

    // 增加浏览量
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    const userAgent = request.headers.get('user-agent')
    incrementViews(board.id, ip || undefined, userAgent || undefined)

    // 获取统计信息
    const stats = getViewStats(board.id)

    const response: ViewBoardResponse = {
      ...board,
      stats,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error viewing board:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
