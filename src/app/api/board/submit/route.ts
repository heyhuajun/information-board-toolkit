import { NextRequest, NextResponse } from 'next/server'
import { createBoard, checkRateLimit } from '@/lib/db'
import { validateApiKey, unauthorizedResponse, errorResponse, getClientIp } from '@/lib/auth'
import { ApiSuccess, ApiError } from '@/lib/api'
import { 
  validateLayout, 
  validateTitle, 
  validateDescription, 
  validateExpiresIn,
  validateBodySize 
} from '@/lib/validation'
import type { SubmitBoardRequest } from '@/types'

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return unauthorizedResponse()
  }

  const bodySizeCheck = await validateBodySize(request)
  if (!bodySizeCheck.valid) return bodySizeCheck.error

  const clientIp = getClientIp(request) || 'unknown'
  const rateLimitResult = await checkRateLimit('submit', clientIp, 10, 60000)
  if (!rateLimitResult.allowed) {
    return ApiError.tooManyRequests(
      'Too many requests. Maximum 10 submissions per minute.',
      Math.ceil((rateLimitResult.resetAt.getTime() - Date.now()) / 1000)
    )
  }

  try {
    const body: SubmitBoardRequest = await request.json()

    const missingFields: string[] = []
    if (!body.title) missingFields.push('title')
    if (!body.layout) missingFields.push('layout')

    if (missingFields.length > 0) {
      return errorResponse(
        'Missing required fields',
        { details: `Required fields: ${missingFields.join(', ')}` }
      )
    }

    if (typeof body.layout !== 'object' || !body.layout.type) {
      return errorResponse(
        'Invalid layout structure',
        { details: 'Layout must be an object with a "type" field' }
      )
    }

    const titleValidation = validateTitle(body.title)
    if (!titleValidation.valid) {
      return errorResponse('Validation failed', { details: titleValidation.error })
    }

    const descValidation = validateDescription(body.description)
    if (!descValidation.valid) {
      return errorResponse('Validation failed', { details: descValidation.error })
    }

    const layoutValidation = validateLayout(body.layout)
    if (!layoutValidation.valid) {
      return errorResponse('Validation failed', { details: layoutValidation.error })
    }

    const expiresValidation = validateExpiresIn(body.expiresIn)
    if (!expiresValidation.valid) {
      return errorResponse('Validation failed', { details: expiresValidation.error })
    }

    const board = await createBoard({
      title: body.title,
      description: body.description,
      layout: body.layout,
      expiresIn: body.expiresIn || 'never',
      meta: body.meta,
    })

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const shareUrl = `${baseUrl}/view/${board.shareToken}`

    return ApiSuccess.created({
      id: board.id,
      shareUrl,
      ownerToken: board.ownerToken,
      expiresAt: board.expiresAt || undefined,
      createdAt: board.createdAt,
    })
  } catch (error) {
    console.error('Error creating board:', error)
    return ApiError.internalError('Failed to create board')
  }
}