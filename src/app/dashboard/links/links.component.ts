import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { LinkService } from '../../services/link.service';
import { LpLink } from '../../../../api/interfaces/link';
import { LoadingIndicatorComponent } from '../../pickle-ui/loading-indicator/loading-indicator.component';
import { LinkPicklerComponent } from '../components/link-pickler/link-pickler.component';
import { LinkCardComponent } from './link-card/link-card.component';
import { LpLinkQuery } from '../../../../api/interfaces/query';
import { CategoryService } from '../../services/category.service';
import { LpCategory } from '../../../../api/interfaces/category';
import { ResultsInfoComponent } from '../components/results-info/results-info.component';

@Component({
  selector: 'app-links',
  standalone: true,
  imports: [
    LinkPicklerComponent,
    LinkCardComponent,
    LoadingIndicatorComponent,
    ResultsInfoComponent,
  ],
  templateUrl: './links.component.html',
  styleUrl: './links.component.scss',
})
export class LinksComponent implements OnChanges {
  @Input()
  set page(page: string) {
    if (page === 'pinned') {
      this.query.pinned = true;
    } else {
      this.query.page = page ? Number(page) : 1;
    }
  }

  @Input()
  get query(): LpLinkQuery {
    return this._query;
  }

  set query(query) {
    this._query = query || this._query;
  }

  public categories: LpCategory[] = [];
  public loading = false;

  private _query: LpLinkQuery = {};

  constructor(
    private categoryService: CategoryService,
    private linkService: LinkService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.query.categoryIds?.length) {
      this.categoryService.currentCategoryId = 0;
    }
    this.linkService.queryLinks(this.query);
    this.categories = this.categoryService.getCategoriesFromIds(
      this.categoryIds
    );
  }

  public get categoryIds(): number[] {
    return this.query.categoryIds || [];
  }

  public get links(): LpLink[] {
    return this.linkService.links()?.contents || [];
  }

  public get total(): number {
    return this.linkService.links()?.total || 0;
  }
}
