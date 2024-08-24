import { Component, OnInit } from '@angular/core';
import { PageComponent } from '../../pickle-ui/page/page.component';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { LoginForm } from '../login/login.component';

interface RegisterForm extends LoginForm {
  confirmPassword: FormControl<string>;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [PageComponent, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  public formGroup!: FormGroup<RegisterForm>;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      email: this.fb.nonNullable.control('', Validators.required),
      password: this.fb.nonNullable.control('', Validators.required),
      confirmPassword: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
        this.checkPasswordMatch
        // TODO: add password strength meter
      ])
    });
  }

  public async register(): Promise<void> { }

  private checkPasswordMatch(group: FormGroup<RegisterForm>): ValidationErrors | null {
    let pass = group.parent?.get('password')?.value;
    let confirmPass = group.parent?.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true }
  }
}
