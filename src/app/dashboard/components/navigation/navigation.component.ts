import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { LpCategory } from '../../../../../api/interfaces/category';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHome, faJar, faThumbTack } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [FontAwesomeModule, RouterLink, RouterLinkActive],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  public icons = {
    home: faHome,
    jar: faJar,
    pinned: faThumbTack,
  };

  constructor(private categoryService: CategoryService) {}

  public get categories(): LpCategory[] {
    return this.categoryService.categories().filter((cat) => Boolean(cat.id));
  }
}
