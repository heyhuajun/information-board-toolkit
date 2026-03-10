import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockQuery = vi.fn()
const mockConnect = vi.fn()

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
  return {
    default: {
      createHash,
      timingSafeEqual: vi.fn(() => true),
    },
    createHash,
    timingSafeEqual: vi.fn(() => true),
  }
})

describe('Database Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetModules()
  })

  describe('initializeDatabase', () => {
    it('should create tables and indexes', async () => {
      const mockClient = {
        query: vi.fn().mockResolvedValue({ rows: [] }),
        release: vi.fn(),
      }
      mockConnect.mockResolvedValue(mockClient)

      const { initializeDatabase } = await import('@/lib/db')
      await initializeDatabase()

      expect(mockClient.query).toHaveBeenCalledTimes(1)
      expect(mockClient.release).toHaveBeenCalled()
    })
  })

  describe('createBoard', () => {
    it('should create a board and return with owner token', async () => {
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
      mockQuery.mockResolvedValue({ rows: [mockRow], rowCount: 1 })

      const { createBoard } = await import('@/lib/db')
      const result = await createBoard({
        title: 'Test Board',
        description: 'Test description',
        layout: { type: 'card', title: 'Test', value: 100 },
      })

      expect(result.id).toBe('test-id-21')
      expect(result.title).toBe('Test Board')
      expect(result.ownerToken).toBe('test-id-16')
      expect(result.shareToken).toBe('test-id-16')
    })

    it('should create a board with expiration', async () => {
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
      mockQuery.mockResolvedValue({ rows: [mockRow], rowCount: 1 })

      const { createBoard } = await import('@/lib/db')
      const result = await createBoard({
        title: 'Test Board',
        layout: { type: 'card', title: 'Test', value: 100 },
        expiresIn: '1h',
      })

      expect(result.id).toBeDefined()
    })

    it('should create a board with meta information', async () => {
      const mockRow = {
        id: 'test-id-21',
        title: 'Test Board',
        description: null,
        layout: JSON.stringify({ type: 'card', title: 'Test', value: 100 }),
        meta: JSON.stringify({ author: 'Test Author', tags: ['tag1', 'tag2'] }),
        share_token: 'test-id-16',
        owner_token_hash: 'hashed-token',
        expires_at: null,
        views: 0,
        created_at: new Date(),
        updated_at: new Date(),
        author: 'Test Author',
      }
      mockQuery.mockResolvedValue({ rows: [mockRow], rowCount: 1 })

      const { createBoard } = await import('@/lib/db')
      const result = await createBoard({
        title: 'Test Board',
        layout: { type: 'card', title: 'Test', value: 100 },
        meta: { author: 'Test Author', tags: ['tag1', 'tag2'] },
      })

      expect(result.id).toBeDefined()
    })
  })

  describe('getBoardById', () => {
    it('should return board when found', async () => {
      const mockRow = {
        id: 'test-id',
        title: 'Test Board',
        description: 'Test description',
        layout: JSON.stringify({ type: 'card', title: 'Test', value: 100 }),
        meta: null,
        share_token: 'share-token',
        owner_token_hash: 'hashed',
        expires_at: null,
        views: 5,
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-02'),
        author: null,
      }
      mockQuery.mockResolvedValue({ rows: [mockRow], rowCount: 1 })

      const { getBoardById } = await import('@/lib/db')
      const result = await getBoardById('test-id')

      expect(result).not.toBeNull()
      expect(result?.id).toBe('test-id')
      expect(result?.title).toBe('Test Board')
      expect(result?.views).toBe(5)
    })

    it('should return null when board not found', async () => {
      mockQuery.mockResolvedValue({ rows: [], rowCount: 0 })

      const { getBoardById } = await import('@/lib/db')
      const result = await getBoardById('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('getBoardByToken', () => {
    it('should return board when found and not expired', async () => {
      const mockRow = {
        id: 'test-id',
        title: 'Test Board',
        description: null,
        layout: JSON.stringify({ type: 'card', title: 'Test', value: 100 }),
        meta: null,
        share_token: 'valid-token',
        owner_token_hash: 'hashed',
        expires_at: null,
        views: 0,
        created_at: new Date(),
        updated_at: new Date(),
        author: null,
      }
      mockQuery.mockResolvedValue({ rows: [mockRow], rowCount: 1 })

      const { getBoardByToken } = await import('@/lib/db')
      const result = await getBoardByToken('valid-token')

      expect(result).not.toBeNull()
      expect(result?.shareToken).toBe('valid-token')
    })

    it('should return null when board is expired', async () => {
      const mockRow = {
        id: 'test-id',
        title: 'Test Board',
        description: null,
        layout: JSON.stringify({ type: 'card', title: 'Test', value: 100 }),
        meta: null,
        share_token: 'expired-token',
        owner_token_hash: 'hashed',
        expires_at: new Date(Date.now() - 3600000),
        views: 0,
        created_at: new Date(),
        updated_at: new Date(),
        author: null,
      }
      mockQuery.mockResolvedValue({ rows: [mockRow], rowCount: 1 })

      const { getBoardByToken } = await import('@/lib/db')
      const result = await getBoardByToken('expired-token')

      expect(result).toBeNull()
    })

    it('should return null when board not found', async () => {
      mockQuery.mockResolvedValue({ rows: [], rowCount: 0 })

      const { getBoardByToken } = await import('@/lib/db')
      const result = await getBoardByToken('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('verifyOwnerToken', () => {
    it('should return true for valid owner token', async () => {
      mockQuery.mockResolvedValue({
        rows: [{ owner_token_hash: 'hashed-token' }],
        rowCount: 1,
      })

      const { verifyOwnerToken } = await import('@/lib/db')
      const result = await verifyOwnerToken('board-id', 'valid-token')

      expect(result).toBe(true)
    })

    it('should return false for invalid owner token', async () => {
      mockQuery.mockResolvedValue({
        rows: [{ owner_token_hash: 'different-hash' }],
        rowCount: 1,
      })

      const crypto = await import('crypto')
      vi.mocked(crypto.timingSafeEqual).mockReturnValueOnce(false)

      const { verifyOwnerToken } = await import('@/lib/db')
      const result = await verifyOwnerToken('board-id', 'invalid-token')

      expect(result).toBe(false)
    })

    it('should return false when board not found', async () => {
      mockQuery.mockResolvedValue({ rows: [], rowCount: 0 })

      const { verifyOwnerToken } = await import('@/lib/db')
      const result = await verifyOwnerToken('non-existent', 'token')

      expect(result).toBe(false)
    })

    it('should return false for empty token', async () => {
      const { verifyOwnerToken } = await import('@/lib/db')
      const result = await verifyOwnerToken('board-id', '')

      expect(result).toBe(false)
    })

    it('should return false for null token', async () => {
      const { verifyOwnerToken } = await import('@/lib/db')
      const result = await verifyOwnerToken('board-id', null as unknown as string)

      expect(result).toBe(false)
    })
  })

  describe('updateBoard', () => {
    it('should update board title', async () => {
      mockQuery.mockResolvedValue({ rows: [], rowCount: 1 })

      const { updateBoard } = await import('@/lib/db')
      const result = await updateBoard('board-id', { title: 'New Title' })

      expect(result).toBe(true)
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE boards'),
        expect.arrayContaining(['New Title'])
      )
    })

    it('should update multiple fields', async () => {
      mockQuery.mockResolvedValue({ rows: [], rowCount: 1 })

      const { updateBoard } = await import('@/lib/db')
      const result = await updateBoard('board-id', {
        title: 'New Title',
        description: 'New Description',
      })

      expect(result).toBe(true)
    })

    it('should update layout', async () => {
      mockQuery.mockResolvedValue({ rows: [], rowCount: 1 })

      const { updateBoard } = await import('@/lib/db')
      const result = await updateBoard('board-id', {
        layout: { type: 'card', title: 'Updated', value: 200 },
      })

      expect(result).toBe(true)
    })

    it('should return false when no updates provided', async () => {
      const { updateBoard } = await import('@/lib/db')
      const result = await updateBoard('board-id', {})

      expect(result).toBe(false)
    })

    it('should return false when board not found', async () => {
      mockQuery.mockResolvedValue({ rows: [], rowCount: 0 })

      const { updateBoard } = await import('@/lib/db')
      const result = await updateBoard('non-existent', { title: 'New Title' })

      expect(result).toBe(false)
    })
  })

  describe('deleteBoard', () => {
    it('should delete board and return true', async () => {
      mockQuery.mockResolvedValue({ rows: [], rowCount: 1 })

      const { deleteBoard } = await import('@/lib/db')
      const result = await deleteBoard('board-id')

      expect(result).toBe(true)
    })

    it('should return false when board not found', async () => {
      mockQuery.mockResolvedValue({ rows: [], rowCount: 0 })

      const { deleteBoard } = await import('@/lib/db')
      const result = await deleteBoard('non-existent')

      expect(result).toBe(false)
    })
  })

  describe('listBoards', () => {
    it('should list boards with default pagination', async () => {
      mockQuery
        .mockResolvedValueOnce({ rows: [{ count: '2' }] })
        .mockResolvedValueOnce({
          rows: [
            { id: '1', title: 'Board 1', views: 10, created_at: new Date() },
            { id: '2', title: 'Board 2', views: 5, created_at: new Date() },
          ],
        })

      const { listBoards } = await import('@/lib/db')
      const result = await listBoards({})

      expect(result.items).toHaveLength(2)
      expect(result.total).toBe(2)
    })

    it('should filter by author', async () => {
      mockQuery
        .mockResolvedValueOnce({ rows: [{ count: '1' }] })
        .mockResolvedValueOnce({
          rows: [
            { id: '1', title: 'Board 1', views: 10, created_at: new Date() },
          ],
        })

      const { listBoards } = await import('@/lib/db')
      const result = await listBoards({ author: 'test-author' })

      expect(result.items).toHaveLength(1)
      expect(result.total).toBe(1)
    })

    it('should respect limit and offset', async () => {
      mockQuery
        .mockResolvedValueOnce({ rows: [{ count: '100' }] })
        .mockResolvedValueOnce({
          rows: [
            { id: '1', title: 'Board 1', views: 10, created_at: new Date() },
          ],
        })

      const { listBoards } = await import('@/lib/db')
      const result = await listBoards({ limit: 1, offset: 10 })

      expect(result.items).toHaveLength(1)
      expect(result.total).toBe(100)
    })
  })

  describe('incrementViews', () => {
    it('should increment views and log view event', async () => {
      const mockClient = {
        query: vi.fn()
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce(undefined),
        release: vi.fn(),
      }
      mockConnect.mockResolvedValue(mockClient)

      const { incrementViews } = await import('@/lib/db')
      await incrementViews('board-id', '127.0.0.1', 'Mozilla/5.0')

      expect(mockClient.query).toHaveBeenCalledWith('BEGIN')
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE boards SET views'),
        ['board-id']
      )
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT')
    })

    it('should handle error gracefully', async () => {
      const mockClient = {
        query: vi.fn()
          .mockResolvedValueOnce(undefined)
          .mockRejectedValueOnce(new Error('DB error')),
        release: vi.fn(),
      }
      mockConnect.mockResolvedValue(mockClient)

      const { incrementViews } = await import('@/lib/db')
      await incrementViews('board-id')
    })
  })

  describe('cleanupExpiredBoards', () => {
    it('should delete expired boards', async () => {
      const mockClient = {
        query: vi.fn()
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce({ rows: [{ id: 'expired-1' }, { id: 'expired-2' }] })
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce({ rowCount: 2 })
          .mockResolvedValueOnce(undefined),
        release: vi.fn(),
      }
      mockConnect.mockResolvedValue(mockClient)

      const { cleanupExpiredBoards } = await import('@/lib/db')
      const result = await cleanupExpiredBoards()

      expect(result.deleted).toBe(2)
    })

    it('should return 0 when no expired boards', async () => {
      const mockClient = {
        query: vi.fn()
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce({ rows: [] })
          .mockResolvedValueOnce(undefined),
        release: vi.fn(),
      }
      mockConnect.mockResolvedValue(mockClient)

      const { cleanupExpiredBoards } = await import('@/lib/db')
      const result = await cleanupExpiredBoards()

      expect(result.deleted).toBe(0)
    })

    it('should rollback on error', async () => {
      const mockClient = {
        query: vi.fn()
          .mockResolvedValueOnce(undefined)
          .mockRejectedValueOnce(new Error('DB error')),
        release: vi.fn(),
      }
      mockConnect.mockResolvedValue(mockClient)

      const { cleanupExpiredBoards } = await import('@/lib/db')
      
      await expect(cleanupExpiredBoards()).rejects.toThrow()
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK')
    })
  })

  describe('checkRateLimit', () => {
    it('should allow request under limit', async () => {
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

      const { checkRateLimit } = await import('@/lib/db')
      const result = await checkRateLimit('submit', '127.0.0.1', 10, 60000)

      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(9)
    })

    it('should deny request over limit', async () => {
      const resetAt = new Date(Date.now() + 60000)
      const mockClient = {
        query: vi.fn()
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce({ rows: [{ count: 10, reset_at: resetAt }] })
          .mockResolvedValueOnce(undefined),
        release: vi.fn(),
      }
      mockConnect.mockResolvedValue(mockClient)

      const { checkRateLimit } = await import('@/lib/db')
      const result = await checkRateLimit('submit', '127.0.0.1', 10, 60000)

      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it('should count remaining requests', async () => {
      const resetAt = new Date(Date.now() + 60000)
      const mockClient = {
        query: vi.fn()
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce({ rows: [{ count: 5, reset_at: resetAt }] })
          .mockResolvedValueOnce(undefined)
          .mockResolvedValueOnce(undefined),
        release: vi.fn(),
      }
      mockConnect.mockResolvedValue(mockClient)

      const { checkRateLimit } = await import('@/lib/db')
      const result = await checkRateLimit('submit', '127.0.0.1', 10, 60000)

      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(4)
    })
  })

  describe('healthCheck', () => {
    it('should return true when database is healthy', async () => {
      mockQuery.mockResolvedValue({ rows: [{ '?column?': 1 }], rowCount: 1 })

      const { healthCheck } = await import('@/lib/db')
      const result = await healthCheck()

      expect(result).toBe(true)
    })

    it('should return false when database is unhealthy', async () => {
      mockQuery.mockRejectedValue(new Error('Connection failed'))

      const { healthCheck } = await import('@/lib/db')
      const result = await healthCheck()

      expect(result).toBe(false)
    })
  })
})
