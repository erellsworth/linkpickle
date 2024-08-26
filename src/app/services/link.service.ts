import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map, Observable, of } from 'rxjs';
import { LpLink, LpLinkPreview } from '../../../api/interfaces/link';
import { ApiResponse, PaginatedApiResponse, PaginatedResults } from '../../../api/interfaces/api';

@Injectable({
  providedIn: 'root'
})
export class LinkService {

  constructor(private http: HttpClient) { }

  public getLinks$(page: number): Observable<PaginatedResults<LpLink>> {
    try {
      return this.http.get<PaginatedApiResponse<LpLink>>(`api/links/${page}`).pipe(map(result => {
        if (result.success) {
          return result.data as PaginatedResults<LpLink>;
        }

        return {
          contents: [],
          total: 0,
          page
        };
      }));
    } catch (e) {
      return of({
        contents: [],
        total: 0,
        page
      });
    }
  }

  public async getLinkPreview(url?: string): Promise<{ preview: LpLinkPreview; siteName: string; } | false> {
    const validUrl = this.getValidUrl(url);
    
    if (!validUrl) { return false; }

    try {
      const urlData = await firstValueFrom(this.http.get<ApiResponse<{
        preview: LpLinkPreview,
        siteName: string
      }>>('api/links/linkPreview', {
        params: {
          url: validUrl
        }
      }));

      return urlData.success ? urlData.data as { preview: LpLinkPreview; siteName: string; } : false;
    } catch (e) {
      return false;
    }
  }

  private getValidUrl(url?: string): string | false {
    if (!url) { return false; }
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
}
