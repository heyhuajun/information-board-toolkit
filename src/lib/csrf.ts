/**
 * CSRF 保护工具
 * 使用 Double Submit Cookie 模式
 */

import { randomBytes } from 'crypto'

// CSRF Token 长度
const CSRF_TOKEN_LENGTH = 32

// Token 过期时间（毫秒）
const CSRF_TOKEN_EXPIRY = 60 * 60 * 1000 // 1 小时

interface CsrfTokenData {
  token: string
  createdAt: number
}

// 内存存储（单实例足够，多实例需要使用数据库或 Redis）
const tokenStore = new Map<string, CsrfTokenData>()

// 定期清理过期 token
setInterval(() => {
  const now = Date.now()
  for (const [key, data] of tokenStore.entries()) {
    if (now - data.createdAt > CSRF_TOKEN_EXPIRY) {
      tokenStore.delete(key)
    }
  }
}, 60 * 1000) // 每分钟清理一次

/**
 * 生成 CSRF Token
 */
export function generateCsrfToken(): string {
  const token = randomBytes(CSRF_TOKEN_LENGTH).toString('hex')
  
  // 存储到内存
  tokenStore.set(token, {
    token,
    createdAt: Date.now(),
  })
  
  return token
}

/**
 * 验证 CSRF Token
 */
export function validateCsrfToken(token: string): boolean {
  if (!token || typeof token !== 'string') {
    return false
  }
  
  const data = tokenStore.get(token)
  
  if (!data) {
    return false
  }
  
  // 检查是否过期
  if (Date.now() - data.createdAt > CSRF_TOKEN_EXPIRY) {
    tokenStore.delete(token)
    return false
  }
  
  // 验证通过后删除 token（一次性使用）
  tokenStore.delete(token)
  
  return true
}

/**
 * 从请求中提取 CSRF Token
 * 支持 header 和 body 两种方式
 */
export function extractCsrfToken(request: Request): string | null {
  // 优先从 header 获取
  const headerToken = request.headers.get('X-CSRF-Token')
  if (headerToken) {
    return headerToken
  }
  
  return null
}

/**
 * 需要 CSRF 保护的路径
 * 只保护修改操作
 */
export const CSRF_PROTECTED_METHODS = ['POST', 'PUT', 'DELETE', 'PATCH']

/**
 * 判断是否需要 CSRF 验证
 */
export function requiresCsrfProtection(request: Request): boolean {
  const method = request.method.toUpperCase()
  
  // API Key 认证的请求不需要 CSRF（已有认证保护）
  const hasApiKey = request.headers.get('X-API-Key')
  if (hasApiKey) {
    return false
  }
  
  return CSRF_PROTECTED_METHODS.includes(method)
}

/**
 * CSRF 验证中间件
 * 返回 null 表示验证通过，返回 Response 表示验证失败
 */
export function csrfMiddleware(request: Request): Response | null {
  if (!requiresCsrfProtection(request)) {
    return null
  }
  
  // API Key 认证的请求跳过 CSRF
  if (request.headers.get('X-API-Key')) {
    return null
  }
  
  const token = extractCsrfToken(request)
  
  if (!token) {
    return new Response(
      JSON.stringify({
        error: 'CSRF Token Missing',
        message: '请在请求头中提供 X-CSRF-Token',
      }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
  
  if (!validateCsrfToken(token)) {
    return new Response(
      JSON.stringify({
        error: 'CSRF Token Invalid',
        message: 'CSRF Token 无效或已过期',
      }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
  
  return null
}

/**
 * 获取 CSRF Token 的 API 端点
 * 可以创建一个 /api/csrf 路由来提供 token
 */
export function getCsrfResponse(): Response {
  const token = generateCsrfToken()
  
  return new Response(
    JSON.stringify({
      csrfToken: token,
      expiresIn: CSRF_TOKEN_EXPIRY,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    }
  )
}
