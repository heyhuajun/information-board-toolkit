import { NextResponse } from 'next/server'
import { healthCheck } from '@/lib/db'

interface HealthCheckResult {
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
  const health: HealthCheckResult = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.2.0',
    uptime: process.uptime(),
    checks: {
      database: { status: 'ok' },
      env: { status: 'ok' },
    },
  }

  const dbStart = Date.now()
  const dbHealthy = await healthCheck()
  health.checks.database.latency = Date.now() - dbStart

  if (!dbHealthy) {
    health.checks.database.status = 'error'
    health.checks.database.error = 'Database connection failed'
    health.status = 'unhealthy'
  }

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
