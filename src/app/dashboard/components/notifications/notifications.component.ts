import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faBell as bellOutline } from '@fortawesome/free-regular-svg-icons';
import { LpNotification } from '../../../../../api/interfaces/notification';
import { NotificationService } from '../../../services/notification.service';
import { ModalService } from '../../../services/modal.service';
import { LinkService } from '../../../services/link.service';
import { LpLink } from '../../../../../api/interfaces/link';
import { ToasterService } from '../../../services/toaster.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent {
  public showNotifications = false;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private toaster: ToasterService
  ) {}

  public get icon(): IconDefinition {
    return this.notifications.length ? faBell : bellOutline;
  }

  public get notifications(): LpNotification[] {
    return this.notificationService.notifications();
  }

  public async readNotification(notification: LpNotification): Promise<void> {
    const result = await this.notificationService.readNotification(
      notification.id
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
    }
  }
}
