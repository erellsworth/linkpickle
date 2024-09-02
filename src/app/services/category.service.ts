import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { LpCategory } from '../../../api/interfaces/category';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from '../../../api/interfaces/api';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  public categories = signal<LpCategory[]>([]);

  public get currentCategory() {
    return this.getCategoryById(this.currentCategoryId);
  }

  public currentCategoryId!: number;

  constructor(private http: HttpClient) {
    this.loadCategories();
  }

  public getCategoriesFromIds(ids: number[]): LpCategory[] {
    return ids
      .map((id) => this.getCategoryById(id))
      .filter((cat) => Boolean(cat)) as LpCategory[];
  }

  public getCategoryById(id: number): LpCategory | undefined {
    return this.categories().find((cat) => cat.id === id);
  }

  public getTempCategory(name: string): LpCategory {
    const temp = {
      name,
    } as LpCategory;

    this.categories.update((cats) => {
      cats.push(temp);
      return cats;
    });
    return temp;
  }

  public async loadCategories(): Promise<void> {
    try {
      const results = await firstValueFrom(
        this.http.get<ApiResponse<LpCategory[]>>('api/categories')
      );
      if (results.success) {
        this.categories.set(results.data as LpCategory[]);
      }
    } catch (e) {
      console.error('error loading categoires');
    }
  }
}
