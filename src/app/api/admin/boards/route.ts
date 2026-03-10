import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

const ADMIN_PASSWORD = '0099'

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('X-Admin-Auth')
  return authHeader === ADMIN_PASSWORD
}

export async function GET(request: NextRequest) {
  const auth = request.headers.get('Cookie')?.includes('admin_auth=true')
  
  if (!auth) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const stmt = db.prepare(`
      SELECT id, title, share_token, views, created_at, expires_at, author
      FROM boards
      ORDER BY created_at DESC
    `)
    const rows = stmt.all() as Array<{
      id: string
      title: string
      share_token: string
      views: number
      created_at: string
      expires_at: string | null
      author: string | null
    }>

    const boards = rows.map(row => ({
      id: row.id,
      title: row.title,
      shareToken: row.share_token,
      views: row.views,
      createdAt: row.created_at,
      expiresAt: row.expires_at,
      author: row.author
    }))

    return NextResponse.json({ boards })
  } catch (error) {
    console.error('Failed to list boards:', error)
    return NextResponse.json({ error: '获取失败' }, { status: 500 })
  }
}
