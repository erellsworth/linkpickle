import { Component, Input } from '@angular/core';

type InputType = 'text' | 'textarea' | 'password';

@Component({
  selector: 'pickle-text-input',
  standalone: true,
  imports: [],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss'
})
export class TextInputComponent {

  private _id: string = '';
  private _type: InputType = 'text';

  @Input()
  get id(): string {
    return this._id || `${this.type}_input`;
  }
  set id(id: string) {
    this._id = id;
  }

  @Input()
  get type() {
    return this._type;
  }
  set type(type: InputType) {
    this._type = type;
  }
}
