import { Component, effect, Input, OnInit, viewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LinkService } from '../../../services/link.service';
import { SqueezeboxComponent } from '../../../pickle-ui/squeezebox/squeezebox.component';
import { LpLink, LpLinkPreview } from '../../../../../api/interfaces/link';
import { LinkCardComponent } from '../../links/link-card/link-card.component';
import { LoadingIndicatorComponent } from '../../../pickle-ui/loading-indicator/loading-indicator.component';
import { ToasterService } from '../../../services/toaster.service';
import { CategorySelectorComponent } from './category-selector/category-selector.component';
import { LpCategory } from '../../../../../api/interfaces/category';
import { CategoryService } from '../../../services/category.service';
import { LpLinkQuery } from '../../../../../api/interfaces/query';
import { JsonPipe } from '@angular/common';
import { ModalService } from '../../../services/modal.service';
import { ToggleComponent } from '../../../pickle-ui/forms/toggle/toggle.component';

interface LinkForm {
  url: FormControl<string>;
  title: FormControl<string>;
  description: FormControl<string | undefined>;
  categories: FormControl<LpCategory[]>;
  pinned: FormControl<boolean>;
}

@Component({
  selector: 'app-link-pickler',
  standalone: true,
  imports: [
    CategorySelectorComponent,
    LinkCardComponent,
    LoadingIndicatorComponent,
    ReactiveFormsModule,
    SqueezeboxComponent,
    ToggleComponent,
  ],
  templateUrl: './link-pickler.component.html',
  styleUrl: './link-pickler.component.scss',
})
export class LinkPicklerComponent implements OnInit {
  @Input() link!: LpLink;

  public squeezebox = viewChild<SqueezeboxComponent>('squeezebox');
  public categorySelector =
    viewChild<CategorySelectorComponent>('categorySelector');

  public formGroup!: FormGroup<LinkForm>;

  public loadingPreview = false;

  private _preview:
    | {
        preview: LpLinkPreview;
        siteName: string;
      }
    | undefined;

  constructor(
    private fb: FormBuilder,
    private linkService: LinkService,
    private modalService: ModalService,
    private toaster: ToasterService,
  ) {
    effect(() => {
      if (this.link) {
        this.squeezebox()?.toggle(false);
      }
    });
  }

  ngOnInit(): void {
    this.buildFormGroup();
  }

  public get buttonLabel(): string {
    return Boolean(this.link?.id) ? 'Re-pickle it!' : 'Pickle it!';
  }

  public get linkPreview(): LpLink | false {
    if (this._preview) {
      return {
        ...this._preview.preview,
        ...{
          Site: {
            name: this._preview.siteName,
          },
        },
      } as LpLink;
    }
    return false;
  }

  public updateCategories(categories: LpCategory[]): void {
    this.formGroup.get('categories')?.setValue(categories);
  }

  public async paste(event: ClipboardEvent): Promise<void> {
    this.loadingPreview = true;
    const url = event.clipboardData?.getData('text');

    const linkPreview = await this.linkService.getLinkPreview(url);

    if (typeof linkPreview === 'string') {
      this.toaster.add({
        title: 'Error',
        message: linkPreview,
        severity: 'error',
      });
      this.formGroup.reset();
    } else {
      this._preview = linkPreview;
      this.setPreview(url as string, linkPreview.preview);
    }

    this.loadingPreview = false;
  }

  public async save(): Promise<void> {
    let link = this.formGroup.value as unknown as LpLink;
    let message: string;
    const categories = this.formGroup.value.categories;

    let result: string | LpLink;

    if (this.link) {
      message = 'Link Updated';
      link = { ...this.link, ...link };
      result = await this.linkService.updateLink(link, categories);
    } else {
      message = 'Link Created';
      result = await this.linkService.createLink(link, categories);
    }

    if (typeof result === 'string') {
      this.toaster.add({
        title: 'Error',
        message: result,
        severity: 'error',
      });
    } else {
      this.formGroup.reset();
      this.categorySelector()?.reset();
      this.toaster.add({
        title: 'Success',
        message,
        severity: 'success',
      });
      this.modalService.close();
      this._preview = undefined;
    }
  }

  private buildFormGroup(): void {
    this.formGroup = this.fb.group({
      url: this.fb.nonNullable.control(
        this.link ? this.link.url : '',
        Validators.required,
      ),
      title: this.fb.nonNullable.control(
        this.link ? this.link.title : '',
        Validators.required,
      ),
      description: this.fb.nonNullable.control(
        this.link ? this.link.description : '',
      ),
      categories: this.fb.nonNullable.control(
        this.link && this.link.Categories
          ? this.link.Categories
          : ([] as LpCategory[]),
      ),
      pinned: this.fb.nonNullable.control(this.link ? this.link.pinned : false),
    });
  }

  private setPreview(url: string, preview: LpLinkPreview): void {
    this.formGroup.get('url')?.setValue(url);

    this.formGroup.get('title')?.setValue(preview.title || url);

    if (preview.description) {
      this.formGroup.get('description')?.setValue(preview.description);
    }
  }
}
