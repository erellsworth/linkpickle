import { Component } from '@angular/core';
import { NavigationComponent } from './components/navigation/navigation.component';
import { RouterOutlet } from '@angular/router';
import { PageComponent } from '../pickle-ui/page/page.component';
import { LinkPicklerComponent } from './components/link-pickler/link-pickler.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    LinkPicklerComponent,
    NavigationComponent,
    PageComponent,
    RouterOutlet,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
