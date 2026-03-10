import { NextRequest, NextResponse } from 'next/server'
import { cleanupExpiredBoards } from '@/lib/db'

/**
 * Cron Job 端点：清理过期内容
 * 
 * 使用方式：
 * 1. Vercel Cron Jobs: 自动调用 /api/cron/cleanup
 * 2. 外部调度器: curl -X POST https://your-domain/api/cron/cleanup -H "Authorization: Bearer YOUR_CRON_SECRET"
 * 
 * 环境变量：
 * - CRON_SECRET: 可选，用于验证请求来源
 */

export async function POST(request: NextRequest) {
  // 验证 Cron Secret（如果配置）
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const authHeader = request.headers.get('authorization')
    const providedSecret = authHeader?.replace('Bearer ', '')
    
    if (!providedSecret || providedSecret !== cronSecret) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  }

  try {
    const result = await cleanupExpiredBoards()
    
    console.log(`[Cron] Cleanup completed: ${result.deleted} expired boards deleted`)
    
    return NextResponse.json({
      success: true,
      deleted: result.deleted,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Cron] Cleanup failed:', error)
    
    return NextResponse.json(
      { 
        error: 'Cleanup failed',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    )
  }
}

// 支持 GET 请求（用于简单的健康检查，但需要 secret）
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  
  // 如果没有配置 secret，不允许 GET 请求
  if (!cronSecret) {
    return NextResponse.json(
      { error: 'Method not allowed. Use POST request.' },
      { status: 405 }
    )
  }
  
  const authHeader = request.headers.get('authorization')
  const providedSecret = authHeader?.replace('Bearer ', '')
  
  if (!providedSecret || providedSecret !== cronSecret) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  try {
    const result = await cleanupExpiredBoards()
    
    return NextResponse.json({
      success: true,
      deleted: result.deleted,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Cron] Cleanup failed:', error)
    
    return NextResponse.json(
      { error: 'Cleanup failed' },
      { status: 500 }
    )
  }
}
