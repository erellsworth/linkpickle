import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ToasterService } from '../services/toaster.service';

export interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  public formGroup!: FormGroup<LoginForm>;

  constructor(private fb: FormBuilder, private toaster: ToasterService, private userService: UserService) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      email: this.fb.nonNullable.control('', Validators.required),
      password: this.fb.nonNullable.control('', Validators.required)
    })
  }

  async login(): Promise<void> {
    const { email, password } = this.formGroup.value;
    const credentials = { email, password } as { email: string, password: string };

    const result = await this.userService.login(credentials);

    console.log('result', result);

    if (result.success) {
      this.toaster.add({
        title: 'Success',
        message: 'Login Successful',
        severity: 'success'
      });
    } else {
      this.toaster.add({
        title: 'You Shall Not Pass!',
        message: result.error?.message as string,
        severity: 'error'
      });
    }
  }
}
