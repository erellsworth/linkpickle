import { Component, OnInit } from '@angular/core';
import { PageComponent } from '../../pickle-ui/page/page.component';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { LoginForm } from '../login/login.component';
import { UserService } from '../../services/user.service';
import { ToasterService } from '../../services/toaster.service';
import { Router } from '@angular/router';

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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toaster: ToasterService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      email: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.email]),
      password: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16)]),
      confirmPassword: this.fb.nonNullable.control('', [
        Validators.required,
        this.checkPasswordMatch
        // TODO: add password strength meter
      ])
    });
  }

  public async register(): Promise<void> {
    const { email, password, confirmPassword } = this.formGroup.value;
    const credentials = { email, password, confirmPassword } as { email: string, password: string, confirmPassword: string };

    const result = await this.userService.register(credentials);

    if (result.success) {
      this.toaster.add({
        title: 'Success',
        message: 'Registration Successful',
        severity: 'success'
      });
      this.router.navigate(['login']);
    } else {
      this.toaster.add({
        title: 'Registration failed!',
        message: result.error?.message as string,
        severity: 'error'
      });
    }
  }

  private checkPasswordMatch(group: FormGroup<RegisterForm>): ValidationErrors | null {
    let pass = group.parent?.get('password')?.value;
    let confirmPass = group.parent?.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true }
  }
}
