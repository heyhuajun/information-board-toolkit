import { NextResponse } from 'next/server'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
  meta?: {
    timestamp: string
    requestId?: string
  }
}

export class ApiSuccess {
  static create<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
    const response: ApiResponse<T> = {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
      },
    }
    return NextResponse.json(response, { status })
  }

  static created<T>(data: T): NextResponse<ApiResponse<T>> {
    return this.create(data, 201)
  }

  static noContent(): NextResponse {
    return new NextResponse(null, { status: 204 })
  }
}

export class ApiError {
  static badRequest(message: string, details?: unknown): NextResponse<ApiResponse> {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message,
        details,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    }
    return NextResponse.json(response, { status: 400 })
  }

  static unauthorized(message = 'Unauthorized'): NextResponse<ApiResponse> {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    }
    return NextResponse.json(response, { status: 401 })
  }

  static forbidden(message = 'Forbidden'): NextResponse<ApiResponse> {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'FORBIDDEN',
        message,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    }
    return NextResponse.json(response, { status: 403 })
  }

  static notFound(message = 'Not found'): NextResponse<ApiResponse> {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    }
    return NextResponse.json(response, { status: 404 })
  }

  static conflict(message: string, details?: unknown): NextResponse<ApiResponse> {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'CONFLICT',
        message,
        details,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    }
    return NextResponse.json(response, { status: 409 })
  }

  static tooManyRequests(message: string, retryAfter?: number): NextResponse<ApiResponse> {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    }
    
    const headers: Record<string, string> = {}
    if (retryAfter) {
      headers['Retry-After'] = retryAfter.toString()
    }
    
    return NextResponse.json(response, { status: 429, headers })
  }

  static internalError(message = 'Internal server error'): NextResponse<ApiResponse> {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    }
    return NextResponse.json(response, { status: 500 })
  }
}
