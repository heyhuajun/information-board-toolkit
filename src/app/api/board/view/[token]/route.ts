import { NextRequest } from 'next/server'
import { getBoardByToken, incrementViews, getViewStats, checkRateLimit } from '@/lib/db'
import { getClientIp } from '@/lib/auth'
import { ApiSuccess, ApiError } from '@/lib/api'
import type { ViewBoardResponse } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const clientIp = getClientIp(request) || 'unknown'

  const rateLimitResult = await checkRateLimit('view', clientIp, 100, 60000)
  if (!rateLimitResult.allowed) {
    return ApiError.tooManyRequests(
      'Too many requests. Please try again later.',
      Math.ceil((rateLimitResult.resetAt.getTime() - Date.now()) / 1000)
    )
  }

  try {
    const { token } = await params
    const board = await getBoardByToken(token)

    if (!board) {
      return ApiError.notFound('Board not found or expired')
    }

    const userAgent = request.headers.get('user-agent')
    await incrementViews(board.id, clientIp, userAgent || undefined)

    const stats = await getViewStats(board.id)

    const response: ViewBoardResponse = { ...board, stats }
    return ApiSuccess.create(response)
  } catch (error) {
    console.error('Error viewing board:', error)
    return ApiError.internalError()
  }
}
