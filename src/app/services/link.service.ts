import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  firstValueFrom, Subject } from 'rxjs';
import { LpLink, LpLinkPreview } from '../../../api/interfaces/link';
import { ApiResponse, PaginatedApiResponse, PaginatedResults } from '../../../api/interfaces/api';
import { LpCategory } from '../../../api/interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class LinkService {

  public linksUpdated$ = new Subject<void>();

  constructor(private http: HttpClient) { }

  public async getLinks(page: number): Promise<PaginatedResults<LpLink>> {
    try {
      const result = await firstValueFrom(this.http.get<PaginatedApiResponse<LpLink>>(`api/links/${page}`));
      
      if (result.success) {
        return result.data as PaginatedResults<LpLink>;
      }

      return {
        contents: [],
        total: 0,
        page
      };
    } catch (e) {
      return {
        contents: [],
        total: 0,
        page
      };
    }
  }

  public async getLinksByCategoryId(id: number, page: number): Promise<PaginatedResults<LpLink>> {
    try {
      const result = await firstValueFrom(this.http.get<PaginatedApiResponse<LpLink>>(`api/links/category/${id}/${page}`));
      
      if (result.success) {
        return result.data as PaginatedResults<LpLink>;
      }

      return {
        contents: [],
        total: 0,
        page
      };
    } catch (e) {
      return {
        contents: [],
        total: 0,
        page
      };
    }
  }
  public async getLinkPreview(url?: string): Promise<{ preview: LpLinkPreview; siteName: string; } | string> {
    const validUrl = this.getValidUrl(url);
    
    if (!validUrl) { return 'URL is not valid'; }

    try {
      const urlData = await firstValueFrom(this.http.get<ApiResponse<{
        preview: LpLinkPreview,
        siteName: string
      }>>('api/links/linkPreview', {
        params: {
          url: validUrl
        }
      }));

      return urlData.success ? urlData.data as { preview: LpLinkPreview; siteName: string; } : urlData.error?.message || 'Unknown Error';
    } catch (e) {
      return (e as Error).message || 'Unknown Error';
    }
  }

  public async saveLink(link: LpLink, categories: LpCategory[] =[]): Promise<LpLink | string> {
    try {
      const result = await firstValueFrom(this.http.post<ApiResponse<LpLink>>('api/links', {
        link,
        categories
      }));

      if (result.success) {
        this.linksUpdated$.next();
        return result.data as LpLink;
      }

      return result.error?.message || 'Unknown Error'
     } catch (e) {
      return (e as Error).message || 'Unknown Error'
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
