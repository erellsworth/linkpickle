import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { LpCategory } from '../../../../../api/interfaces/category';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent{

  constructor(private categoryService: CategoryService) { }

  public get categories(): LpCategory[] {
    return this.categoryService.categories().filter(cat => Boolean(cat.id));
  }
}
