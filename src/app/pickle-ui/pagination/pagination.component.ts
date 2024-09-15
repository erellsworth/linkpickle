import { Component, EventEmitter, input, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  @Output() pageChanged = new EventEmitter<number>();

  @Input() currentPage = 1;
  @Input() resultsPerPage = 10;
  @Input({ required: true }) totalResults!: number;

  public get pages(): number[] {
    return [
      ...Array(Math.ceil(this.totalResults / this.resultsPerPage)).keys(),
    ].map((page) => page + 1);
  }

  public get showPagination(): boolean {
    return this.totalResults > this.resultsPerPage;
  }

  public selectPage(page: number): void {
    this.currentPage = page;
    this.pageChanged.emit(this.currentPage);
  }
}
