import { NextRequest, NextResponse } from 'next/server'

// 管理员密码
const ADMIN_PASSWORD = '0099'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: '密码错误' },
      { status: 401 }
    )
  } catch {
    return NextResponse.json(
      { error: '请求失败' },
      { status: 400 }
    )
  }
}
