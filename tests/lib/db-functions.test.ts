import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import path from 'path'
import fs from 'fs'
import {
  createBoard,
  getBoardById,
  getBoardByToken,
  verifyOwnerToken,
  updateBoard,
  deleteBoard,
  listBoards,
  incrementViews,
  getViewStats
} from '@/lib/db'

describe('Database Functions', () => {
  const testDbPath = path.join(process.cwd(), 'data', 'test-db-functions.db')
  
  beforeAll(() => {
    process.env.DATABASE_URL = testDbPath
    
    const dataDir = path.dirname(testDbPath)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
  })

  afterAll(() => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath)
    }
  })

  describe('createBoard', () => {
    it('should create a board with minimal data', () => {
      const board = createBoard({
        title: 'Test Board',
        layout: { type: 'section', children: [] },
        expiresIn: 'never'
      })

      expect(board.id).toBeDefined()
      expect(board.shareToken).toBeDefined()
      expect(board.ownerToken).toBeDefined()
      expect(board.title).toBe('Test Board')
      expect(board.views).toBe(0)
      expect(board.expiresAt).toBeUndefined()
    })

    it('should create a board with expiration', () => {
      const board = createBoard({
        title: 'Test Board',
        layout: { type: 'section', children: [] },
        expiresIn: '7d'
      })

      expect(board.expiresAt).toBeDefined()
      const expiresAt = new Date(board.expiresAt!)
      const now = new Date()
      const sevenDays = 7 * 24 * 60 * 60 * 1000
      expect(expiresAt.getTime() - now.getTime()).toBeLessThanOrEqual(sevenDays + 1000)
    })

    it('should create a board with description and meta', () => {
      const board = createBoard({
        title: 'Test Board',
        description: 'Test Description',
        layout: { type: 'section', children: [] },
        expiresIn: 'never',
        meta: { author: 'test', tags: ['tag1', 'tag2'] }
      })

      expect(board.description).toBe('Test Description')
      expect(board.meta?.author).toBe('test')
      expect(board.meta?.tags).toEqual(['tag1', 'tag2'])
    })
  })

  describe('getBoardById', () => {
    it('should return null for non-existent board', () => {
      const board = getBoardById('non-existent-id')
      expect(board).toBeNull()
    })

    it('should return board by id', () => {
      const created = createBoard({
        title: 'Test Board',
        layout: { type: 'section', children: [] },
        expiresIn: 'never'
      })

      const board = getBoardById(created.id)
      expect(board).not.toBeNull()
      expect(board?.id).toBe(created.id)
    })
  })

  describe('getBoardByToken', () => {
    it('should return null for non-existent token', () => {
      const board = getBoardByToken('non-existent-token')
      expect(board).toBeNull()
    })

    it('should return board by share token', () => {
      const created = createBoard({
        title: 'Test Board',
        layout: { type: 'section', children: [] },
        expiresIn: 'never'
      })

      const board = getBoardByToken(created.shareToken)
      expect(board).not.toBeNull()
      expect(board?.shareToken).toBe(created.shareToken)
    })
  })

  describe('verifyOwnerToken', () => {
    it('should return false for non-existent board', () => {
      const result = verifyOwnerToken('non-existent-id', 'token')
      expect(result).toBe(false)
    })

    it('should return true for valid owner token', () => {
      const created = createBoard({
        title: 'Test Board',
        layout: { type: 'section', children: [] },
        expiresIn: 'never'
      })

      const result = verifyOwnerToken(created.id, created.ownerToken)
      expect(result).toBe(true)
    })

    it('should return false for invalid owner token', () => {
      const created = createBoard({
        title: 'Test Board',
        layout: { type: 'section', children: [] },
        expiresIn: 'never'
      })

      const result = verifyOwnerToken(created.id, 'invalid-token')
      expect(result).toBe(false)
    })
  })

  describe('updateBoard', () => {
    it('should update board title', () => {
      const created = createBoard({
        title: 'Original Title',
        layout: { type: 'section', children: [] },
        expiresIn: 'never'
      })

      const success = updateBoard(created.id, { title: 'Updated Title' })
      expect(success).toBe(true)

      const board = getBoardById(created.id)
      expect(board?.title).toBe('Updated Title')
    })

    it('should return false for non-existent board', () => {
      const success = updateBoard('non-existent-id', { title: 'New Title' })
      expect(success).toBe(false)
    })
  })

  describe('deleteBoard', () => {
    it('should delete a board', () => {
      const created = createBoard({
        title: 'Test Board',
        layout: { type: 'section', children: [] },
        expiresIn: 'never'
      })

      const success = deleteBoard(created.id)
      expect(success).toBe(true)

      const board = getBoardById(created.id)
      expect(board).toBeNull()
    })

    it('should return false for non-existent board', () => {
      const success = deleteBoard('non-existent-id')
      expect(success).toBe(false)
    })
  })

  describe('listBoards', () => {
    it('should return list of boards', () => {
      const board1 = createBoard({
        title: 'List Test Board 1',
        layout: { type: 'section', children: [] },
        expiresIn: 'never'
      })
      const board2 = createBoard({
        title: 'List Test Board 2',
        layout: { type: 'section', children: [] },
        expiresIn: 'never'
      })

      const result = listBoards({})
      expect(result.items.length).toBeGreaterThanOrEqual(2)
      expect(result.total).toBeGreaterThanOrEqual(2)
      expect(result.items.some(b => b.id === board1.id)).toBe(true)
      expect(result.items.some(b => b.id === board2.id)).toBe(true)
    })

    it('should filter by author', () => {
      const board = createBoard({
        title: 'Board by Test Author',
        layout: { type: 'section', children: [] },
        expiresIn: 'never',
        meta: { author: 'test-author-unique' }
      })

      const result = listBoards({ author: 'test-author-unique' })
      expect(result.items.some(b => b.id === board.id)).toBe(true)
    })

    it('should respect pagination', () => {
      const initialCount = listBoards({}).total
      
      for (let i = 0; i < 5; i++) {
        createBoard({
          title: `Pagination Board ${i}`,
          layout: { type: 'section', children: [] },
          expiresIn: 'never'
        })
      }

      const page1 = listBoards({ limit: 3, offset: 0 })
      expect(page1.items.length).toBe(3)
      expect(page1.total).toBe(initialCount + 5)

      const page2 = listBoards({ limit: 3, offset: 3 })
      expect(page2.items.length).toBeGreaterThanOrEqual(0)
    })
  })

  describe('incrementViews', () => {
    it('should increment view count', () => {
      const created = createBoard({
        title: 'Test Board',
        layout: { type: 'section', children: [] },
        expiresIn: 'never'
      })

      incrementViews(created.id)
      incrementViews(created.id)

      const board = getBoardById(created.id)
      expect(board?.views).toBe(2)
    })
  })

  describe('getViewStats', () => {
    it('should return view stats', () => {
      const created = createBoard({
        title: 'Test Board',
        layout: { type: 'section', children: [] },
        expiresIn: 'never'
      })

      incrementViews(created.id, '127.0.0.1', 'Test Agent')

      const stats = getViewStats(created.id)
      expect(stats.views).toBe(1)
      expect(stats.lastViewed).toBeDefined()
    })

    it('should return zero stats for non-existent board', () => {
      const stats = getViewStats('non-existent-id')
      expect(stats.views).toBe(0)
    })
  })
})
