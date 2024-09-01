export interface LpLinkQuery {
    categoryIds?: number[];
    siteId?: number[];
    title?: string;
    keywords?: string[];
    limit?: number;
    page?: number;
    isPublic?: boolean;
    orderBy?: string;
    order?: 'DESC' | 'ASC'
}