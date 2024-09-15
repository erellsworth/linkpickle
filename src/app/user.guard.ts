import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from './services/user.service';

export const userGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);
  if (!userService.isLoggedIn) {
    router.navigate(['user/login']);
    return false;
  }

  return true;
};
