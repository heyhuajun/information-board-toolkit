import { NextRequest, NextResponse } from 'next/server'
import { listBoards } from '@/lib/db'
import { validateApiKey, unauthorizedResponse } from '@/lib/auth'
import type { ListBoardsResponse } from '@/types'

export async function GET(request: NextRequest) {
  // 验证 API Key
  if (!validateApiKey(request)) {
    return unauthorizedResponse()
  }

  try {
    const { searchParams } = new URL(request.url)
    const author = searchParams.get('author') || undefined
    
    // 验证并限制分页参数
    const limit = Math.max(1, Math.min(parseInt(searchParams.get('limit') || '10') || 10, 100))
    const offset = Math.max(0, parseInt(searchParams.get('offset') || '0') || 0)

    const { items, total } = listBoards({ author, limit, offset })

    const response: ListBoardsResponse = {
      items,
      total,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error listing boards:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
