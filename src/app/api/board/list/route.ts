import { NextRequest, NextResponse } from 'next/server'
import { listBoards } from '@/lib/db'
import type { ListBoardsResponse } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const author = searchParams.get('author') || undefined
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

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
