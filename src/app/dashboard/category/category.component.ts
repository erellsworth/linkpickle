import { Component, Input, OnInit } from '@angular/core';
import { LinkService } from '../../services/link.service';
import { LpLink } from '../../../../api/interfaces/link';
import { CategoryService } from '../../services/category.service';
import { LpCategory } from '../../../../api/interfaces/category';
import { LpLinkQuery } from '../../../../api/interfaces/query';
import { LinksComponent } from '../links/links.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [LinksComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {

  public links: LpLink[] = [];
  public query!: LpLinkQuery;

  private _id!: number;

  @Input()
  set id(id: string) {
    this._id = Number(id);
    this.query = {
      categoryIds: [this._id]
    }
    this.catService.currentCategoryId = this._id;
  }

  constructor(private catService: CategoryService) { }
  
  public get category(): LpCategory | undefined {
    return this.catService.currentCategory;
  }

}
