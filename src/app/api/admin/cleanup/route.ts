import { NextRequest, NextResponse } from 'next/server'
import { cleanupExpiredBoards } from '@/lib/db'

export async function POST(request: NextRequest) {
  const auth = request.headers.get('Cookie')?.includes('admin_auth=true')
  
  if (!auth) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const result = await cleanupExpiredBoards()
    return NextResponse.json({ 
      success: true, 
      deleted: result.deleted,
      message: result.deleted > 0 
        ? `已清理 ${result.deleted} 个过期看板` 
        : '没有需要清理的过期看板'
    })
  } catch (error) {
    console.error('Failed to cleanup:', error)
    return NextResponse.json({ error: '清理失败' }, { status: 500 })
  }
}
