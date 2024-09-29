import { Component, effect, input } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faToggleOff,
  faToggleOn,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-toggle',
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.scss',
})
export class ToggleComponent {
  public controlName = input.required<string>();
  public label = input.required<string>();
  public value!: boolean;

  public icons = input({
    on: faToggleOn,
    off: faToggleOff,
  });

  constructor(private container: ControlContainer) {
    effect(() => {
      this.value = this.control?.value;
    });
  }

  public get formGroup() {
    return this.container.control as FormGroup;
  }

  public get icon(): IconDefinition {
    return this.value ? this.icons().on : this.icons().off;
  }

  private get control() {
    return this.formGroup.get(this.controlName());
  }

  public toggle(): void {
    this.value = !this.value;
    this.control?.setValue(this.value);
  }
}
