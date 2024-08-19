import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from './services/user.service';

export const userGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);

  const token = userService.user().Token;

  if (!token || !token.token) {
    router.navigate(['login']);
    return false;
  }

  return true;
};
