import type { SubmitBoardRequest, SubmitBoardResponse, BoardData, ListBoardsResponse } from './types';
export interface BoardConfig {
    baseUrl: string;
    apiKey?: string;
    timeout?: number;
}
export interface SubmitResult extends SubmitBoardResponse {
    ownerToken: string;
}
export declare class Board {
    private baseUrl;
    private apiKey?;
    private timeout;
    constructor(config: BoardConfig);
    private request;
    /**
     * 提交内容到看板
     * 返回包含 ownerToken 的结果，用于后续更新/删除操作
     */
    submit(data: SubmitBoardRequest): Promise<SubmitResult>;
    /**
     * 更新内容（需要 ownerToken）
     */
    update(id: string, ownerToken: string, data: Partial<SubmitBoardRequest>): Promise<BoardData>;
    /**
     * 删除内容（需要 ownerToken）
     */
    delete(id: string, ownerToken: string): Promise<{
        success: boolean;
    }>;
    /**
     * 列出内容
     */
    list(options?: {
        author?: string;
        limit?: number;
        offset?: number;
    }): Promise<ListBoardsResponse>;
}
