export interface LpLinkQuery {
  categoryIds?: number[];
  uncategorized?: boolean;
  siteId?: number[];
  title?: string;
  searchTerm?: string;
  url?: string;
  keywords?: string[];
  limit?: number;
  page?: number;
  isPublic?: boolean;
  orderBy?: string;
  order?: 'DESC' | 'ASC';
  pinned?: boolean;
}
