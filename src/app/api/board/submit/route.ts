import { NextRequest, NextResponse } from 'next/server'
import { createBoard } from '@/lib/db'
import { validateApiKey, unauthorizedResponse } from '@/lib/auth'
import type { SubmitBoardRequest, SubmitBoardResponse } from '@/types'

export async function POST(request: NextRequest) {
  // 验证 API Key
  if (!validateApiKey(request)) {
    return unauthorizedResponse()
  }

  try {
    const body: SubmitBoardRequest = await request.json()

    // 验证必填字段
    const missingFields: string[] = []
    if (!body.title) missingFields.push('title')
    if (!body.layout) missingFields.push('layout')

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          details: `Required fields: ${missingFields.join(', ')}`,
          example: {
            title: 'My Board Title',
            layout: { type: 'section', children: [] }
          }
        },
        { status: 400 }
      )
    }

    // 验证 layout 基本结构
    if (typeof body.layout !== 'object' || !body.layout.type) {
      return NextResponse.json(
        {
          error: 'Invalid layout structure',
          details: 'Layout must be an object with a "type" field',
          example: {
            type: 'section',
            children: [
              { type: 'card', title: 'Example', value: '100' }
            ]
          }
        },
        { status: 400 }
      )
    }

    // 验证 expiresIn 格式
    if (body.expiresIn && body.expiresIn !== 'never') {
      const validFormats = ['1h', '24h', '7d', '30d', 'never']
      if (!validFormats.some(format => body.expiresIn === format)) {
        return NextResponse.json(
          {
            error: 'Invalid expiresIn format',
            details: `Must be one of: ${validFormats.join(', ')}`,
            received: body.expiresIn
          },
          { status: 400 }
        )
      }
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
    
    // 提供更详细的错误信息
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json(
      {
        error: 'Failed to create board',
        details: errorMessage,
        hint: 'Check that your layout structure is valid. Use validateLayout() before submitting.'
      },
      { status: 500 }
    )
  }
}
