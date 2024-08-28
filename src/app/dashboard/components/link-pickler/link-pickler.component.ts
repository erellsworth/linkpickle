import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LinkService } from '../../../services/link.service';
import { SqueezeboxComponent } from '../../../pickle-ui/squeezebox/squeezebox.component';
import { LpLink, LpLinkPreview } from '../../../../../api/interfaces/link';
import { LinkCardComponent } from '../../links/link-card/link-card.component';
import { LoadingIndicatorComponent } from '../../../pickle-ui/loading-indicator/loading-indicator.component';
import { ToasterService } from '../../../services/toaster.service';
import { CategorySelectorComponent } from './category-selector/category-selector.component';

interface LinkForm {
  url: FormControl<string>;
  title: FormControl<string>;
  description: FormControl<string>;
  categoryIds: FormControl<number[]>;
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
    SqueezeboxComponent],
  templateUrl: './link-pickler.component.html',
  styleUrl: './link-pickler.component.scss'
})
export class LinkPicklerComponent {

  @ViewChild('squeezebox') squeezebox!: SqueezeboxComponent;

  public formGroup: FormGroup<LinkForm> = this.fb.group({
    url: this.fb.nonNullable.control('', Validators.required),
    title: this.fb.nonNullable.control('', Validators.required),
    description: this.fb.nonNullable.control(''),
    categoryIds: this.fb.nonNullable.control([] as number[]),
    pinned: this.fb.nonNullable.control(false)
  });

  public loadingPreview = false;

  private _preview: {
    preview: LpLinkPreview;
    siteName: string
  } | undefined;

  constructor(
    private fb: FormBuilder,
    private linkService: LinkService,
    private toaster: ToasterService) { }

  public get linkPreview(): LpLink | false {
    if (this._preview) {
      return {
        ...this._preview.preview,
        ...{
          Site: {
            name: this._preview.siteName
          }
        }
      } as LpLink;
     }
    return false;
  }

  public async paste(event: ClipboardEvent): Promise<void> {
    this.loadingPreview = true;
    const url = event.clipboardData?.getData('text');

    const linkPreview = await this.linkService.getLinkPreview(url);

    if (typeof linkPreview === 'string') {
      this.toaster.add({
        title: 'Error',
        message: linkPreview,
        severity: 'error'
      });
      this.formGroup.reset();
    } else {
      this._preview = linkPreview;
      this.setPreview(url as string, linkPreview.preview);   
    }

    this.loadingPreview = false;

  }

  public async save(): Promise<void> { 
    const link = this.formGroup.getRawValue() as unknown as LpLink;
    const result = await this.linkService.saveLink(link);

    if (typeof result === 'string') {
      this.toaster.add({
        title: 'Error',
        message: result,
        severity: 'error'
      });
    } else {
      this.formGroup.reset();
      this.toaster.add({
        title: 'Success',
        message: 'Link Saved',
        severity: 'success'
      });
      this._preview = undefined;
    }
  }

  private setPreview(url: string, preview: LpLinkPreview): void {
    this.formGroup.get('url')?.setValue(url);

    if (!this.formGroup.value.title) {
      this.formGroup.get('title')?.setValue(preview.title || url);
    }

    if (preview.description && !this.formGroup.value.description) {
      this.formGroup.get('description')?.setValue(preview.description);
    }

  }
  

}
