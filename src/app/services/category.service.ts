import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { LpCategory } from '../../../api/interfaces/category';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from '../../../api/interfaces/api';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  public categories = signal<LpCategory[]>([]);

  constructor(private http: HttpClient) { 
    this.loadCategories();
  }

  public getCategoryById(id: number): LpCategory | undefined {
    return this.categories().find(cat => cat.id === id);
  }

  public getTempCategory(name: string): LpCategory {
    return {
      name
    } as LpCategory
  }

  public async loadCategories(): Promise<void> {
    try { 
      const results = await firstValueFrom(this.http.get<ApiResponse<LpCategory[]>>('api/categories'));
      if (results.success) {
        this.categories.set(results.data as LpCategory[]);
      }
    } catch (e) {
      console.error('error loading categoires');
    }
  }
}
