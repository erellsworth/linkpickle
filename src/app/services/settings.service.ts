import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { LpSetting } from '../../../api/interfaces/setting';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from '../../../api/interfaces/api';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  public settings = signal<LpSetting[]>([]);

  constructor(private http: HttpClient) {
    this.fetchSettings();
  }

  private async fetchSettings(): Promise<void> {
    const results = await firstValueFrom(
      this.http.get<ApiResponse<LpSetting[]>>('api/settings')
    );
    if (results.success) {
      this.settings.set(results.data as LpSetting[]);
    }
  }
}
