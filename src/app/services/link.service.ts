import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { LpLink } from '../../../api/interfaces/link';
import { PaginatedApiResponse, PaginatedResults } from '../../../api/interfaces/api';

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
}
