import { Routes } from '@angular/router';
import { userGuard } from './user.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { RecoverComponent } from './auth/recover/recover.component';
import { LinksComponent } from './dashboard/links/links.component';
import { CategoryComponent } from './dashboard/category/category.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivateChild: [userGuard],
    children: [
      {
        path: '',
        component: LinksComponent,
      },
      {
        path: ':page',
        component: LinksComponent,
      },
      {
        path: 'category/:id',
        component: CategoryComponent,
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'recover',
    component: RecoverComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
];
