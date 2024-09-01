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
  set id(id: number) {
    this._id = id;
    this.query = {
      categoryIds: [id]
    }
  }

  constructor(private catService: CategoryService) { }
  
  public get category(): LpCategory | undefined {
    return this.catService.getCategoryById(this._id);
  }

}
