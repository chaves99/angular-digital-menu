import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { CreateUserResponse } from '../services/payload';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);
  const router = inject(Router);
  const user: CreateUserResponse | null = storageService.getUser();
  if (user !== null) {
    return next(
      req.clone({
        headers: req.headers.set("x-mo-token", user.token)
      })
    );
  }

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        storageService.cleanUser();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};
