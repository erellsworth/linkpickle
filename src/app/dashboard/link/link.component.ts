import { Component, Input } from '@angular/core';
import { LpLink } from '../../../../api/interfaces/link';
import { LinkService } from '../../services/link.service';
import { ToasterService } from '../../services/toaster.service';
import { LinkCardComponent } from '../links/link-card/link-card.component';

@Component({
  selector: 'app-link',
  standalone: true,
  imports: [LinkCardComponent],
  templateUrl: './link.component.html',
  styleUrl: './link.component.scss',
})
export class LinkComponent {
  public link!: LpLink;

  @Input()
  set id(id: string) {
    this.loadLink(Number(id));
  }

  constructor(
    private linkService: LinkService,
    private toaster: ToasterService
  ) {}

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
