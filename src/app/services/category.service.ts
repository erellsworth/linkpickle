import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LpCategory } from '../../../api/interfaces/category';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from '../../../api/interfaces/api';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  public async getCategories(): Promise<LpCategory[]> {
    try { 
      const results = await firstValueFrom(this.http.get<ApiResponse<LpCategory[]>>('api/categories'));
      if (results.success) {
        return results.data as LpCategory[];
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  public getTempCategory(name: string): LpCategory {
    return {
      name
    } as LpCategory
  }
}
