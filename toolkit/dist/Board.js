"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = void 0;
class Board {
    constructor(config) {
        this.baseUrl = config.baseUrl.replace(/\/$/, '');
        this.apiKey = config.apiKey;
        this.timeout = config.timeout || 30000;
    }
    async request(path, options = {}) {
        const url = `${this.baseUrl}${path}`;
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        };
        if (this.apiKey) {
            headers['X-API-Key'] = this.apiKey;
        }
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        try {
            const response = await fetch(url, {
                ...options,
                headers,
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                // 构建详细错误信息
                let errorMessage = errorData.error || `HTTP ${response.status}`;
                if (errorData.details) {
                    errorMessage += `\n详情: ${errorData.details}`;
                }
                if (errorData.hint) {
                    errorMessage += `\n提示: ${errorData.hint}`;
                }
                if (errorData.example) {
                    errorMessage += `\n示例: ${JSON.stringify(errorData.example, null, 2)}`;
                }
                if (errorData.received) {
                    errorMessage += `\n收到的值: ${errorData.received}`;
                }
                throw new Error(errorMessage);
            }
            return await response.json();
        }
        catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof Error && error.name === 'AbortError') {
                throw new Error(`请求超时 (${this.timeout}ms)`);
            }
            throw error;
        }
    }
    /**
     * 提交内容到看板
     * 返回包含 ownerToken 的结果，用于后续更新/删除操作
     */
    async submit(data) {
        return this.request('/api/board/submit', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
    /**
     * 更新内容（需要 ownerToken）
     */
    async update(id, ownerToken, data) {
        return this.request(`/api/board/${id}`, {
            method: 'PUT',
            headers: {
                'X-Owner-Token': ownerToken,
            },
            body: JSON.stringify(data),
        });
    }
    /**
     * 删除内容（需要 ownerToken）
     */
    async delete(id, ownerToken) {
        return this.request(`/api/board/${id}`, {
            method: 'DELETE',
            headers: {
                'X-Owner-Token': ownerToken,
            },
        });
    }
    /**
     * 列出内容
     */
    async list(options) {
        const params = new URLSearchParams();
        if (options?.author)
            params.set('author', options.author);
        if (options?.limit)
            params.set('limit', options.limit.toString());
        if (options?.offset)
            params.set('offset', options.offset.toString());
        const query = params.toString();
        return this.request(`/api/board/list${query ? `?${query}` : ''}`);
    }
}
exports.Board = Board;
