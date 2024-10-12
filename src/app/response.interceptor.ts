import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { UserService } from './services/user.service';
import { ApiResponse } from '../../api/interfaces/api';

export const responseInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);

  return next(req).pipe(
    tap((event) => {
      if (event.type !== HttpEventType.Response) {
        return;
      }
      const { user } = event.body as ApiResponse;
      if (user) {
        userService.refresh(user);
      }
    }),
  );
};
