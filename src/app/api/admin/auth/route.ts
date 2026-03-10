import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''

if (!ADMIN_PASSWORD && process.env.NODE_ENV === 'production') {
  console.error('CRITICAL: ADMIN_PASSWORD not configured in production!')
}

export async function POST(request: NextRequest) {
  if (!ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: 'Admin authentication not configured' },
      { status: 503 }
    )
  }

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
