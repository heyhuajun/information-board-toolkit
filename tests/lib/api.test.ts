import { describe, it, expect } from 'vitest'
import { ApiSuccess, ApiError, type ApiResponse } from '@/lib/api'

describe('ApiSuccess', () => {
  describe('create', () => {
    it('should create a success response with default status 200', async () => {
      const data = { id: '123', name: 'Test' }
      const response = ApiSuccess.create(data)
      const json = await response.json() as ApiResponse<typeof data>

      expect(response.status).toBe(200)
      expect(json.success).toBe(true)
      expect(json.data).toEqual(data)
      expect(json.meta?.timestamp).toBeDefined()
    })

    it('should create a success response with custom status', async () => {
      const data = { message: 'Updated' }
      const response = ApiSuccess.create(data, 200)
      const json = await response.json() as ApiResponse<typeof data>

      expect(response.status).toBe(200)
      expect(json.success).toBe(true)
      expect(json.data).toEqual(data)
    })
  })

  describe('created', () => {
    it('should create a 201 response', async () => {
      const data = { id: '456', title: 'New Board' }
      const response = ApiSuccess.created(data)
      const json = await response.json() as ApiResponse<typeof data>

      expect(response.status).toBe(201)
      expect(json.success).toBe(true)
      expect(json.data).toEqual(data)
    })
  })

  describe('noContent', () => {
    it('should create a 204 response with no body', async () => {
      const response = ApiSuccess.noContent()

      expect(response.status).toBe(204)
    })
  })
})

describe('ApiError', () => {
  describe('badRequest', () => {
    it('should create a 400 error response', async () => {
      const response = ApiError.badRequest('Invalid input', { field: 'title' })
      const json = await response.json() as ApiResponse

      expect(response.status).toBe(400)
      expect(json.success).toBe(false)
      expect(json.error?.code).toBe('BAD_REQUEST')
      expect(json.error?.message).toBe('Invalid input')
      expect(json.error?.details).toEqual({ field: 'title' })
    })
  })

  describe('unauthorized', () => {
    it('should create a 401 error response with default message', async () => {
      const response = ApiError.unauthorized()
      const json = await response.json() as ApiResponse

      expect(response.status).toBe(401)
      expect(json.success).toBe(false)
      expect(json.error?.code).toBe('UNAUTHORIZED')
      expect(json.error?.message).toBe('Unauthorized')
    })

    it('should create a 401 error response with custom message', async () => {
      const response = ApiError.unauthorized('Invalid API key')
      const json = await response.json() as ApiResponse

      expect(response.status).toBe(401)
      expect(json.error?.message).toBe('Invalid API key')
    })
  })

  describe('forbidden', () => {
    it('should create a 403 error response with default message', async () => {
      const response = ApiError.forbidden()
      const json = await response.json() as ApiResponse

      expect(response.status).toBe(403)
      expect(json.success).toBe(false)
      expect(json.error?.code).toBe('FORBIDDEN')
      expect(json.error?.message).toBe('Forbidden')
    })

    it('should create a 403 error response with custom message', async () => {
      const response = ApiError.forbidden('Access denied')
      const json = await response.json() as ApiResponse

      expect(response.status).toBe(403)
      expect(json.error?.message).toBe('Access denied')
    })
  })

  describe('notFound', () => {
    it('should create a 404 error response with default message', async () => {
      const response = ApiError.notFound()
      const json = await response.json() as ApiResponse

      expect(response.status).toBe(404)
      expect(json.success).toBe(false)
      expect(json.error?.code).toBe('NOT_FOUND')
      expect(json.error?.message).toBe('Not found')
    })

    it('should create a 404 error response with custom message', async () => {
      const response = ApiError.notFound('Board not found')
      const json = await response.json() as ApiResponse

      expect(response.status).toBe(404)
      expect(json.error?.message).toBe('Board not found')
    })
  })

  describe('conflict', () => {
    it('should create a 409 error response', async () => {
      const response = ApiError.conflict('Resource already exists')
      const json = await response.json() as ApiResponse

      expect(response.status).toBe(409)
      expect(json.success).toBe(false)
      expect(json.error?.code).toBe('CONFLICT')
      expect(json.error?.message).toBe('Resource already exists')
    })

    it('should create a 409 error response with details', async () => {
      const response = ApiError.conflict('Duplicate entry', { field: 'email' })
      const json = await response.json() as ApiResponse

      expect(response.status).toBe(409)
      expect(json.error?.details).toEqual({ field: 'email' })
    })
  })

  describe('tooManyRequests', () => {
    it('should create a 429 error response without retry-after', async () => {
      const response = ApiError.tooManyRequests('Rate limit exceeded')
      const json = await response.json() as ApiResponse

      expect(response.status).toBe(429)
      expect(json.success).toBe(false)
      expect(json.error?.code).toBe('TOO_MANY_REQUESTS')
      expect(json.error?.message).toBe('Rate limit exceeded')
      expect(response.headers.get('Retry-After')).toBeNull()
    })

    it('should create a 429 error response with retry-after header', async () => {
      const response = ApiError.tooManyRequests('Too many requests', 60)
      const json = await response.json() as ApiResponse

      expect(response.status).toBe(429)
      expect(json.error?.message).toBe('Too many requests')
      expect(response.headers.get('Retry-After')).toBe('60')
    })
  })

  describe('internalError', () => {
    it('should create a 500 error response with default message', async () => {
      const response = ApiError.internalError()
      const json = await response.json() as ApiResponse

      expect(response.status).toBe(500)
      expect(json.success).toBe(false)
      expect(json.error?.code).toBe('INTERNAL_ERROR')
      expect(json.error?.message).toBe('Internal server error')
    })

    it('should create a 500 error response with custom message', async () => {
      const response = ApiError.internalError('Database connection failed')
      const json = await response.json() as ApiResponse

      expect(response.status).toBe(500)
      expect(json.error?.message).toBe('Database connection failed')
    })
  })
})
