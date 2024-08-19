import { Routes } from '@angular/router';
import { LinksComponent } from './dashboard/links/links.component';
import { userGuard } from './user.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        canActivate: [userGuard]
    },
    {
        path: 'login',
        component: LoginComponent
    }
];
