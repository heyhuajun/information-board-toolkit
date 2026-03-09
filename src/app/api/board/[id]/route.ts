import { NextRequest, NextResponse } from 'next/server'
import { updateBoard, deleteBoard, getBoardById, verifyOwnerToken } from '@/lib/db'
import { validateApiKey, unauthorizedResponse, errorResponse } from '@/lib/auth'
import type { SubmitBoardRequest, Component } from '@/types'

// 输入验证常量（和submit接口保持一致）
const VALIDATION = {
  TITLE_MIN_LENGTH: 1,
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 1000,
  LAYOUT_MAX_DEPTH: 10,
  LAYOUT_MAX_CHILDREN: 100,
  LAYOUT_MAX_SIZE_KB: 500, // 500KB
}

// 计算 JSON 对象深度
function getObjectDepth(obj: unknown, currentDepth = 0): number {
  if (currentDepth > VALIDATION.LAYOUT_MAX_DEPTH) {
    return currentDepth // 提前终止
  }
  
  if (typeof obj !== 'object' || obj === null) {
    return currentDepth
  }
  
  if (Array.isArray(obj)) {
    if (obj.length === 0) return currentDepth
    return Math.max(...obj.map(item => getObjectDepth(item, currentDepth + 1)))
  }
  
  const values = Object.values(obj as Record<string, unknown>)
  if (values.length === 0) return currentDepth
  
  return Math.max(...values.map(val => getObjectDepth(val, currentDepth + 1)))
}

// 计算 children 数量
function countChildren(layout: Component): number {
  let count = 0
  
  if (layout.type === 'section' && 'children' in layout && Array.isArray(layout.children)) {
    count += layout.children.length
    for (const child of layout.children) {
      count += countChildren(child)
    }
  }
  
  return count
}

// 验证更新输入
function validateUpdateInput(body: Partial<SubmitBoardRequest>): { valid: boolean; error?: string } {
  // title 长度验证
  if (body.title !== undefined) {
    if (body.title.length < VALIDATION.TITLE_MIN_LENGTH) {
      return { valid: false, error: `标题长度不能少于 ${VALIDATION.TITLE_MIN_LENGTH} 个字符` }
    }
    if (body.title.length > VALIDATION.TITLE_MAX_LENGTH) {
      return { valid: false, error: `标题长度不能超过 ${VALIDATION.TITLE_MAX_LENGTH} 个字符` }
    }
  }
  
  // description 长度验证
  if (body.description !== undefined && body.description.length > VALIDATION.DESCRIPTION_MAX_LENGTH) {
    return { valid: false, error: `描述长度不能超过 ${VALIDATION.DESCRIPTION_MAX_LENGTH} 个字符` }
  }
  
  // layout 验证
  if (body.layout !== undefined) {
    // 验证 layout 基本结构
    if (typeof body.layout !== 'object' || !body.layout.type) {
      return { valid: false, error: 'Layout must be an object with a "type" field' }
    }
    
    // layout 深度验证
    const depth = getObjectDepth(body.layout)
    if (depth > VALIDATION.LAYOUT_MAX_DEPTH) {
      return { valid: false, error: `布局嵌套深度不能超过 ${VALIDATION.LAYOUT_MAX_DEPTH} 层` }
    }
    
    // layout children 数量验证
    const childCount = countChildren(body.layout)
    if (childCount > VALIDATION.LAYOUT_MAX_CHILDREN) {
      return { valid: false, error: `布局组件数量不能超过 ${VALIDATION.LAYOUT_MAX_CHILDREN} 个` }
    }
    
    // layout 大小验证
    const layoutSize = Buffer.byteLength(JSON.stringify(body.layout), 'utf8')
    if (layoutSize > VALIDATION.LAYOUT_MAX_SIZE_KB * 1024) {
      return { valid: false, error: `布局大小不能超过 ${VALIDATION.LAYOUT_MAX_SIZE_KB}KB` }
    }
  }
  
  return { valid: true }
}

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

    // 验证输入
    const validation = validateUpdateInput(body)
    if (!validation.valid) {
      return errorResponse(
        'Validation failed',
        { details: validation.error }
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

    // 更新 Board（仅允许更新白名单字段）
    const updateData: Partial<SubmitBoardRequest> = {
      title: body.title,
      description: body.description,
      layout: body.layout,
      meta: body.meta,
    }
    const success = updateBoard(id, updateData)

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