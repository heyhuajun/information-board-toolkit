import Database from 'better-sqlite3'
import { nanoid } from 'nanoid'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import type { BoardData, Component, BoardListItem } from '@/types'

// 数据库行类型定义
interface BoardRow {
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

interface ViewLogRow {
  id: number
  board_id: string
  viewed_at: string
  ip: string | null
  user_agent: string | null
}

interface CountRow {
  count: number
}

// 数据库路径
const DB_PATH = process.env.DATABASE_URL || path.join(process.cwd(), 'data', 'board.db')

// 确保数据目录存在
const dbDir = path.dirname(DB_PATH)
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

// 初始化数据库
const db = new Database(DB_PATH)

// 创建表（添加 owner_token 字段）
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
  );

  CREATE TABLE IF NOT EXISTS view_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    board_id TEXT NOT NULL,
    viewed_at TEXT DEFAULT (datetime('now')),
    ip TEXT,
    user_agent TEXT,
    FOREIGN KEY (board_id) REFERENCES boards(id)
  );

  CREATE INDEX IF NOT EXISTS idx_boards_share_token ON boards(share_token);
  CREATE INDEX IF NOT EXISTS idx_boards_owner_token ON boards(owner_token);
  CREATE INDEX IF NOT EXISTS idx_boards_author ON boards(author);
  CREATE INDEX IF NOT EXISTS idx_boards_created_at ON boards(created_at);
  CREATE INDEX IF NOT EXISTS idx_boards_expires_at ON boards(expires_at);
  CREATE INDEX IF NOT EXISTS idx_view_logs_board_id ON view_logs(board_id);
  CREATE INDEX IF NOT EXISTS idx_view_logs_viewed_at ON view_logs(viewed_at);
`)

// 迁移：为已存在的表添加 owner_token 列（如果不存在）
try {
  const tableInfo = db.prepare('PRAGMA table_info(boards)').all() as { name: string }[]
  const hasOwnerToken = tableInfo.some(col => col.name === 'owner_token')
  if (!hasOwnerToken) {
    db.exec('ALTER TABLE boards ADD COLUMN owner_token TEXT')
    // 为现有记录生成 owner_token
    const existingBoards = db.prepare('SELECT id FROM boards WHERE owner_token IS NULL').all() as { id: string }[]
    const updateStmt = db.prepare('UPDATE boards SET owner_token = ? WHERE id = ?')
    for (const board of existingBoards) {
      updateStmt.run(nanoid(16), board.id)
    }
  }
  } catch (e) {
    console.warn('Database migration warning (may be expected for new databases):', e)
  }

// 计算过期时间
function calculateExpiresAt(expiresIn: string): string | null {
  const now = new Date()
  switch (expiresIn) {
    case '1h':
      return new Date(now.getTime() + 60 * 60 * 1000).toISOString()
    case '24h':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
    case '7d':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
    case '30d':
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
    case 'never':
    default:
      return null
  }
}

// 创建 Board（返回包含 ownerToken）
export function createBoard(data: {
  title: string
  description?: string
  layout: Component
  expiresIn?: string
  meta?: { author?: string; tags?: string[] }
}): BoardData & { ownerToken: string } {
  const id = nanoid()
  const shareToken = nanoid(16)
  const ownerToken = nanoid(16)
  const expiresAt = data.expiresIn ? calculateExpiresAt(data.expiresIn) : null

  const stmt = db.prepare(`
    INSERT INTO boards (id, title, description, layout, meta, share_token, owner_token, expires_at, author)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  stmt.run(
    id,
    data.title,
    data.description || null,
    JSON.stringify(data.layout),
    data.meta ? JSON.stringify(data.meta) : null,
    shareToken,
    ownerToken,
    expiresAt,
    data.meta?.author || null
  )

  const board = getBoardById(id)!
  return { ...board, ownerToken }
}

