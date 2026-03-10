import { NextRequest, NextResponse } from 'next/server'
import { listBoards } from '@/lib/db'
import { validateApiKey, unauthorizedResponse } from '@/lib/auth'
import { ApiSuccess } from '@/lib/api'
import type { ListBoardsResponse } from '@/types'

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return unauthorizedResponse()
  }

  try {
    const { searchParams } = new URL(request.url)
    const author = searchParams.get('author') || undefined
    const limit = Math.max(1, Math.min(parseInt(searchParams.get('limit') || '10') || 10, 100))
    const offset = Math.max(0, parseInt(searchParams.get('offset') || '0') || 0)

    const { items, total } = await listBoards({ author, limit, offset })

    const response: ListBoardsResponse = { items, total }
    return ApiSuccess.create(response)
  } catch (error) {
    console.error('Error listing boards:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
