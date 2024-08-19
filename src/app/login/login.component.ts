import { Component } from '@angular/core';
import { ButtonComponent } from '../pickle-ui/button/button.component';
import { TextInputComponent } from '../pickle-ui/text-input/text-input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonComponent, TextInputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

}
