import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET(request: NextRequest) {
  const auth = request.headers.get('Cookie')?.includes('admin_auth=true')
  
  if (!auth) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const result = await pool.query(`
      SELECT id, title, share_token, views, created_at, expires_at, author
      FROM boards
      ORDER BY created_at DESC
    `)

    const boards = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      shareToken: row.share_token,
      views: row.views,
      createdAt: row.created_at.toISOString(),
      expiresAt: row.expires_at?.toISOString() || null,
      author: row.author
    }))

    return NextResponse.json({ boards })
  } catch (error) {
    console.error('Failed to list boards:', error)
    return NextResponse.json({ error: '获取失败' }, { status: 500 })
  }
}
