import { NextRequest, NextResponse } from 'next/server'
import { createBoard } from '@/lib/db'
import type { SubmitBoardRequest, SubmitBoardResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body: SubmitBoardRequest = await request.json()

    // 验证必填字段
    if (!body.title || !body.layout) {
      return NextResponse.json(
        { error: 'Missing required fields: title, layout' },
        { status: 400 }
      )
    }

    // 创建 Board
    const board = createBoard({
      title: body.title,
      description: body.description,
      layout: body.layout,
      expiresIn: body.expiresIn || 'never',
      meta: body.meta,
    })

    // 生成分享链接
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const shareUrl = `${baseUrl}/view/${board.shareToken}`

    const response: SubmitBoardResponse = {
      id: board.id,
      shareUrl,
      expiresAt: board.expiresAt || undefined,
      createdAt: board.createdAt,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error creating board:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
