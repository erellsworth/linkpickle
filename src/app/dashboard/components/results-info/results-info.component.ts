import { Component } from '@angular/core';
import { LinkService } from '../../../services/link.service';
import { LpLink } from '../../../../../api/interfaces/link';
import { CategoryService } from '../../../services/category.service';
import { LpCategory } from '../../../../../api/interfaces/category';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { LoadingIndicatorComponent } from '../../../pickle-ui/loading-indicator/loading-indicator.component';

@Component({
  selector: 'app-results-info',
  standalone: true,
  imports: [AsyncPipe, LoadingIndicatorComponent],
  templateUrl: './results-info.component.html',
  styleUrl: './results-info.component.scss',
})
export class ResultsInfoComponent {
  constructor(
    private categoryService: CategoryService,
    private linkService: LinkService
  ) {}

  public get categories() {
    return this.categoryService.categories();
  }

  public get category(): Observable<LpCategory | undefined> {
    return this.categoryService.currentCategory$;
  }

  public get loading(): boolean {
    return this.linkService.loading();
  }

  public get links(): LpLink[] {
    return this.linkService.links()?.contents || [];
  }

  public get total(): number {
    return this.linkService.links()?.total || 0;
  }
}