// 根据 ID 获取 Board
export function getBoardById(id: string): BoardData | null {
  const stmt = db.prepare('SELECT * FROM boards WHERE id = ?')
  const row = stmt.get(id) as BoardRow | undefined

  if (!row) return null

  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    layout: JSON.parse(row.layout),
    meta: row.meta ? JSON.parse(row.meta) : undefined,
    shareToken: row.share_token,
    expiresAt: row.expires_at ?? undefined,
    views: row.views,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// 根据 share_token 获取 Board
export function getBoardByToken(token: string): BoardData | null {
  const stmt = db.prepare('SELECT * FROM boards WHERE share_token = ?')
  const row = stmt.get(token) as BoardRow | undefined

  if (!row) return null

  // 检查是否过期
  if (row.expires_at) {
    const expiresAt = new Date(row.expires_at)
    if (expiresAt < new Date()) {
      return null // 已过期
    }
  }

  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    layout: JSON.parse(row.layout),
    meta: row.meta ? JSON.parse(row.meta) : undefined,
    shareToken: row.share_token,
    expiresAt: row.expires_at ?? undefined,
    views: row.views,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// 时序安全比较函数
function timingSafeEqualString(a: string, b: string): boolean {
  // 将字符串转换为固定长度的 buffer
  const bufA = Buffer.from(a, 'utf8')
  const bufB = Buffer.from(b, 'utf8')
  
  // 如果长度不同，用 dummy 比较来保持恒定时间
  if (bufA.length !== bufB.length) {
    // 仍然执行比较以保持恒定时间
    crypto.timingSafeEqual(bufA, bufA)
    return false
  }
  
  return crypto.timingSafeEqual(bufA, bufB)
}

// 验证 owner_token（时序安全）
export function verifyOwnerToken(id: string, ownerToken: string): boolean {
  if (!ownerToken || typeof ownerToken !== 'string') {
    return false
  }
  
  const stmt = db.prepare('SELECT owner_token FROM boards WHERE id = ?')
  const row = stmt.get(id) as { owner_token: string } | undefined
  
  if (!row?.owner_token) {
    return false
  }
  
  return timingSafeEqualString(row.owner_token, ownerToken)
}

// 更新 Board
export function updateBoard(
  id: string,
  data: {
    title?: string
    description?: string
    layout?: Component
    meta?: { author?: string; tags?: string[] }
  }
): boolean {
  const updates: string[] = []
  const values: (string | number | null)[] = []

  if (data.title !== undefined) {
    updates.push('title = ?')
    values.push(data.title)
  }
  if (data.description !== undefined) {
    updates.push('description = ?')
    values.push(data.description)
  }
  if (data.layout !== undefined) {
    updates.push('layout = ?')
    values.push(JSON.stringify(data.layout))
  }
  if (data.meta !== undefined) {
    updates.push('meta = ?')
    values.push(JSON.stringify(data.meta))
  }

  if (updates.length === 0) return false

  updates.push("updated_at = datetime('now')")
  values.push(id)

  const stmt = db.prepare(`UPDATE boards SET ${updates.join(', ')} WHERE id = ?`)
  const result = stmt.run(...values)

  return result.changes > 0
}

// 删除 Board
export function deleteBoard(id: string): boolean {
  const stmt = db.prepare('DELETE FROM boards WHERE id = ?')
  const result = stmt.run(id)
  return result.changes > 0
}

// 列出 Boards
export function listBoards(options: {
  author?: string
  limit?: number
  offset?: number
}): { items: BoardListItem[]; total: number } {
  const { author, limit = 10, offset = 0 } = options

  let whereClause = ''
  const params: (string | number)[] = []

  if (author) {
    whereClause = 'WHERE author = ?'
    params.push(author)
  }

  // 获取总数
  const countStmt = db.prepare(`SELECT COUNT(*) as count FROM boards ${whereClause}`)
  const countResult = countStmt.get(...params) as CountRow
  const total = countResult.count

  // 获取列表
  const listStmt = db.prepare(`
    SELECT id, title, views, created_at
    FROM boards
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `)
  const rows = listStmt.all(...params, limit, offset) as Array<{ id: string; title: string; views: number; created_at: string }>

  // 映射字段名：created_at -> createdAt
  const items: BoardListItem[] = rows.map(row => ({
    id: row.id,
    title: row.title,
    views: row.views,
    createdAt: row.created_at,
  }))

  return { items, total }
}

// 增加浏览量
export function incrementViews(id: string, ip?: string, userAgent?: string): void {
  try {
    // 更新浏览量
    const updateStmt = db.prepare('UPDATE boards SET views = views + 1 WHERE id = ?')
    updateStmt.run(id)

    // 记录浏览日志
    const logStmt = db.prepare(`
      INSERT INTO view_logs (board_id, ip, user_agent, viewed_at)
      VALUES (?, ?, ?, datetime('now'))
    `)
    logStmt.run(id, ip || null, userAgent || null)
  } catch (error) {
    console.error('Failed to increment views:', error)
    // 不抛出错误，避免影响主请求流程
  }
}

// 获取浏览统计
export function getViewStats(id: string): {
  views: number
  lastViewed?: string
} {
  const board = getBoardById(id)
  if (!board) return { views: 0 }

  const lastViewStmt = db.prepare(`
    SELECT viewed_at FROM view_logs
    WHERE board_id = ?
    ORDER BY viewed_at DESC
    LIMIT 1
  `)
  const lastView = lastViewStmt.get(id) as ViewLogRow | undefined

  return {
    views: board.views,
    lastViewed: lastView?.viewed_at,
  }
}

export function cleanupExpiredBoards(): { deleted: number } {
  const now = new Date().toISOString()
  
  const findStmt = db.prepare(`
    SELECT id FROM boards 
    WHERE expires_at IS NOT NULL AND expires_at < ?
  `)
  const expiredBoards = findStmt.all(now) as Array<{ id: string }>
  
  if (expiredBoards.length === 0) {
    return { deleted: 0 }
  }
  
  const ids = expiredBoards.map(b => b.id)
  const placeholders = ids.map(() => '?').join(',')
  
  const deleteViewLogs = db.prepare(`DELETE FROM view_logs WHERE board_id IN (${placeholders})`)
  deleteViewLogs.run(...ids)
  
  const deleteBoards = db.prepare(`DELETE FROM boards WHERE id IN (${placeholders})`)
  const result = deleteBoards.run(...ids)
  
  return { deleted: result.changes }
}

export default db