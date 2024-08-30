import { Component, Input, OnInit } from '@angular/core';
import { LinkService } from '../../services/link.service';
import { LpLink } from '../../../../api/interfaces/link';
import { CategoryService } from '../../services/category.service';
import { LpCategory } from '../../../../api/interfaces/category';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {

  public links: LpLink[] = [];
  public page = 1;

  private _id!: number;

  @Input()
  set id(id: number) {
    this._id = id;
  }

  constructor(private catService: CategoryService, private linkService: LinkService) { }
  
  async ngOnInit(): Promise<void> {
    const result = await this.linkService.getLinksByCategoryId(this._id, this.page);
    this.links = result.contents;
  }

  public get category(): LpCategory | undefined {
    return this.catService.getCategoryById(this._id);
  }

}
