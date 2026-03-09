import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { validateApiKey, unauthorizedResponse, errorResponse } from '@/lib/auth'

describe('Authentication', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  describe('validateApiKey', () => {
    it('should reject requests when no API key is configured in production', () => {
      process.env.NODE_ENV = 'production'
      process.env.API_KEY = undefined
      process.env.REQUIRE_AUTH = undefined

      const request = new NextRequest('http://localhost:3000/api/board/list')
      expect(validateApiKey(request)).toBe(false)
    })

    it('should accept valid API key', () => {
      process.env.NODE_ENV = 'production'
      process.env.API_KEY = 'test-api-key'

      const request = new NextRequest('http://localhost:3000/api/board/list', {
        headers: { 'X-API-Key': 'test-api-key' }
      })
      expect(validateApiKey(request)).toBe(true)
    })

    it('should reject invalid API key', () => {
      process.env.NODE_ENV = 'production'
      process.env.API_KEY = 'test-api-key'

      const request = new NextRequest('http://localhost:3000/api/board/list', {
        headers: { 'X-API-Key': 'wrong-key' }
      })
      expect(validateApiKey(request)).toBe(false)
    })

    it('should reject missing API key header', () => {
      process.env.NODE_ENV = 'production'
      process.env.API_KEY = 'test-api-key'

      const request = new NextRequest('http://localhost:3000/api/board/list')
      expect(validateApiKey(request)).toBe(false)
    })

    it('should allow requests in development without API key', () => {
      process.env.NODE_ENV = 'development'
      process.env.API_KEY = undefined

      const request = new NextRequest('http://localhost:3000/api/board/list')
      expect(validateApiKey(request)).toBe(true)
    })

    it('should enforce authentication when REQUIRE_AUTH=true', () => {
      process.env.NODE_ENV = 'development'
      process.env.REQUIRE_AUTH = 'true'
      process.env.API_KEY = 'test-api-key'

      const request = new NextRequest('http://localhost:3000/api/board/list')
      expect(validateApiKey(request)).toBe(false)
    })

    it('should skip authentication when REQUIRE_AUTH=false', () => {
      process.env.NODE_ENV = 'production'
      process.env.REQUIRE_AUTH = 'false'

      const request = new NextRequest('http://localhost:3000/api/board/list')
      expect(validateApiKey(request)).toBe(true)
    })
  })

  describe('unauthorizedResponse', () => {
    it('should return 401 response', () => {
      const response = unauthorizedResponse()
      expect(response.status).toBe(401)
    })
  })

  describe('errorResponse', () => {
    it('should return error response with status', () => {
      const response = errorResponse('Test error', { status: 400 })
      expect(response.status).toBe(400)
    })

    it('should include details in development', async () => {
      process.env.NODE_ENV = 'development'
      const response = errorResponse('Test error', { details: 'More info' })
      const body = await response.json()
      expect(body).toHaveProperty('details', 'More info')
    })
  })
})
