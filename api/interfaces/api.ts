import { LpUser } from './user';

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
  };
}

export interface ApiResponse<T = void> extends GenericResult {
  data?: T;
  user?: LpUser;
}

export interface PaginatedApiResponse<T = void> extends GenericResult {
  data?: PaginatedResults<T>;
}
