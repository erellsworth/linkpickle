import { Component, HostBinding } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faBell, faComment, faLink } from '@fortawesome/free-solid-svg-icons';
import { faBell as bellOutline } from '@fortawesome/free-regular-svg-icons';
import { LpNotification } from '../../../../../api/interfaces/notification';
import { NotificationService } from '../../../services/notification.service';
import { ToasterService } from '../../../services/toaster.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
  providers: [NotificationService],
})
export class NotificationsComponent {
  @HostBinding('class.notificationsShowing')
  get notificationsShowing(): boolean {
    return this.showNotifications;
  }

  public showNotifications = false;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private toaster: ToasterService,
  ) {}

  public get hasNotifications(): boolean {
    return Boolean(
      this.notifications.filter(
        (notification) => notification.status === 'unread',
      ).length,
    );
  }

  public get navIcon(): IconDefinition {
    return this.hasNotifications ? faBell : bellOutline;
  }

  public get notifications(): LpNotification[] {
    return this.notificationService.notifications();
  }

  public async clearAll(): Promise<void> {
    const result = await this.notificationService.clearNotifications();

    if (typeof result === 'string') {
      if (typeof result === 'string') {
        this.toaster.add({
          title: 'Problem clearing notifications',
          message: result,
          severity: 'warning',
        });
      }
    } else {
      this.showNotifications = false;
    }
  }

  public notificationIcon(notification: LpNotification): IconDefinition {
    return notification.CommentId ? faComment : faLink;
  }

  public async readNotification(notification: LpNotification): Promise<void> {
    const result = await this.notificationService.readNotification(
      notification.id,
    );

    if (typeof result === 'string') {
      this.toaster.add({
        title: 'Problem updating notification status',
        message: result,
        severity: 'warning',
      });
    }

    if (notification.LinkId) {
      this.router.navigate(['/link', notification.LinkId]);
      this.showNotifications = false;
    }
  }
}
