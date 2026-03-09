import { NextRequest, NextResponse } from 'next/server'

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  message?: string
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const stores: Map<string, RateLimitStore> = new Map()

function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0]?.trim() || realIp || 'unknown'
  return ip
}

function cleanupStore(store: RateLimitStore, now: number): void {
  for (const [key, value] of Object.entries(store)) {
    if (now > value.resetTime) {
      delete store[key]
    }
  }
}

export function createRateLimiter(config: RateLimitConfig) {
  const { windowMs, maxRequests, message = 'Too many requests, please try again later.' } = config

  return function rateLimiter(
    request: NextRequest,
    identifier?: string
  ): { success: boolean; remaining: number; resetTime: number } | NextResponse {
    const storeKey = identifier || 'default'
    
    let store = stores.get(storeKey)
    if (!store) {
      store = {}
      stores.set(storeKey, store)
    }

    const now = Date.now()
    const clientId = getClientIdentifier(request)
    
    cleanupStore(store, now)

    const clientData = store[clientId]
    
    if (!clientData || now > clientData.resetTime) {
      store[clientId] = {
        count: 1,
        resetTime: now + windowMs
      }
      return { success: true, remaining: maxRequests - 1, resetTime: now + windowMs }
    }

    if (clientData.count >= maxRequests) {
      return NextResponse.json(
        {
          error: 'Too Many Requests',
          message,
          retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': clientData.resetTime.toString(),
            'Retry-After': Math.ceil((clientData.resetTime - now) / 1000).toString()
          }
        }
      )
    }

    clientData.count++
    return { success: true, remaining: maxRequests - clientData.count, resetTime: clientData.resetTime }
  }
}

export const apiRateLimit = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 60,
  message: 'API rate limit exceeded. Maximum 60 requests per minute.'
})

export const strictRateLimit = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 10,
  message: 'Too many requests. Maximum 10 requests per minute for this endpoint.'
})
