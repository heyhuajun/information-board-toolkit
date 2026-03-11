import pg from 'pg'
import { nanoid } from 'nanoid'
import crypto from 'crypto'
import type { BoardData, Component, BoardListItem } from '@/types'

const { Pool } = pg

interface BoardRow {
  id: string
  title: string
  description: string | null
  layout: string
  meta: string | null
  share_token: string
  owner_token_hash: string
  expires_at: Date | null
  views: number
  created_at: Date
  updated_at: Date
  author: string | null
}

interface CountRow {
  count: string
}

interface RateLimitRow {
  count: number
  reset_at: Date
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
})

export async function initializeDatabase(): Promise<void> {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS boards (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        layout JSONB NOT NULL,
        meta JSONB,
        share_token TEXT UNIQUE NOT NULL,
        owner_token_hash TEXT NOT NULL,
        expires_at TIMESTAMPTZ,
        views INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        author TEXT
      );

      CREATE TABLE IF NOT EXISTS view_logs (
        id SERIAL PRIMARY KEY,
        board_id TEXT NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
        viewed_at TIMESTAMPTZ DEFAULT NOW(),
        ip TEXT,
        user_agent TEXT
      );

      CREATE TABLE IF NOT EXISTS rate_limits (
        id SERIAL PRIMARY KEY,
        identifier TEXT NOT NULL,
        client_ip TEXT NOT NULL,
        count INTEGER DEFAULT 1,
        reset_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(identifier, client_ip)
      );

      CREATE INDEX IF NOT EXISTS idx_boards_share_token ON boards(share_token);
      CREATE INDEX IF NOT EXISTS idx_boards_author ON boards(author);
      CREATE INDEX IF NOT EXISTS idx_boards_expires_at ON boards(expires_at);
      CREATE INDEX IF NOT EXISTS idx_boards_created_at ON boards(created_at);
      CREATE INDEX IF NOT EXISTS idx_view_logs_board_id ON view_logs(board_id);
      CREATE INDEX IF NOT EXISTS idx_view_logs_viewed_at ON view_logs(viewed_at);
      CREATE INDEX IF NOT EXISTS idx_rate_limits_reset ON rate_limits(reset_at);
      CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup ON rate_limits(identifier, client_ip);
    `)
    console.log('Database tables initialized')
  } finally {
    client.release()
  }
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

function timingSafeEqualString(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8')
  const bufB = Buffer.from(b, 'utf8')
  
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA)
    return false
  }
  
  return crypto.timingSafeEqual(bufA, bufB)
}

function calculateExpiresAt(expiresIn: string): Date | null {
  const now = new Date()
  switch (expiresIn) {
    case '1h':
      return new Date(now.getTime() + 60 * 60 * 1000)
    case '24h':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000)
    case '7d':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    case '30d':
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    case 'never':
    default:
      return null
  }
}

function mapRowToBoardData(row: BoardRow): BoardData {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    layout: typeof row.layout === 'string' ? JSON.parse(row.layout) : row.layout,
    meta: row.meta ? (typeof row.meta === 'string' ? JSON.parse(row.meta) : row.meta) : undefined,
    shareToken: row.share_token,
    expiresAt: row.expires_at?.toISOString() ?? undefined,
    views: row.views,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  }
}

export async function createBoard(data: {
  title: string
  description?: string
  layout: Component
  expiresIn?: string
  meta?: { author?: string; tags?: string[] }
}): Promise<BoardData & { ownerToken: string }> {
  const id = nanoid()
  const shareToken = nanoid(16)
  const ownerToken = nanoid(16)
  const ownerTokenHash = hashToken(ownerToken)
  const expiresAt = data.expiresIn ? calculateExpiresAt(data.expiresIn) : null

  const result = await pool.query<BoardRow>(
    `INSERT INTO boards (id, title, description, layout, meta, share_token, owner_token_hash, expires_at, author)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      id,
      data.title,
      data.description || null,
      JSON.stringify(data.layout),
      data.meta ? JSON.stringify(data.meta) : null,
      shareToken,
      ownerTokenHash,
      expiresAt,
      data.meta?.author || null,
    ]
  )

  const board = mapRowToBoardData(result.rows[0])
  return { ...board, ownerToken }
}

export async function getBoardById(id: string): Promise<BoardData | null> {
  const result = await pool.query<BoardRow>(
    'SELECT * FROM boards WHERE id = $1',
    [id]
  )

  if (result.rows.length === 0) return null
  return mapRowToBoardData(result.rows[0])
}

export async function getBoardByToken(token: string): Promise<BoardData | null> {
  const result = await pool.query<BoardRow>(
    'SELECT * FROM boards WHERE share_token = $1',
    [token]
  )

  if (result.rows.length === 0) return null

  const row = result.rows[0]
  if (row.expires_at && new Date(row.expires_at) < new Date()) {
    return null
  }

  return mapRowToBoardData(row)
}

export async function verifyOwnerToken(id: string, ownerToken: string): Promise<boolean> {
  if (!ownerToken || typeof ownerToken !== 'string') {
    return false
  }

  const result = await pool.query<{ owner_token_hash: string }>(
    'SELECT owner_token_hash FROM boards WHERE id = $1',
    [id]
  )

  if (result.rows.length === 0 || !result.rows[0].owner_token_hash) {
    return false
  }

  const providedHash = hashToken(ownerToken)
  return timingSafeEqualString(result.rows[0].owner_token_hash, providedHash)
}

