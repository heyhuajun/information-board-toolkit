import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

interface TestBoard {
  id: string
  title: string
  description: string | null
  layout: string
  meta: string | null
  share_token: string
  owner_token: string
  expires_at: string | null
  views: number
  created_at: string
  updated_at: string
  author: string | null
}

interface TestBoardTitle {
  title: string
}

describe('Database Operations', () => {
  const testDbPath = path.join(process.cwd(), 'data', 'test.db')
  let db: Database.Database

  beforeAll(() => {
    const dataDir = path.dirname(testDbPath)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    
    db = new Database(testDbPath)
    
    db.exec(`
      CREATE TABLE IF NOT EXISTS boards (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        layout TEXT NOT NULL,
        meta TEXT,
        share_token TEXT UNIQUE NOT NULL,
        owner_token TEXT NOT NULL,
        expires_at TEXT,
        views INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        author TEXT
      )
    `)
  })

  afterAll(() => {
    db.close()
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath)
    }
  })

  describe('createBoard', () => {
    it('should create a board with required fields', () => {
      const stmt = db.prepare(`
        INSERT INTO boards (id, title, layout, share_token, owner_token)
        VALUES (?, ?, ?, ?, ?)
      `)
      
      const result = stmt.run(
        'test-id',
        'Test Board',
        JSON.stringify({ type: 'section', children: [] }),
        'share-token',
        'owner-token'
      )
      
      expect(result.changes).toBe(1)
    })

    it('should reject duplicate share tokens', () => {
      const stmt = db.prepare(`
        INSERT INTO boards (id, title, layout, share_token, owner_token)
        VALUES (?, ?, ?, ?, ?)
      `)
      
      stmt.run(
        'test-id-2',
        'Test Board 2',
        JSON.stringify({ type: 'section', children: [] }),
        'unique-token',
        'owner-token-2'
      )
      
      expect(() => {
        stmt.run(
          'test-id-3',
          'Test Board 3',
          JSON.stringify({ type: 'section', children: [] }),
          'unique-token',
          'owner-token-3'
        )
      }).toThrow()
    })
  })

  describe('getBoardById', () => {
    it('should retrieve a board by id', () => {
      const stmt = db.prepare('SELECT * FROM boards WHERE id = ?')
      const board = stmt.get('test-id') as TestBoard | undefined
      
      expect(board).toBeDefined()
      expect(board?.title).toBe('Test Board')
    })

    it('should return undefined for non-existent board', () => {
      const stmt = db.prepare('SELECT * FROM boards WHERE id = ?')
      const board = stmt.get('non-existent')
      
      expect(board).toBeUndefined()
    })
  })

  describe('updateBoard', () => {
    it('should update board title', () => {
      const stmt = db.prepare('UPDATE boards SET title = ? WHERE id = ?')
      const result = stmt.run('Updated Title', 'test-id')
      
      expect(result.changes).toBe(1)
      
      const board = db.prepare('SELECT title FROM boards WHERE id = ?').get('test-id') as TestBoardTitle | undefined
      expect(board?.title).toBe('Updated Title')
    })
  })

  describe('deleteBoard', () => {
    it('should delete a board', () => {
      const stmt = db.prepare('DELETE FROM boards WHERE id = ?')
      const result = stmt.run('test-id')
      
      expect(result.changes).toBe(1)
      
      const board = db.prepare('SELECT * FROM boards WHERE id = ?').get('test-id')
      expect(board).toBeUndefined()
    })
  })
})
