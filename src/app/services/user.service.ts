import { Injectable, signal, WritableSignal } from '@angular/core';
import { LpUser } from '../../../api/interfaces/user';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ApiResponse, GenericResult } from '../../../api/interfaces/api';
import { LocalStoreService } from './local-store.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private localStore: LocalStoreService) {
    const localUser = localStore.getValue<LpUser>('PickleUser');
    if (localUser) {
      this.user.set(localUser);
    }
  }

  public user: WritableSignal<LpUser> = signal({} as LpUser);

  public get isLoggedIn(): boolean {
    return Boolean(this.token);
  }

  public get token(): string {
    const token = this.user().Token;
    return token?.token || '';
  }

  public clearUser(): void {
    this.user.set({} as LpUser);
    this.localStore.setValue('PickleUser', {});
  }

  public async login(credentials: {
    email: string;
    password: string;
  }): Promise<GenericResult> {
    try {
      const result = await firstValueFrom(
        this.http.post<ApiResponse<LpUser>>('api/user/login', credentials)
      );

      if (result.success) {
        this.user.set(result.data as LpUser);
        this.localStore.setValue('PickleUser', result.data);
      }

      return result;
    } catch (e) {
      return {
        success: false,
        error: e as Error,
      };
    }
  }

  public async register(credentials: {
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<GenericResult> {
    try {
      const result = await firstValueFrom(
        this.http.post<ApiResponse>('api/user/register', credentials)
      );

      return result;
    } catch (e) {
      return {
        success: false,
        error: e as Error,
      };
    }
  }

  public async recover(email: string) {
    //TODO
  }
}
