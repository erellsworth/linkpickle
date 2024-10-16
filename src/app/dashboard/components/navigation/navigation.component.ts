import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { LpCategory } from '../../../../../api/interfaces/category';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBell,
  faGear,
  faHome,
  faJar,
  faRightFromBracket,
  faThumbTack,
} from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../../services/user.service';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    FontAwesomeModule,
    NotificationsComponent,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  public icons = {
    home: faHome,
    jar: faJar,
    logOut: faRightFromBracket,
    notifications: faBell,
    pinned: faThumbTack,
    settings: faGear,
  };

  public showNotifications = false;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private userService: UserService,
  ) {}

  public get categories(): LpCategory[] {
    return this.categoryService.categories().filter((cat) => Boolean(cat.id));
  }

  public get showSettings(): boolean {
    return this.userService.isAdmin();
  }

  public logout(): void {
    this.userService.clearUser();
    this.router.navigate(['/user/login']);
  }
}
