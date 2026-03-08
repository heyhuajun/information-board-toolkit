import { NextRequest, NextResponse } from 'next/server'

// API Key 验证
export function validateApiKey(request: NextRequest): boolean {
  // 从环境变量获取 API Key
  const validApiKey = process.env.API_KEY
  
  // 如果没有配置 API Key，则允许所有请求（开发模式）
  if (!validApiKey) {
    return true
  }
  
  // 从请求头获取 API Key
  const apiKey = request.headers.get('X-API-Key')
  
  // 验证 API Key
  return apiKey === validApiKey
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
