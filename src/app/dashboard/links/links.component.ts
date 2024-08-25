import { Component, OnInit } from '@angular/core';
import { LinkService } from '../../services/link.service';
import { firstValueFrom } from 'rxjs';
import { LpLink } from '../../../../api/interfaces/link';
import { LoadingIndicatorComponent } from '../../pickle-ui/loading-indicator/loading-indicator.component';
import { LinkPicklerComponent } from '../components/link-pickler/link-pickler.component';

@Component({
  selector: 'app-links',
  standalone: true,
  imports: [LinkPicklerComponent, LoadingIndicatorComponent],
  templateUrl: './links.component.html',
  styleUrl: './links.component.scss'
})
export class LinksComponent implements OnInit {

  public links: LpLink[] = [];
  public loading = false;

  private _page = 0;

  constructor(private linkService: LinkService) { }

  ngOnInit(): void {
    this.fetchLinks();
  }

  private async fetchLinks(): Promise<void> {
    this.loading = true;
    const result = await firstValueFrom(this.linkService.getLinks$(this._page));

    this.links = result.contents;
    this.loading = false;
  }

}
