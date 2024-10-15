import { Component, Input } from '@angular/core';
import { LpLink } from '../../../../api/interfaces/link';
import { LinkService } from '../../services/link.service';
import { ToasterService } from '../../services/toaster.service';
import { LinkCardComponent } from '../links/link-card/link-card.component';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavigationService } from '../../services/navigation.service';
import { DashboardPageComponent } from '../components/dashboard-page/dashboard-page.component';

@Component({
  selector: 'app-link',
  standalone: true,
  imports: [DashboardPageComponent, FontAwesomeModule, LinkCardComponent],
  templateUrl: './link.component.html',
  styleUrl: './link.component.scss',
})
export class LinkComponent {
  public backIcon = faArrowLeft;
  public link!: LpLink;

  @Input()
  set id(id: string) {
    this.loadLink(Number(id));
  }

  constructor(
    private linkService: LinkService,
    private nav: NavigationService,
    private toaster: ToasterService,
  ) {}

  public goBack() {
    this.nav.back();
  }

  private async loadLink(id: number): Promise<void> {
    const link = await this.linkService.getLink(id);

    if (typeof link === 'string') {
      this.toaster.add({
        title: 'Error',
        message: link,
        severity: 'error',
      });
    } else {
      this.link = link;
    }
  }
}
