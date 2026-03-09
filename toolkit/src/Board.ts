import type { SubmitBoardRequest, SubmitBoardResponse, BoardData, ListBoardsResponse } from './types'

export interface BoardConfig {
  baseUrl: string
  apiKey?: string
  timeout?: number
}

export interface SubmitResult extends SubmitBoardResponse {
  ownerToken: string
}

export class Board {
  private baseUrl: string
  private apiKey?: string
  private timeout: number

  constructor(config: BoardConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '')
    this.apiKey = config.apiKey
    this.timeout = config.timeout || 30000
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    }

    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        
        // 构建详细错误信息
        let errorMessage = errorData.error || `HTTP ${response.status}`
        
        if (errorData.details) {
          errorMessage += `\n详情: ${errorData.details}`
        }
        
        if (errorData.hint) {
          errorMessage += `\n提示: ${errorData.hint}`
        }
        
        if (errorData.example) {
          errorMessage += `\n示例: ${JSON.stringify(errorData.example, null, 2)}`
        }
        
        if (errorData.received) {
          errorMessage += `\n收到的值: ${errorData.received}`
        }
        
        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`请求超时 (${this.timeout}ms)`)
      }
      throw error
    }
  }

  /**
   * 提交内容到看板
   * 返回包含 ownerToken 的结果，用于后续更新/删除操作
   */
  async submit(data: SubmitBoardRequest): Promise<SubmitResult> {
    return this.request<SubmitResult>('/api/board/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * 更新内容（需要 ownerToken）
   */
  async update(
    id: string,
    ownerToken: string,
    data: Partial<SubmitBoardRequest>
  ): Promise<BoardData> {
    return this.request<BoardData>(`/api/board/${id}`, {
      method: 'PUT',
      headers: {
        'X-Owner-Token': ownerToken,
      },
      body: JSON.stringify(data),
    })
  }

  /**
   * 删除内容（需要 ownerToken）
   */
  async delete(id: string, ownerToken: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/board/${id}`, {
      method: 'DELETE',
      headers: {
        'X-Owner-Token': ownerToken,
      },
    })
  }

  /**
   * 列出内容
   */
  async list(options?: {
    author?: string
    limit?: number
    offset?: number
  }): Promise<ListBoardsResponse> {
    const params = new URLSearchParams()
    if (options?.author) params.set('author', options.author)
    if (options?.limit) params.set('limit', options.limit.toString())
    if (options?.offset) params.set('offset', options.offset.toString())

    const query = params.toString()
    return this.request(`/api/board/list${query ? `?${query}` : ''}`)
  }
}