export async function updateBoard(
  id: string,
  data: {
    title?: string
    description?: string
    layout?: Component
    meta?: { author?: string; tags?: string[] }
  }
): Promise<boolean> {
  const updates: string[] = []
  const values: (string | number | null | object)[] = []
  let paramIndex = 1

  if (data.title !== undefined) {
    updates.push(`title = $${paramIndex++}`)
    values.push(data.title)
  }
  if (data.description !== undefined) {
    updates.push(`description = $${paramIndex++}`)
    values.push(data.description)
  }
  if (data.layout !== undefined) {
    updates.push(`layout = $${paramIndex++}`)
    values.push(JSON.stringify(data.layout))
  }
  if (data.meta !== undefined) {
    updates.push(`meta = $${paramIndex++}`)
    values.push(JSON.stringify(data.meta))
  }

  if (updates.length === 0) return false

  updates.push(`updated_at = NOW()`)
  values.push(id)

  const result = await pool.query(
    `UPDATE boards SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
    values
  )

  return (result.rowCount ?? 0) > 0
}

export async function deleteBoard(id: string): Promise<boolean> {
  const result = await pool.query('DELETE FROM boards WHERE id = $1', [id])
  return (result.rowCount ?? 0) > 0
}

export async function listBoards(options: {
  author?: string
  limit?: number
  offset?: number
}): Promise<{ items: BoardListItem[]; total: number }> {
  const { author, limit = 10, offset = 0 } = options

  let whereClause = ''
  const params: (string | number)[] = []

  if (author) {
    whereClause = 'WHERE author = $1'
    params.push(author)
  }

  const countResult = await pool.query<CountRow>(
    `SELECT COUNT(*) as count FROM boards ${whereClause}`,
    params
  )
  const total = parseInt(countResult.rows[0].count, 10)

  const listResult = await pool.query<{ id: string; title: string; views: number; created_at: Date }>(
    `SELECT id, title, views, created_at
     FROM boards
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  )

  const items: BoardListItem[] = listResult.rows.map(row => ({
    id: row.id,
    title: row.title,
    views: row.views,
    createdAt: row.created_at.toISOString(),
  }))

  return { items, total }
}

export async function incrementViews(id: string, ip?: string, userAgent?: string): Promise<void> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    
    await client.query('UPDATE boards SET views = views + 1 WHERE id = $1', [id])
    
    await client.query(
      `INSERT INTO view_logs (board_id, ip, user_agent, viewed_at)
       VALUES ($1, $2, $3, NOW())`,
      [id, ip || null, userAgent || null]
    )
    
    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Failed to increment views:', error)
  } finally {
    client.release()
  }
}

export async function getViewStats(id: string): Promise<{
  views: number
  lastViewed?: string
}> {
  const board = await getBoardById(id)
  if (!board) return { views: 0 }

  const result = await pool.query<{ viewed_at: Date }>(
    `SELECT viewed_at FROM view_logs
     WHERE board_id = $1
     ORDER BY viewed_at DESC
     LIMIT 1`,
    [id]
  )

  return {
    views: board.views,
    lastViewed: result.rows[0]?.viewed_at?.toISOString(),
  }
}

export async function cleanupExpiredBoards(): Promise<{ deleted: number }> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const findResult = await client.query<{ id: string }>(
      `SELECT id FROM boards WHERE expires_at IS NOT NULL AND expires_at < NOW()`
    )

    if (findResult.rows.length === 0) {
      await client.query('COMMIT')
      return { deleted: 0 }
    }

    const ids = findResult.rows.map(r => r.id)
    
    await client.query(`DELETE FROM view_logs WHERE board_id = ANY($1)`, [ids])
    
    const deleteResult = await client.query(`DELETE FROM boards WHERE id = ANY($1)`, [ids])

    await client.query('COMMIT')
    return { deleted: deleteResult.rowCount ?? 0 }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function checkRateLimit(
  identifier: string,
  clientIp: string,
  maxRequests: number,
  windowMs: number
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const now = new Date()
  const resetAt = new Date(now.getTime() + windowMs)

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    await client.query(
      `DELETE FROM rate_limits WHERE reset_at < NOW()`
    )

    const result = await client.query<RateLimitRow>(
      `SELECT count, reset_at FROM rate_limits WHERE identifier = $1 AND client_ip = $2 FOR UPDATE`,
      [identifier, clientIp]
    )

    if (result.rows.length === 0) {
      await client.query(
        `INSERT INTO rate_limits (identifier, client_ip, count, reset_at) VALUES ($1, $2, 1, $3)`,
        [identifier, clientIp, resetAt]
      )
      await client.query('COMMIT')
      return { allowed: true, remaining: maxRequests - 1, resetAt }
    }

    const current = result.rows[0]
    if (current.count >= maxRequests) {
      await client.query('COMMIT')
      return { allowed: false, remaining: 0, resetAt: current.reset_at }
    }

    await client.query(
      `UPDATE rate_limits SET count = count + 1 WHERE identifier = $1 AND client_ip = $2`,
      [identifier, clientIp]
    )

    await client.query('COMMIT')
    return { allowed: true, remaining: maxRequests - current.count - 1, resetAt: current.reset_at }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function healthCheck(): Promise<boolean> {
  try {
    const result = await pool.query('SELECT 1')
    return result.rowCount === 1
  } catch {
    return false
  }
}

export { pool }
export default pool
