import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

const mockQuery = vi.hoisted(() => vi.fn())
const mockConnect = vi.hoisted(() => vi.fn())

vi.mock('pg', () => {
  class MockPool {
    query = mockQuery
    connect = mockConnect
    on = vi.fn()
  }
  return {
    default: { Pool: MockPool },
    Pool: MockPool,
  }
})

vi.mock('nanoid', () => ({
  nanoid: vi.fn((length?: number) => `test-id-${length || 21}`),
}))

vi.mock('crypto', () => {
  const createHash = vi.fn(() => ({
    update: vi.fn(() => ({
      digest: vi.fn(() => 'hashed-token'),
    })),
  }))
  const timingSafeEqual = vi.fn(() => true)
  return {
    default: {
      createHash,
      timingSafeEqual,
    },
    createHash,
    timingSafeEqual,
  }
})

describe('Board API Endpoints', () => {
  beforeEach(() => {
    mockQuery.mockReset()
    mockConnect.mockReset()
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('DATABASE_URL', 'postgresql://test:test@localhost:5432/test')
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000')

    const mockClient = {
      query: vi.fn()
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined),
      release: vi.fn(),
    }
    mockConnect.mockResolvedValue(mockClient)
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe('POST /api/board/submit', () => {
    it('should create a board successfully', async () => {
      const mockRow = {
        id: 'test-id-21',
        title: 'Test Board',
        description: 'Test description',
        layout: JSON.stringify({ type: 'card', title: 'Test', value: 100 }),
        meta: null,
        share_token: 'test-id-16',
        owner_token_hash: 'hashed-token',
        expires_at: null,
        views: 0,
        created_at: new Date(),
        updated_at: new Date(),
        author: null,
      }

      const mockClient = {
        query: vi.fn()
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce({ rows: [] })
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce(undefined),
        release: vi.fn(),
      }

      mockQuery.mockResolvedValue({ rows: [mockRow], rowCount: 1 })
      mockConnect.mockResolvedValue(mockClient)

      const { POST } = await import('@/app/api/board/submit/route')
      const request = new NextRequest('http://localhost:3000/api/board/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test Board',
          description: 'Test description',
          layout: { type: 'card', title: 'Test', value: 100 },
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data.id).toBe('test-id-21')
      expect(data.data.ownerToken).toBe('test-id-16')
    })

    it('should reject missing required fields', async () => {
      const { POST } = await import('@/app/api/board/submit/route')
      const request = new NextRequest('http://localhost:3000/api/board/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'No title or layout' }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
    })

    it('should reject invalid layout', async () => {
      const { POST } = await import('@/app/api/board/submit/route')
      const request = new NextRequest('http://localhost:3000/api/board/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test Board',
          layout: { invalid: 'structure' },
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
    })

    it('should reject title exceeding max length', async () => {
      const { POST } = await import('@/app/api/board/submit/route')
      const request = new NextRequest('http://localhost:3000/api/board/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'A'.repeat(201),
          layout: { type: 'card', title: 'Test', value: 100 },
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
    })

    it('should accept valid expiresIn values', async () => {
      const mockRow = {
        id: 'test-id-21',
        title: 'Test Board',
        description: null,
        layout: JSON.stringify({ type: 'card', title: 'Test', value: 100 }),
        meta: null,
        share_token: 'test-id-16',
        owner_token_hash: 'hashed-token',
        expires_at: new Date(Date.now() + 3600000),
        views: 0,
        created_at: new Date(),
        updated_at: new Date(),
        author: null,
      }

      const mockClient = {
        query: vi.fn()
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce({ rows: [] })
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce(undefined),
        release: vi.fn(),
      }

      mockQuery.mockResolvedValue({ rows: [mockRow], rowCount: 1 })
      mockConnect.mockResolvedValue(mockClient)

      const { POST } = await import('@/app/api/board/submit/route')
      const request = new NextRequest('http://localhost:3000/api/board/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test Board',
          layout: { type: 'card', title: 'Test', value: 100 },
          expiresIn: '1h',
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(201)
    })
  })

  describe('GET /api/board/view/[token]', () => {
    it('should return board with stats', async () => {
      const mockRow = {
        id: 'test-id',
        title: 'Test Board',
        description: null,
        layout: JSON.stringify({ type: 'card', title: 'Test', value: 100 }),
        meta: null,
        share_token: 'valid-token',
        owner_token_hash: 'hashed',
        expires_at: null,
        views: 5,
        created_at: new Date(),
        updated_at: new Date(),
        author: null,
      }

      const rateLimitClient = {
        query: vi.fn()
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce({ rows: [] })
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce(undefined),
        release: vi.fn(),
      }

      const incrementViewsClient = {
        query: vi.fn()
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce(undefined),
        release: vi.fn(),
      }

      mockQuery
        .mockResolvedValueOnce({ rows: [mockRow], rowCount: 1 })
        .mockResolvedValueOnce({ rows: [mockRow], rowCount: 1 })
        .mockResolvedValueOnce({ rows: [{ viewed_at: new Date() }] })

      mockConnect
        .mockResolvedValueOnce(rateLimitClient)
        .mockResolvedValueOnce(incrementViewsClient)

      const { GET } = await import('@/app/api/board/view/[token]/route')
      const request = new NextRequest('http://localhost:3000/api/board/view/valid-token')
      const params = Promise.resolve({ token: 'valid-token' })

      const response = await GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.id).toBe('test-id')
      expect(data.data.stats).toBeDefined()
    })

    it('should return 404 for non-existent board', async () => {
      const mockClient = {
        query: vi.fn()
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce({ rows: [] })
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce(undefined),
        release: vi.fn(),
      }

      mockQuery.mockResolvedValue({ rows: [], rowCount: 0 })
      mockConnect.mockResolvedValue(mockClient)

      const { GET } = await import('@/app/api/board/view/[token]/route')
      const request = new NextRequest('http://localhost:3000/api/board/view/non-existent')
      const params = Promise.resolve({ token: 'non-existent' })

      const response = await GET(request, { params })

      expect(response.status).toBe(404)
    })

    it('should return 404 for expired board', async () => {
      const mockRow = {
        id: 'test-id',
        title: 'Test Board',
        description: null,
        layout: JSON.stringify({ type: 'card', title: 'Test', value: 100 }),
        meta: null,
        share_token: 'expired-token',
        owner_token_hash: 'hashed',
        expires_at: new Date(Date.now() - 3600000),
        views: 5,
        created_at: new Date(),
        updated_at: new Date(),
        author: null,
      }

      const mockClient = {
        query: vi.fn()
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce({ rows: [] })
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce(undefined),
        release: vi.fn(),
      }

      mockQuery.mockResolvedValue({ rows: [mockRow], rowCount: 1 })
      mockConnect.mockResolvedValue(mockClient)

      const { GET } = await import('@/app/api/board/view/[token]/route')
      const request = new NextRequest('http://localhost:3000/api/board/view/expired-token')
      const params = Promise.resolve({ token: 'expired-token' })

      const response = await GET(request, { params })

      expect(response.status).toBe(404)
    })
  })

  describe('PUT /api/board/[id]', () => {
    it('should update board with valid owner token', async () => {
      const mockBoardRow = {
        id: 'test-id',
        title: 'New Title',
        description: null,
        layout: JSON.stringify({ type: 'card', title: 'Test', value: 100 }),
        meta: null,
        share_token: 'test-token',
        owner_token_hash: 'hashed-token',
        expires_at: null,
        views: 0,
        created_at: new Date(),
        updated_at: new Date(),
        author: null,
      }

      mockQuery
        .mockResolvedValueOnce({ rows: [{ owner_token_hash: 'hashed-token' }], rowCount: 1 })
        .mockResolvedValueOnce({ rows: [mockBoardRow], rowCount: 1 })
        .mockResolvedValueOnce({ rows: [], rowCount: 1 })
        .mockResolvedValueOnce({ rows: [mockBoardRow], rowCount: 1 })

      const { PUT } = await import('@/app/api/board/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/board/test-id', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Owner-Token': 'valid-token',
        },
        body: JSON.stringify({ title: 'New Title' }),
      })
      const params = Promise.resolve({ id: 'test-id' })

      const response = await PUT(request, { params })

      expect(response.status).toBe(200)
    })

    it('should reject update without owner token', async () => {
      const { PUT } = await import('@/app/api/board/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/board/test-id', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Title' }),
      })
      const params = Promise.resolve({ id: 'test-id' })

      const response = await PUT(request, { params })

      expect(response.status).toBe(403)
    })

    it('should reject update with invalid owner token', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ owner_token_hash: 'different-hash' }], rowCount: 1 })

      const crypto = await import('crypto')
      vi.mocked(crypto.timingSafeEqual).mockReturnValueOnce(false)

      const { PUT } = await import('@/app/api/board/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/board/test-id', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Owner-Token': 'invalid-token',
        },
        body: JSON.stringify({ title: 'New Title' }),
      })
      const params = Promise.resolve({ id: 'test-id' })

      const response = await PUT(request, { params })

      expect(response.status).toBe(403)
    })
  })

  describe('DELETE /api/board/[id]', () => {
    it('should delete board with valid owner token', async () => {
      const mockBoardRow = {
        id: 'test-id',
        title: 'Test Board',
        description: null,
        layout: JSON.stringify({ type: 'card', title: 'Test', value: 100 }),
        meta: null,
        share_token: 'test-token',
        owner_token_hash: 'hashed-token',
        expires_at: null,
        views: 0,
        created_at: new Date(),
        updated_at: new Date(),
        author: null,
      }

      mockQuery
        .mockResolvedValueOnce({ rows: [{ owner_token_hash: 'hashed-token' }], rowCount: 1 })
        .mockResolvedValueOnce({ rows: [mockBoardRow], rowCount: 1 })
        .mockResolvedValueOnce({ rows: [], rowCount: 1 })

      const { DELETE } = await import('@/app/api/board/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/board/test-id', {
        method: 'DELETE',
        headers: { 'X-Owner-Token': 'valid-token' },
      })
      const params = Promise.resolve({ id: 'test-id' })

      const response = await DELETE(request, { params })

      expect(response.status).toBe(200)
    })

    it('should reject delete without owner token', async () => {
      const { DELETE } = await import('@/app/api/board/[id]/route')
      const request = new NextRequest('http://localhost:3000/api/board/test-id', {
        method: 'DELETE',
      })
      const params = Promise.resolve({ id: 'test-id' })

      const response = await DELETE(request, { params })

      expect(response.status).toBe(403)
    })
  })

  describe('POST /api/cron/cleanup', () => {
    it('should cleanup expired boards', async () => {
      const mockClient = {
        query: vi.fn()
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce({ rows: [{ id: 'expired-1' }] })
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce({ rowCount: 1 })
          .mockResolvedValueOnce(undefined),
        release: vi.fn(),
      }
      mockConnect.mockResolvedValue(mockClient)

      const { POST } = await import('@/app/api/cron/cleanup/route')
      const request = new NextRequest('http://localhost:3000/api/cron/cleanup', {
        method: 'POST',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.deleted).toBe(1)
    })

    it('should verify cron secret when configured', async () => {
      vi.stubEnv('CRON_SECRET', 'test-secret')

      const mockClient = {
        query: vi.fn()
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce({ rows: [] })
          .mockResolvedValueOnce(undefined),
        release: vi.fn(),
      }
      mockConnect.mockResolvedValue(mockClient)

      const { POST } = await import('@/app/api/cron/cleanup/route')
      const request = new NextRequest('http://localhost:3000/api/cron/cleanup', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer test-secret' },
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
    })

    it('should reject invalid cron secret', async () => {
      vi.stubEnv('CRON_SECRET', 'test-secret')

      const { POST } = await import('@/app/api/cron/cleanup/route')
      const request = new NextRequest('http://localhost:3000/api/cron/cleanup', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer wrong-secret' },
      })

      const response = await POST(request)
      expect(response.status).toBe(401)
    })
  })
})
