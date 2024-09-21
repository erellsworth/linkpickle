import {
  HttpClient,
  HttpParams,
  HttpParamsOptions,
} from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';
import { LpLink, LpLinkPreview } from '../../../api/interfaces/link';
import {
  ApiResponse,
  PaginatedApiResponse,
  PaginatedResults,
} from '../../../api/interfaces/api';
import { LpCategory } from '../../../api/interfaces/category';
import { LpLinkQuery } from '../../../api/interfaces/query';

interface queryCache {
  query: string;
  result: PaginatedResults<LpLink>;
}

@Injectable({
  providedIn: 'root',
})
export class LinkService {
  private currentQuery: LpLinkQuery = {};
  private queryCache = signal<queryCache[]>([]);

  public loading = signal<boolean>(false);
  public links = computed(() => {
    const results = this.queryCache().find(
      (cache) => cache.query === JSON.stringify(this.currentQuery)
    );
    if (results) {
      return results.result;
    }
    return;
  });

  constructor(private http: HttpClient) {}

  public queryLinks(query: LpLinkQuery): void {
    this.currentQuery = query;
    this.updateCache();
  }

  public async getLink(LinkId: number): Promise<LpLink | string> {
    try {
      const result = await firstValueFrom(
        this.http.get<ApiResponse<LpLink>>(`api/link/${LinkId}`)
      );
      if (result.success) {
        return result.data as LpLink;
      }

      return result.error?.message || 'Unknown Error';
    } catch (e) {
      return (e as Error).message;
    }
  }

  public async getLinkPreview(
    url?: string
  ): Promise<{ preview: LpLinkPreview; siteName: string } | string> {
    const validUrl = this.getValidUrl(url);

    if (!validUrl) {
      return 'URL is not valid';
    }

    try {
      const urlData = await firstValueFrom(
        this.http.get<
          ApiResponse<{
            preview: LpLinkPreview;
            siteName: string;
          }>
        >('api/links/linkPreview', {
          params: {
            url: validUrl,
          },
        })
      );

      return urlData.success
        ? (urlData.data as { preview: LpLinkPreview; siteName: string })
        : urlData.error?.message || 'Unknown Error';
    } catch (e) {
      return (e as Error).message || 'Unknown Error';
    }
  }

  public async createLink(
    link: LpLink,
    categories: LpCategory[] = []
  ): Promise<LpLink | string> {
    try {
      const result = await firstValueFrom(
        this.http.post<ApiResponse<LpLink>>('api/links', {
          link,
          categories,
        })
      );

      if (result.success) {
        this.updateCache();
        return result.data as LpLink;
      }

      return result.error?.message || 'Unknown Error';
    } catch (e) {
      return (e as Error).message || 'Unknown Error';
    }
  }

  public async deleteLink(linkId: number): Promise<ApiResponse<boolean>> {
    try {
      const result = await firstValueFrom(
        this.http.delete<ApiResponse<boolean>>(`api/link/${linkId}`)
      );

      if (result.success) {
        this.updateCache();
        return result;
      } else {
        return {
          success: false,
          error: result.error,
        };
      }
    } catch (e) {
      return {
        success: false,
        error: e as Error,
      };
    }
  }

  public async searchLinks(searchTerm: string) {
    this.currentQuery = {
      ...this.currentQuery,
      ...{
        searchTerm,
      },
    };

    return this.updateCache();
  }

  public async updateLink(
    link: LpLink,
    categories: LpCategory[] = []
  ): Promise<LpLink | string> {
    try {
      const result = await firstValueFrom(
        this.http.put<ApiResponse<LpLink>>('api/links', {
          link,
          categories,
        })
      );

      if (result.success) {
        this.updateCache();
        return result.data as LpLink;
      }

      return result.error?.message || 'Unknown Error';
    } catch (e) {
      return (e as Error).message || 'Unknown Error';
    }
  }

  private getValidUrl(url?: string): string | false {
    if (!url) {
      return false;
    }
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      url = `https://${url}`;
    }

    try {
      new URL(url);
      return url;
    } catch (err) {
      return false;
    }
  }

  private httpParamsFromQuery(query: LpLinkQuery): HttpParams {
    let params = new HttpParams();

    Object.keys(query).forEach((key) => {
      const queryKey = key as keyof LpLinkQuery;
      const value = query[queryKey];

      if (Array.isArray(value)) {
        value.forEach((val) => {
          params = params.append(`${key}[]`, val);
        });
      } else {
        params = params.append(key, value as string);
      }
    });

    return params;
  }

  private async updateCache(): Promise<void> {
    this.loading.set(true);
    try {
      const params = this.httpParamsFromQuery(this.currentQuery);
      const result = await firstValueFrom(
        this.http.get<PaginatedApiResponse<LpLink>>(`api/links/search`, {
          params,
        })
      );

      if (result.success) {
        const caches: queryCache[] = [];

        this.queryCache().forEach((cache) => {
          if (cache.query === JSON.stringify(this.currentQuery)) {
            cache.result = result.data as PaginatedResults<LpLink>;
            caches.push(cache);
          }
        });

        if (!caches.length) {
          caches.push({
            query: JSON.stringify(this.currentQuery),
            result: result.data as PaginatedResults<LpLink>,
          });
        }

        this.queryCache.set(caches);
      }
    } catch (e) {}

    this.loading.set(false);
  }
}
