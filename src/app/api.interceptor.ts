import { HttpInterceptorFn } from '@angular/common/http';
import { UserService } from './services/user.service';
import { inject } from '@angular/core';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);

  let headers = {
    Authorization: 'Bearer ' + userService.token
  };

  req = req.clone({
    setHeaders: headers
  });

  return next(req);
};
