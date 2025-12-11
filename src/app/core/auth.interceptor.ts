import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { CreateUserResponse } from '../services/payload';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);
  const user: CreateUserResponse | null = storageService.getUser();
  if (user !== null) {
    return next(
      req.clone({
        headers: req.headers.set("x-mo-token", user.token)
      })
    );
  }

  return next(req);
};
