import { NextRequest, NextResponse } from 'next/server'
import { updateBoard, deleteBoard, getBoardById, verifyOwnerToken } from '@/lib/db'
import { validateApiKey, unauthorizedResponse } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 验证 API Key
  if (!validateApiKey(request)) {
    return unauthorizedResponse()
  }

  try {
    const { id } = await params
    
    // 获取 ownerToken（从请求头或请求体）
    const ownerToken = request.headers.get('X-Owner-Token')
    
    // 验证 ownership
    if (!ownerToken || !verifyOwnerToken(id, ownerToken)) {
      return NextResponse.json(
        { error: 'Forbidden. Invalid or missing X-Owner-Token header.' },
        { status: 403 }
      )
    }

    const body = await request.json()

    // 检查 Board 是否存在
    const board = getBoardById(id)
    if (!board) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      )
    }

    // 更新 Board
    const success = updateBoard(id, body)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update board' },
        { status: 500 }
      )
    }

    const updatedBoard = getBoardById(id)
    return NextResponse.json(updatedBoard)
  } catch (error) {
    console.error('Error updating board:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 验证 API Key
  if (!validateApiKey(request)) {
    return unauthorizedResponse()
  }

  try {
    const { id } = await params
    
    // 获取 ownerToken（从请求头）
    const ownerToken = request.headers.get('X-Owner-Token')
    
    // 验证 ownership
    if (!ownerToken || !verifyOwnerToken(id, ownerToken)) {
      return NextResponse.json(
        { error: 'Forbidden. Invalid or missing X-Owner-Token header.' },
        { status: 403 }
      )
    }

    // 检查 Board 是否存在
    const board = getBoardById(id)
    if (!board) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      )
    }

    // 删除 Board
    const success = deleteBoard(id)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete board' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting board:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}