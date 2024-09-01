import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LinkService } from '../../services/link.service';
import { LpLink } from '../../../../api/interfaces/link';
import { LoadingIndicatorComponent } from '../../pickle-ui/loading-indicator/loading-indicator.component';
import { LinkPicklerComponent } from '../components/link-pickler/link-pickler.component';
import { LinkCardComponent } from './link-card/link-card.component';
import { LpLinkQuery } from '../../../../api/interfaces/query';

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
export class LinksComponent implements OnChanges {

  @Input()
  set page(page: number) {
    this.query.page = page || 1;
  }

  @Input()
  get query(): LpLinkQuery  {
    return this._query
  };

  set query(query) {
    this._query = query || this._query;
  }

  public loading = false;

  private _query: LpLinkQuery = {}
  
  constructor(private linkService: LinkService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.linkService.queryLinks(this.query);
  }

  public get links(): LpLink[] {
    return this.linkService.links()?.contents || [];
  }

  public get total(): number {
    return this.linkService.links()?.total || 0;
  }

}
