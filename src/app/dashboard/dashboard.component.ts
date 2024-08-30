import { Component, OnInit } from '@angular/core';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { PageComponent } from '../pickle-ui/page/page.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavigationComponent, PageComponent, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router){}
  ngOnInit(): void {
    if (this.router.url === '/') {
      this.router.navigate(['links']);
    }
  }
}
