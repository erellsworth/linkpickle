import { Injectable, OnDestroy, OnInit, signal } from '@angular/core';
import { LpNotification } from '../../../api/interfaces/notification';
import { HttpClient } from '@angular/common/http';
import { filter, firstValueFrom, map, Subscription } from 'rxjs';
import { ApiResponse } from '../../../api/interfaces/api';
import { LpNotificationStatus } from '../../../api/interfaces/notificationStatus.interface';
import { SocketService } from './socket.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService implements OnDestroy {
  public notifications = signal<LpNotification[]>([]);

  private _sub!: Subscription;

  constructor(
    private http: HttpClient,
    private socketService: SocketService,
    private userService: UserService,
  ) {
    this.fetchNotifications();
    this._sub = this.socketService
      .channel('notifications')
      .pipe(
        filter((message) => Boolean(message.Notification)),
        map((message) => message.Notification),
      )
      .subscribe((notification) => {
        this.notifications.update((notifications) => {
          notifications.unshift(notification as LpNotification);
          return notifications;
        });
      });
  }

  ngOnDestroy(): void {
    this._sub?.unsubscribe();
  }

  public async clearNotifications(): Promise<true | string> {
    try {
      const result = await firstValueFrom(
        this.http.patch<ApiResponse<LpNotification[]>>(
          'api/notifications/clear',
          {},
        ),
      );
      if (result.success) {
        return true;
      }
      return result.error?.message || 'Unknown Server Error';
    } catch (e) {
      return (e as Error).message;
    }
  }

  public async fetchNotifications(): Promise<void> {
    if (!this.userService.isLoggedIn) {
      return;
    }
    try {
      const result = await firstValueFrom(
        this.http.get<ApiResponse<LpNotification[]>>('api/notifications'),
      );
      if (result.success) {
        this.notifications.set(result.data as LpNotification[]);
      }
    } catch (e) {}
  }

  public async readNotification(
    notificationId: number,
  ): Promise<true | string> {
    try {
      const result = await firstValueFrom(
        this.http.patch<ApiResponse<LpNotificationStatus>>(
          `api/notifications/read/${notificationId}`,
          {},
        ),
      );

      if (result.success) {
        this.notifications.update((notifications) =>
          notifications.map((notification) => {
            if (notification.id === notificationId) {
              notification.status = 'read';
            }
            return notification;
          }),
        );
        return true;
      }

      return result.error?.message || 'Unknown Error';
    } catch (e) {
      return (e as Error).message;
    }
  }
}
