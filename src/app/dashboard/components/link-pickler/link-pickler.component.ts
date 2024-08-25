import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LinkService } from '../../../services/link.service';
import { SqueezeboxComponent } from '../../../pickle-ui/squeezebox/squeezebox.component';

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
  imports: [ReactiveFormsModule, SqueezeboxComponent],
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

  constructor(private fb: FormBuilder, linkService: LinkService) { }

  public save() { }

}
