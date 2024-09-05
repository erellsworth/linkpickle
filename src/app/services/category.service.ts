import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { LpCategory } from '../../../api/interfaces/category';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { ApiResponse } from '../../../api/interfaces/api';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  public categories = signal<LpCategory[]>([]);

  public currentCategory$ = new BehaviorSubject<LpCategory | undefined>(
    undefined
  );

  public get currentCategoryId(): number | undefined {
    return this._currentCategoryId;
  }

  public set currentCategoryId(id: number) {
    this._currentCategoryId = id;
    this.refreshCurrentCategory();
  }

  private _currentCategoryId!: number;

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
        this.refreshCurrentCategory();
      }
    } catch (e) {
      console.error('error loading categoires');
    }
  }

  private refreshCurrentCategory() {
    if (!this.currentCategoryId) {
      this.currentCategory$.next(undefined);
      return;
    }
    const cat = this.getCategoryById(this.currentCategoryId);
    if (cat) {
      this.currentCategory$.next(cat);
    }
  }
}
