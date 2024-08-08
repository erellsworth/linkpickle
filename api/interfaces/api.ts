
export interface PaginatedResults<T> {
    contents: T[];
    total: number;
    page: number;
}

export interface GenericResult {
    success: boolean;
    error?: {
        message: string;
        code?: number;
    }
}

export interface ApiResponse<T = void> extends GenericResult {
    data?: T;
}

export interface PaginatedApiResponse<T = void> extends GenericResult {
    data?: PaginatedResults<T>
}