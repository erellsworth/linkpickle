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
export class CategorySelectorComponent implements OnInit {
  @Input() selecteCategories: LpCategory[] = [];
  @Output() selectionChanged = new EventEmitter<LpCategory[]>();

  public addIcon = faPlusCircle;
  public categories: LpCategory[] = [];
  public category!: string;
  public icons = {
    add: faPlusCircle,
    remove: faRemove
  };
  public tooltipMessage!: string;

  constructor(private categoryService: CategoryService) { }
  
  async ngOnInit(): Promise<void> {
    this.categories = await this.categoryService.getCategories();
  }

  public get showTooltip(): boolean {
  return Boolean(this.tooltipMessage);
  }

  public get suggestions(): LpCategory[] {
    if (!this.category) { return []; }
    return this.categories.map(cat => {
      return {
        ...cat,
        ...{ name: cat.name.toLowerCase() }
      }
    }).filter(cat => cat.name.includes(this.category.toLowerCase()));
      // .filter(cat => { 
      //   return !this.selecteCategories
      //     .map(cat => cat.name.toLowerCase())
      //     .includes(cat.name.toLowerCase());
      // });
  }

  public addNewCategory(): void {
    if (this.categories.map(cat => cat.name.toLowerCase()).includes(this.category.toLowerCase())) {
      this.tooltipMessage = "Category already exists!";
     }
    
    const newCat = this.categoryService.getTempCategory(this.category);
    this.categories.push(newCat)
    this.selecteCategories.push(newCat);
    this.category = '';
    this.selectionChanged.emit(this.selecteCategories);
  }

  public handelSelection(category: LpCategory): void {
    this.selecteCategories.push(category);
    this.selectionChanged.emit(this.selecteCategories);
  }

  public unselectCategory(category: LpCategory): void {
    this.selecteCategories = this.selecteCategories.filter(cat => cat.name !== category.name);
    this.selectionChanged.emit(this.selecteCategories);
  }
}
