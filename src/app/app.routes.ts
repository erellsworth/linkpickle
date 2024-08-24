import { Routes } from '@angular/router';
import { userGuard } from './user.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { RecoverComponent } from './auth/recover/recover.component';

export const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        canActivate: [userGuard]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'recover',
        component: RecoverComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    }
];
