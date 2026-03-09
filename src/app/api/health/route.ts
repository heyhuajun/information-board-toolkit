import { NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

interface HealthCheck {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  version: string
  uptime: number
  checks: {
    database: {
      status: 'ok' | 'error'
      latency?: number
      error?: string
    }
    env: {
      status: 'ok' | 'warning' | 'error'
      missing?: string[]
    }
  }
}

export async function GET() {
  const startTime = Date.now()
  const health: HealthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.1.0',
    uptime: process.uptime(),
    checks: {
      database: { status: 'ok' },
      env: { status: 'ok' },
    },
  }

  // Database check
  try {
    const dbPath = process.env.DATABASE_URL || path.join(process.cwd(), 'data', 'board.db')
    
    if (!fs.existsSync(dbPath)) {
      throw new Error('Database file not found')
    }

    const dbStart = Date.now()
    const db = new Database(dbPath, { readonly: true, fileMustExist: true })
    db.prepare('SELECT 1').get()
    db.close()
    
    health.checks.database.latency = Date.now() - dbStart
  } catch (error) {
    health.checks.database.status = 'error'
    health.checks.database.error = error instanceof Error ? error.message : 'Unknown error'
    health.status = 'unhealthy'
  }

  // Environment check
  const missingEnv: string[] = []
  
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      missingEnv.push('NEXT_PUBLIC_BASE_URL')
    }
    if (!process.env.DATABASE_URL) {
      missingEnv.push('DATABASE_URL')
    }
    if (!process.env.API_KEY && process.env.REQUIRE_AUTH !== 'false') {
      missingEnv.push('API_KEY')
    }
  }

  if (missingEnv.length > 0) {
    health.checks.env.status = process.env.NODE_ENV === 'production' ? 'error' : 'warning'
    health.checks.env.missing = missingEnv
    if (process.env.NODE_ENV === 'production') {
      health.status = 'unhealthy'
    }
  }

  const statusCode = health.status === 'healthy' ? 200 : 503

  return NextResponse.json(health, { 
    status: statusCode,
    headers: {
      'Cache-Control': 'no-store',
      'X-Response-Time': `${Date.now() - startTime}ms`,
    },
  })
}
