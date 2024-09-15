import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { UserService } from './services/user.service';
import { inject } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { Router } from '@angular/router';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);
  const router = inject(Router);

  console.log('intercept');
  let headers = {
    Authorization: 'Bearer ' + userService.token,
  };

  req = req.clone({
    setHeaders: headers,
  });

  return next(req).pipe(
    catchError((e) => {
      const error = e as HttpErrorResponse;
      if (error.status === 401) {
        userService.clearUser();
        router.navigate(['user/login']);
      }
      return of(e);
    })
  );
};
