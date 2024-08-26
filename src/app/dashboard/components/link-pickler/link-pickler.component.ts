import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LinkService } from '../../../services/link.service';
import { SqueezeboxComponent } from '../../../pickle-ui/squeezebox/squeezebox.component';
import { LpLink, LpLinkPreview } from '../../../../../api/interfaces/link';
import { LinkCardComponent } from '../../links/link-card/link-card.component';
import { LoadingIndicatorComponent } from '../../../pickle-ui/loading-indicator/loading-indicator.component';

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

  public loading = false;

  private _preview!: {
    preview: LpLinkPreview;
    siteName: string
  };

  constructor(private fb: FormBuilder, private linkService: LinkService) { }

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
    const url = event.clipboardData?.getData('text');

    const linkPreview = await this.linkService.getLinkPreview(url);

    if (linkPreview) {
      this._preview = linkPreview;
      this.setPreview(url as string, linkPreview.preview);      
    }

  }

  public save() { }

  private setPreview(url: string, preview: LpLinkPreview): void {
    this.formGroup.get('url')?.setValue(url);

    if (!this.formGroup.value.title) {
      this.formGroup.get('title')?.setValue(preview.title);
    }

    if (preview.description && !this.formGroup.value.description) {
      this.formGroup.get('description')?.setValue(preview.description);
    }

  }
  

}
