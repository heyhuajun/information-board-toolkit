import { describe, it, expect, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('next/server', async () => {
  const actual = await vi.importActual('next/server')
  return {
    ...actual,
  }
})

describe('Authentication Utils', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  describe('validateApiKey with stubbed env', () => {
    it('should validate API key correctly', async () => {
      vi.stubEnv('NODE_ENV', 'production')
      vi.stubEnv('API_KEY', 'test-api-key-with-32-characters!!')
      
      const { validateApiKey } = await import('@/lib/auth')
      
      const validRequest = new NextRequest('http://localhost:3000/api/test', {
        headers: { 'X-API-Key': 'test-api-key-with-32-characters!!' }
      })
      expect(validateApiKey(validRequest)).toBe(true)
      
      const invalidRequest = new NextRequest('http://localhost:3000/api/test', {
        headers: { 'X-API-Key': 'wrong-key' }
      })
      expect(validateApiKey(invalidRequest)).toBe(false)
    })

    it('should allow REQUIRE_AUTH=false to skip auth', async () => {
      vi.stubEnv('NODE_ENV', 'production')
      vi.stubEnv('REQUIRE_AUTH', 'false')
      
      const { validateApiKey } = await import('@/lib/auth')
      
      const request = new NextRequest('http://localhost:3000/api/test')
      expect(validateApiKey(request)).toBe(true)
    })
  })

  describe('unauthorizedResponse', () => {
    it('should return 401 response', async () => {
      const { unauthorizedResponse } = await import('@/lib/auth')
      const response = unauthorizedResponse()
      expect(response.status).toBe(401)
    })
  })

  describe('errorResponse', () => {
    it('should return error response with status', async () => {
      vi.stubEnv('NODE_ENV', 'development')
      const { errorResponse } = await import('@/lib/auth')
      const response = errorResponse('Test error', { status: 400 })
      expect(response.status).toBe(400)
    })
  })
})
