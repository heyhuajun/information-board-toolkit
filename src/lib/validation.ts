/**
 * 输入验证常量与工具函数
 */

// 验证限制常量
export const VALIDATION = {
  // 标题
  TITLE_MIN_LENGTH: 1,
  TITLE_MAX_LENGTH: 200,
  
  // 描述
  DESCRIPTION_MAX_LENGTH: 1000,
  
  // 布局结构
  LAYOUT_MAX_DEPTH: 10,
  LAYOUT_MAX_CHILDREN: 100,
  LAYOUT_MAX_SIZE_KB: 500, // 500KB
  
  // 请求体
  MAX_BODY_SIZE_BYTES: 1024 * 1024, // 1MB
  
  // 过期时间
  VALID_EXPIRES_IN: ['1h', '24h', '7d', '30d', 'never'] as const,
} as const

// Token 相关
export const TOKEN = {
  SHARE_TOKEN_LENGTH: 16,
  OWNER_TOKEN_LENGTH: 16,
  ID_LENGTH: 21, // nanoid 默认长度
} as const

// Rate Limit
export const RATE_LIMIT = {
  DEFAULT_WINDOW_MS: 60 * 1000, // 1 分钟
  DEFAULT_MAX_REQUESTS: 60,
  STRICT_WINDOW_MS: 60 * 1000,
  STRICT_MAX_REQUESTS: 10,
  VIEW_WINDOW_MS: 60 * 1000,
  VIEW_MAX_REQUESTS: 100,
} as const

import { NextRequest, NextResponse } from 'next/server'
import type { Component } from '@/types'

/**
 * 计算对象深度
 */
export function getObjectDepth(obj: unknown, currentDepth = 0): number {
  if (currentDepth > VALIDATION.LAYOUT_MAX_DEPTH) {
    return currentDepth
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

/**
 * 计算 children 数量
 */
export function countChildren(layout: Component): number {
  let count = 0
  
  if (layout.type === 'section' && 'children' in layout && Array.isArray(layout.children)) {
    count += layout.children.length
    for (const child of layout.children as Component[]) {
      count += countChildren(child)
    }
  }
  
  return count
}

/**
 * 验证请求体大小
 */
export async function validateBodySize(request: NextRequest): Promise<{ valid: boolean; error?: NextResponse }> {
  const contentLength = request.headers.get('content-length')
  
  if (contentLength) {
    const size = parseInt(contentLength, 10)
    if (size > VALIDATION.MAX_BODY_SIZE_BYTES) {
      const error = NextResponse.json(
        { 
          error: 'Request body too large',
          message: `Maximum size is ${VALIDATION.MAX_BODY_SIZE_BYTES / 1024 / 1024}MB`
        },
        { status: 413 }
      )
      return { valid: false, error }
    }
  }
  
  return { valid: true }
}

/**
 * 验证布局结构
 */
export function validateLayout(layout: Component): { valid: boolean; error?: string } {
  // 验证布局深度
  const depth = getObjectDepth(layout)
  if (depth > VALIDATION.LAYOUT_MAX_DEPTH) {
    return { 
      valid: false, 
      error: `布局嵌套深度不能超过 ${VALIDATION.LAYOUT_MAX_DEPTH} 层` 
    }
  }
  
  // 验证 children 数量
  const childCount = countChildren(layout)
  if (childCount > VALIDATION.LAYOUT_MAX_CHILDREN) {
    return { 
      valid: false, 
      error: `布局组件数量不能超过 ${VALIDATION.LAYOUT_MAX_CHILDREN} 个` 
    }
  }
  
  // 验证布局大小
  const layoutSize = Buffer.byteLength(JSON.stringify(layout), 'utf8')
  if (layoutSize > VALIDATION.LAYOUT_MAX_SIZE_KB * 1024) {
    return { 
      valid: false, 
      error: `布局大小不能超过 ${VALIDATION.LAYOUT_MAX_SIZE_KB}KB` 
    }
  }
  
  return { valid: true }
}

/**
 * 验证标题
 */
export function validateTitle(title: string): { valid: boolean; error?: string } {
  if (title.length < VALIDATION.TITLE_MIN_LENGTH) {
    return { 
      valid: false, 
      error: `标题长度不能少于 ${VALIDATION.TITLE_MIN_LENGTH} 个字符` 
    }
  }
  if (title.length > VALIDATION.TITLE_MAX_LENGTH) {
    return { 
      valid: false, 
      error: `标题长度不能超过 ${VALIDATION.TITLE_MAX_LENGTH} 个字符` 
    }
  }
  return { valid: true }
}

/**
 * 验证描述
 */
export function validateDescription(description?: string): { valid: boolean; error?: string } {
  if (description && description.length > VALIDATION.DESCRIPTION_MAX_LENGTH) {
    return { 
      valid: false, 
      error: `描述长度不能超过 ${VALIDATION.DESCRIPTION_MAX_LENGTH} 个字符` 
    }
  }
  return { valid: true }
}

/**
 * 验证过期时间格式
 */
export function validateExpiresIn(expiresIn?: string): { valid: boolean; error?: string } {
  if (expiresIn && !VALIDATION.VALID_EXPIRES_IN.includes(expiresIn as typeof VALIDATION.VALID_EXPIRES_IN[number])) {
    return { 
      valid: false, 
      error: `expiresIn 必须是: ${VALIDATION.VALID_EXPIRES_IN.join(', ')}` 
    }
  }
  return { valid: true }
}
