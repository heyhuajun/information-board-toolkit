import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockQuery = vi.hoisted(() => vi.fn())
const mockConnect = vi.hoisted(() => vi.fn())

vi.mock('pg', () => {
  class MockPool {
    query = mockQuery
    connect = mockConnect
    on = vi.fn()
  }
  return {
    default: { Pool: MockPool },
    Pool: MockPool,
  }
})

vi.mock('nanoid', () => ({
  nanoid: vi.fn((length?: number) => `test-id-${length || 21}`),
}))

vi.mock('crypto', () => {
  const createHash = vi.fn(() => ({
    update: vi.fn(() => ({
      digest: vi.fn(() => 'hashed-token'),
    })),
  }))
  const timingSafeEqual = vi.fn(() => true)
  return {
    default: {
      createHash,
      timingSafeEqual,
    },
    createHash,
    timingSafeEqual,
  }
})

describe('Health Check API', () => {
  beforeEach(() => {
    mockQuery.mockReset()
    mockConnect.mockReset()
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('DATABASE_URL', 'postgresql://test:test@localhost:5432/test')
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe('GET /api/health', () => {
    it('should return healthy status when database is connected', async () => {
      mockQuery.mockResolvedValue({ rows: [{ '?column?': 1 }], rowCount: 1 })

      const { GET } = await import('@/app/api/health/route')
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe('healthy')
      expect(data.checks.database.status).toBe('ok')
      expect(data.checks.database.latency).toBeDefined()
      expect(data.checks.env.status).toBe('ok')
      expect(data.timestamp).toBeDefined()
      expect(data.uptime).toBeGreaterThanOrEqual(0)
      expect(response.headers.get('Cache-Control')).toBe('no-store')
      expect(response.headers.get('X-Response-Time')).toBeDefined()
    })

    it('should return unhealthy status when database is disconnected', async () => {
      mockQuery.mockRejectedValue(new Error('Connection failed'))

      const { GET } = await import('@/app/api/health/route')
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(503)
      expect(data.status).toBe('unhealthy')
      expect(data.checks.database.status).toBe('error')
      expect(data.checks.database.error).toBe('Database connection failed')
    })

    it('should check for missing environment variables in production', async () => {
      vi.stubEnv('NODE_ENV', 'production')
      vi.stubEnv('NEXT_PUBLIC_BASE_URL', undefined)
      vi.stubEnv('DATABASE_URL', undefined)
      vi.stubEnv('API_KEY', undefined)

      mockQuery.mockResolvedValue({ rows: [{ '?column?': 1 }], rowCount: 1 })

      const { GET } = await import('@/app/api/health/route')
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(503)
      expect(data.status).toBe('unhealthy')
      expect(data.checks.env.status).toBe('error')
      expect(data.checks.env.missing).toContain('NEXT_PUBLIC_BASE_URL')
      expect(data.checks.env.missing).toContain('DATABASE_URL')
      expect(data.checks.env.missing).toContain('API_KEY')
    })

    it('should not require API_KEY when REQUIRE_AUTH=false', async () => {
      vi.stubEnv('NODE_ENV', 'production')
      vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://example.com')
      vi.stubEnv('DATABASE_URL', 'postgresql://test:test@localhost:5432/test')
      vi.stubEnv('API_KEY', undefined)
      vi.stubEnv('REQUIRE_AUTH', 'false')

      mockQuery.mockResolvedValue({ rows: [{ '?column?': 1 }], rowCount: 1 })

      const { GET } = await import('@/app/api/health/route')
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe('healthy')
      expect(data.checks.env.missing).toBeUndefined()
    })

    it('should be healthy when all production env vars are set', async () => {
      vi.stubEnv('NODE_ENV', 'production')
      vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://example.com')
      vi.stubEnv('DATABASE_URL', 'postgresql://test:test@localhost:5432/test')
      vi.stubEnv('API_KEY', 'test-api-key-32-characters!!')

      mockQuery.mockResolvedValue({ rows: [{ '?column?': 1 }], rowCount: 1 })

      const { GET } = await import('@/app/api/health/route')
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe('healthy')
      expect(data.checks.env.status).toBe('ok')
    })
  })
})
