import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';

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

  constructor(private fb: FormBuilder, private userService: UserService) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      email: this.fb.nonNullable.control('', Validators.required),
      password: this.fb.nonNullable.control('', Validators.required)
    })
  }

  async login(): Promise<void> {
    console.log('login', this.formGroup.value);
  }
}
