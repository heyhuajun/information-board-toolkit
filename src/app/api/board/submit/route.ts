import { NextRequest, NextResponse } from 'next/server'
import { createBoard } from '@/lib/db'
import { validateApiKey, unauthorizedResponse, errorResponse } from '@/lib/auth'
import { strictRateLimit } from '@/lib/rateLimit'
import type { SubmitBoardRequest, Component } from '@/types'

// 输入验证常量
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
    for (const child of layout.children as Component[]) {
      count += countChildren(child)
    }
  }
  
  return count
}

// 验证输入
function validateInput(body: SubmitBoardRequest): { valid: boolean; error?: string } {
  // title 长度验证
  if (body.title) {
    if (body.title.length < VALIDATION.TITLE_MIN_LENGTH) {
      return { valid: false, error: `标题长度不能少于 ${VALIDATION.TITLE_MIN_LENGTH} 个字符` }
    }
    if (body.title.length > VALIDATION.TITLE_MAX_LENGTH) {
      return { valid: false, error: `标题长度不能超过 ${VALIDATION.TITLE_MAX_LENGTH} 个字符` }
    }
  }
  
  // description 长度验证
  if (body.description && body.description.length > VALIDATION.DESCRIPTION_MAX_LENGTH) {
    return { valid: false, error: `描述长度不能超过 ${VALIDATION.DESCRIPTION_MAX_LENGTH} 个字符` }
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
  
  return { valid: true }
}

export async function POST(request: NextRequest) {
  // 验证 API Key
  if (!validateApiKey(request)) {
    return unauthorizedResponse()
  }

  // Rate limiting
  const rateLimitResult = strictRateLimit(request, 'submit')
  if (rateLimitResult instanceof NextResponse) {
    return rateLimitResult
  }

  try {
    const body: SubmitBoardRequest = await request.json()

    // 验证必填字段
    const missingFields: string[] = []
    if (!body.title) missingFields.push('title')
    if (!body.layout) missingFields.push('layout')

    if (missingFields.length > 0) {
      return errorResponse(
        'Missing required fields',
        { details: `Required fields: ${missingFields.join(', ')}` }
      )
    }

    // 验证 layout 基本结构
    if (typeof body.layout !== 'object' || !body.layout.type) {
      return errorResponse(
        'Invalid layout structure',
        { details: 'Layout must be an object with a "type" field' }
      )
    }

    // 输入验证（长度、深度、大小）
    const validation = validateInput(body)
    if (!validation.valid) {
      return errorResponse(
        'Validation failed',
        { details: validation.error }
      )
    }

    // 验证 expiresIn 格式
    if (body.expiresIn && body.expiresIn !== 'never') {
      const validFormats = ['1h', '24h', '7d', '30d', 'never']
      if (!validFormats.some(format => body.expiresIn === format)) {
        return errorResponse(
          'Invalid expiresIn format',
          { details: `Must be one of: ${validFormats.join(', ')}` }
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

    const response = {
      id: board.id,
      shareUrl,
      ownerToken: board.ownerToken,
      expiresAt: board.expiresAt || undefined,
      createdAt: board.createdAt,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error creating board:', error)
    
    return errorResponse(
      'Failed to create board',
      { status: 500 }
    )
  }
}