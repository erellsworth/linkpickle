import { Component } from '@angular/core';
import { NavigationComponent } from './components/navigation/navigation.component';
import { RouterOutlet } from '@angular/router';
import { PageComponent } from '../pickle-ui/page/page.component';
import { LinkPicklerComponent } from './components/link-pickler/link-pickler.component';
import { DashboardPageComponent } from './components/dashboard-page/dashboard-page.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DashboardPageComponent,
    FontAwesomeModule,
    LinkPicklerComponent,
    NavigationComponent,
    PageComponent,
    RouterOutlet,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  public expanded = false;
  public menuIcon = faBars;

  public toggle() {
    console.log('toggle');
    this.expanded = !this.expanded;
  }
}
