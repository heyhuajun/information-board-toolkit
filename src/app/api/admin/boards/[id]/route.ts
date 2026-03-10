import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = request.headers.get('Cookie')?.includes('admin_auth=true')
  
  if (!auth) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const { id } = await params

    const deleteViewLogs = db.prepare('DELETE FROM view_logs WHERE board_id = ?')
    deleteViewLogs.run(id)

    const deleteBoard = db.prepare('DELETE FROM boards WHERE id = ?')
    const result = deleteBoard.run(id)

    if (result.changes > 0) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: '看板不存在' }, { status: 404 })
    }
  } catch (error) {
    console.error('Failed to delete board:', error)
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
}
