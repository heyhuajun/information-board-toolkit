import { NextRequest } from 'next/server'
import { updateBoard, deleteBoard, getBoardById, verifyOwnerToken } from '@/lib/db'
import { validateApiKey, unauthorizedResponse, errorResponse } from '@/lib/auth'
import { ApiError, ApiSuccess } from '@/lib/api'
import { validateLayout, validateTitle, validateDescription, validateBodySize } from '@/lib/validation'
import type { SubmitBoardRequest, Component } from '@/types'

function validateUpdateInput(body: Partial<SubmitBoardRequest>): { valid: boolean; error?: string } {
  if (body.title !== undefined) {
    const titleValidation = validateTitle(body.title)
    if (!titleValidation.valid) return titleValidation
  }
  
  if (body.description !== undefined) {
    const descValidation = validateDescription(body.description)
    if (!descValidation.valid) return descValidation
  }
  
  if (body.layout !== undefined) {
    if (typeof body.layout !== 'object' || !body.layout.type) {
      return { valid: false, error: 'Layout must be an object with a "type" field' }
    }
    
    const layoutValidation = validateLayout(body.layout as Component)
    if (!layoutValidation.valid) return layoutValidation
  }
  
  return { valid: true }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateApiKey(request)) {
    return unauthorizedResponse()
  }

  const bodySizeCheck = await validateBodySize(request)
  if (!bodySizeCheck.valid) return bodySizeCheck.error

  try {
    const { id } = await params
    const ownerToken = request.headers.get('X-Owner-Token')

    if (!ownerToken || !(await verifyOwnerToken(id, ownerToken))) {
      return ApiError.forbidden('Invalid or missing X-Owner-Token header')
    }

    const body = await request.json()
    const validation = validateUpdateInput(body)
    if (!validation.valid) {
      return errorResponse('Validation failed', { details: validation.error })
    }

    const board = await getBoardById(id)
    if (!board) {
      return ApiError.notFound('Board not found')
    }

    const updateData: Partial<SubmitBoardRequest> = {
      title: body.title,
      description: body.description,
      layout: body.layout,
      meta: body.meta,
    }
    
    const success = await updateBoard(id, updateData)
    if (!success) {
      return ApiError.internalError('Failed to update board')
    }

    const updatedBoard = await getBoardById(id)
    return ApiSuccess.create(updatedBoard)
  } catch (error) {
    console.error('Error updating board:', error)
    return ApiError.internalError()
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateApiKey(request)) {
    return unauthorizedResponse()
  }

  try {
    const { id } = await params
    const ownerToken = request.headers.get('X-Owner-Token')

    if (!ownerToken || !(await verifyOwnerToken(id, ownerToken))) {
      return ApiError.forbidden('Invalid or missing X-Owner-Token header')
    }

    const board = await getBoardById(id)
    if (!board) {
      return ApiError.notFound('Board not found')
    }

    const success = await deleteBoard(id)
    if (!success) {
      return ApiError.internalError('Failed to delete board')
    }

    return ApiSuccess.create({ success: true })
  } catch (error) {
    console.error('Error deleting board:', error)
    return ApiError.internalError()
  }
}
