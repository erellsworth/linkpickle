import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { LpCategory } from '../../../../../../api/interfaces/category';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../../services/category.service';
import { faPlusCircle, faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TooltipComponent } from '../../../../pickle-ui/tooltip/tooltip.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-category-selector',
  standalone: true,
  imports: [FontAwesomeModule, FormsModule, TooltipComponent],
  templateUrl: './category-selector.component.html',
  styleUrl: './category-selector.component.scss',
})
export class CategorySelectorComponent implements OnInit, OnDestroy {
  @Output()
  selectionChanged = new EventEmitter<LpCategory[]>();

  public addIcon = faPlusCircle;
  public category = '';
  public icons = {
    add: faPlusCircle,
    remove: faRemove,
  };
  @Input() selectedCategories: LpCategory[] = [];
  public tooltipMessage = '';

  private _subs: Subscription[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    if (this.selectedCategories.length) {
      console.log('add');
    }

    this._subs.push(
      this.categoryService.currentCategory$.subscribe((cat) => {
        if (cat && !this.isSelected(cat)) {
          this.selectedCategories.push(cat);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this._subs.forEach((sub) => sub.unsubscribe());
  }

  public get categories() {
    return this.categoryService.categories();
  }

  public get showTooltip(): boolean {
    return Boolean(this.tooltipMessage);
  }

  public get suggestions(): LpCategory[] {
    if (!this.category) {
      return [];
    }
    return this.categories
      .filter((cat) =>
        cat.name.toLowerCase().includes(this.category.toLowerCase())
      )
      .filter((cat) => {
        return !this.selectedCategories
          .map((cat) => cat.name.toLowerCase())
          .includes(cat.name.toLowerCase());
      });
  }

  public addNewCategory(): void {
    if (
      this.categories
        .map((cat) => cat.name.toLowerCase())
        .includes(this.category.toLowerCase())
    ) {
      this.selectByName(this.category);
      return;
    }

    const newCat = this.categoryService.getTempCategory(this.category);
    this.selectedCategories.push(newCat);
    this.selectionChanged.emit(this.selectedCategories);
    this.category = '';
  }

  public handelSelection(category: LpCategory): void {
    this.selectedCategories.push(category);
    this.selectionChanged.emit(this.selectedCategories);
    this.category = '';
    this.tooltipMessage = '';
  }

  public unselectCategory(category: LpCategory): void {
    this.selectedCategories = this.selectedCategories.filter(
      (cat) => cat.name !== category.name
    );
    this.selectionChanged.emit(this.selectedCategories);
  }

  public reset(): void {
    this.selectedCategories = [];
    this.category = '';
    this.tooltipMessage = '';
    this.categoryService.loadCategories();
  }

  private isSelected(category: LpCategory): boolean {
    return this.selectedCategories.map((cat) => cat.id).includes(category.id);
  }

  private selectByName(name: string): void {
    const category = this.categories.find(
      (cat) => cat.name.toLowerCase() === name.toLowerCase()
    );

    if (
      this.selectedCategories
        .map((cat) => cat.name.toLowerCase())
        .includes(name.toLowerCase())
    ) {
      this.tooltipMessage = 'Category already selected';
      return;
    }

    if (category) {
      this.handelSelection(category);
    }
  }
}
