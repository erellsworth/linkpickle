import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LpCategory } from '../../../../../../api/interfaces/category';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../../services/category.service';
import { faPlusCircle, faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TooltipComponent } from '../../../../pickle-ui/tooltip/tooltip.component';

@Component({
  selector: 'app-category-selector',
  standalone: true,
  imports: [FontAwesomeModule, FormsModule, TooltipComponent],
  templateUrl: './category-selector.component.html',
  styleUrl: './category-selector.component.scss'
})
export class CategorySelectorComponent {
  @Input() selecteCategories: LpCategory[] = [];
  @Output() selectionChanged = new EventEmitter<LpCategory[]>();

  public addIcon = faPlusCircle;
  public category = '';
  public icons = {
    add: faPlusCircle,
    remove: faRemove
  };
  public tooltipMessage = '';

  constructor(private categoryService: CategoryService) { }
  
  public get categories() {
    return this.categoryService.categories();
  }

  public get showTooltip(): boolean {
  return Boolean(this.tooltipMessage);
  }

  public get suggestions(): LpCategory[] {
    if (!this.category) { return []; }
    return this.categories
      .filter(cat => cat.name.toLowerCase().includes(this.category.toLowerCase()))
      .filter(cat => { 
        return !this.selecteCategories
          .map(cat => cat.name.toLowerCase())
          .includes(cat.name.toLowerCase());
      });
  }

  public addNewCategory(): void {
    if (this.categories.map(cat => cat.name.toLowerCase()).includes(this.category.toLowerCase())) {
      this.selectByName(this.category);
      return;
    }

    const newCat = this.categoryService.getTempCategory(this.category);
    this.categories.push(newCat);
    this.selecteCategories.push(newCat);
    this.selectionChanged.emit(this.selecteCategories);
    this.category = '';
  }

  public handelSelection(category: LpCategory): void {
    this.selecteCategories.push(category);
    this.selectionChanged.emit(this.selecteCategories);
    this.category = '';
    this.tooltipMessage = '';
  }

  public unselectCategory(category: LpCategory): void {
    this.selecteCategories = this.selecteCategories.filter(cat => cat.name !== category.name);
    this.selectionChanged.emit(this.selecteCategories);
  }

  public reset(): void {
    this.selecteCategories = [];
    this.category = '';
    this.tooltipMessage = '';
    this.categoryService.loadCategories();
  }

  private selectByName(name: string): void {
    const category = this.categories.find(cat => cat.name.toLowerCase() === name.toLowerCase());

    if (this.selecteCategories.map(cat => cat.name.toLowerCase()).includes(name.toLowerCase())) {
      this.tooltipMessage = "Category already selected";
      return;
    }
    
    if (category) {
      this.handelSelection(category);
    }
  }
}
