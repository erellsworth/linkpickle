import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { LpSetting, LpSettingValue } from '../../../api/interfaces/setting';
import { firstValueFrom } from 'rxjs';
import { ApiResponse, GenericResult } from '../../../api/interfaces/api';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  public settings = signal<LpSetting[]>([]);

  constructor(private http: HttpClient) {
    this.fetchSettings();
  }

  public async saveSettings(settings: {
    [key: string]: string;
  }): Promise<GenericResult> {
    try {
      return firstValueFrom(
        this.http.patch<ApiResponse>('api/settings', { settings }),
      );
    } catch (e) {
      return {
        success: false,
        error: e as Error,
      };
    }
  }

  public async createSetting(
    setting: LpSetting,
    value: LpSettingValue,
  ): Promise<string | true> {
    return true;
  }

  private async fetchSettings(): Promise<void> {
    const results = await firstValueFrom(
      this.http.get<ApiResponse<LpSetting[]>>('api/settings'),
    );
    if (results.success) {
      this.settings.set(results.data as LpSetting[]);
    }
  }
}
