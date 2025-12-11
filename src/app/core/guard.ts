import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { CreateUserResponse } from '../services/payload';

export const authGuard: CanActivateFn = (route, state) => {
  const storageService = inject(StorageService);
  const router = inject(Router);
  const user: CreateUserResponse | null = storageService.getUser();
  if (user !== null) return true;
  return router.createUrlTree(['login']);
};

export const loggedUserGuard: CanActivateFn = (route, state) => {
  const storageService = inject(StorageService);
  const router = inject(Router);
  const user: CreateUserResponse | null = storageService.getUser();
  if (user === null)
    return true;
  return router.createUrlTree(['admin']);
}
