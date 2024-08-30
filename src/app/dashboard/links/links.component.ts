import { Component, OnDestroy, OnInit } from '@angular/core';
import { LinkService } from '../../services/link.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { LpLink } from '../../../../api/interfaces/link';
import { LoadingIndicatorComponent } from '../../pickle-ui/loading-indicator/loading-indicator.component';
import { LinkPicklerComponent } from '../components/link-pickler/link-pickler.component';
import { LinkCardComponent } from './link-card/link-card.component';

@Component({
  selector: 'app-links',
  standalone: true,
  imports: [
    LinkPicklerComponent,
    LinkCardComponent,
    LoadingIndicatorComponent],
  templateUrl: './links.component.html',
  styleUrl: './links.component.scss'
})
export class LinksComponent implements OnInit, OnDestroy {

  public links: LpLink[] = [];
  public loading = false;
  public page = 1;
  public total = 0;
  
  private _subs: Subscription[] = [];

  constructor(private linkService: LinkService) { }

  ngOnInit(): void {
    this.fetchLinks();
    this._subs.push(this.linkService.linksUpdated$.subscribe(() => { this.fetchLinks()}));
  }

  ngOnDestroy(): void {
    this._subs.forEach(sub => sub.unsubscribe());
  }

  private async fetchLinks(): Promise<void> {
    this.loading = true;
    const result = await this.linkService.getLinks(this.page);

    this.links = result.contents;
    this.total = result.total;

    this.loading = false;
  }

}
