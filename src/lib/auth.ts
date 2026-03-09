import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

/**
 * 时序安全的字符串比较
 * 防止通过响应时间推断正确的 API Key
 */
function timingSafeEqualString(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8')
  const bufB = Buffer.from(b, 'utf8')
  
  // 如果长度不同，仍执行比较以保持恒定时间
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA)
    return false
  }
  
  return crypto.timingSafeEqual(bufA, bufB)
}

/**
 * API Key 验证
 * 
 * 认证策略（按优先级）：
 * 1. REQUIRE_AUTH=true 时，必须提供有效的 API_KEY
 * 2. 生产环境（NODE_ENV=production）且未显式设置 REQUIRE_AUTH=false 时，必须提供 API_KEY
 * 3. 开发环境且 REQUIRE_AUTH 未设置时，允许无认证访问
 */
export function validateApiKey(request: NextRequest): boolean {
  const validApiKey = process.env.API_KEY
  const requireAuth = process.env.REQUIRE_AUTH
  const isProduction = process.env.NODE_ENV === 'production'

  // 1. 显式要求认证
  if (requireAuth === 'true') {
    if (!validApiKey) {
      console.error('CRITICAL: REQUIRE_AUTH=true but API_KEY not configured!')
      return false
    }
    const apiKey = request.headers.get('X-API-Key')
    if (!apiKey) return false
    return timingSafeEqualString(apiKey, validApiKey)
  }

  // 2. 显式禁用认证（不推荐用于生产）
  if (requireAuth === 'false') {
    if (isProduction) {
      console.warn('WARNING: REQUIRE_AUTH=false in production environment!')
    }
    return true
  }

  // 3. 生产环境默认要求认证
  if (isProduction) {
    if (!validApiKey) {
      console.error('CRITICAL: Production environment but API_KEY not configured!')
      return false
    }
    const apiKey = request.headers.get('X-API-Key')
    if (!apiKey) return false
    return timingSafeEqualString(apiKey, validApiKey)
  }

  // 4. 开发环境默认允许无认证
  if (!validApiKey) {
    return true
  }

  const apiKey = request.headers.get('X-API-Key')
  if (!apiKey) return true // 开发环境无 API Key 时允许
  return timingSafeEqualString(apiKey, validApiKey)
}

// 认证错误响应
export function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'Unauthorized. Provide valid X-API-Key header.' },
    { status: 401 }
  )
}

// 获取客户端 IP
export function getClientIp(request: NextRequest): string | undefined {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() 
    || request.headers.get('x-real-ip') 
    || undefined
}

// 获取 User Agent
export function getUserAgent(request: NextRequest): string | undefined {
  return request.headers.get('user-agent') || undefined
}

/**
 * 创建错误响应
 * 生产环境：简化错误信息，避免泄露实现细节
 * 开发环境：返回详细错误信息，便于调试
 */
export function errorResponse(
  error: string,
  options: {
    status?: number
    details?: string
    hint?: string
  } = {}
): NextResponse {
  const { status = 400, details, hint } = options
  const isProduction = process.env.NODE_ENV === 'production'

  if (isProduction) {
    // 生产环境：简化响应
    return NextResponse.json(
      { error },
      { status }
    )
  }

  // 开发环境：详细响应
  const body: Record<string, string> = { error }
  if (details) body.details = details
  if (hint) body.hint = hint

  return NextResponse.json(body, { status })
}

// 判断是否为生产环境
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}
