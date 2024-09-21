import { Injectable, signal } from '@angular/core';
import { LpNotification } from '../../../api/interfaces/notification';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from '../../../api/interfaces/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  public notifications = signal<LpNotification[]>([]);

  constructor(private http: HttpClient, private userService: UserService) {
    this.fetchNotifications();
  }

  public async fetchNotifications(): Promise<void> {
    if (!this.userService.isLoggedIn) {
      return;
    }
    try {
      const result = await firstValueFrom(
        this.http.get<ApiResponse<LpNotification[]>>('api/notifications')
      );
      if (result.success) {
        this.notifications.set(result.data as LpNotification[]);
      }
    } catch (e) {}
  }

  public async readNotification(notificationId: number): Promise<void> {
    this.notifications.update((notifications) =>
      notifications.map((notification) => {
        if (notification.id === notificationId) {
          notification.status = 'read';
        }
        return notification;
      })
    );
  }
}
