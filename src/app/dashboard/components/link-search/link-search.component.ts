import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { delay, firstValueFrom, timer } from 'rxjs';
import { LinkService } from '../../../services/link.service';

@Component({
  selector: 'app-link-search',
  standalone: true,
  imports: [FontAwesomeModule, FormsModule],
  templateUrl: './link-search.component.html',
  styleUrl: './link-search.component.scss',
})
export class LinkSearchComponent {
  public icon = faSearch;
  public searchTerm!: string;

  private doingSearch = false;
  private isTyping = false;
  private lastChange = new Date().getTime();
  private timeBetweenSearches = 500; //in miliseconds
  private timeOut!: ReturnType<typeof setTimeout>;

  constructor(private linkService: LinkService) {}

  public async searchChanged(): Promise<void> {
    clearTimeout(this.timeOut);

    this.timeOut = setTimeout(() => {
      clearTimeout(this.timeOut);
      this.doSearch();
    }, this.timeBetweenSearches);
  }

  private async doSearch(): Promise<void> {
    if (this.doingSearch) {
      await firstValueFrom(timer(this.timeBetweenSearches));
      return this.doSearch();
    }

    this.doingSearch = true;

    await this.linkService.searchLinks(this.searchTerm);

    this.doingSearch = false;
  }
}
