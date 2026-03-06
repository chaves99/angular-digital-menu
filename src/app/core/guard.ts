import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CreateUserResponse } from '../services/payload';
import { StorageService } from '../services/storage.service';


export const authGuard: CanActivateFn = (route, state) => {
  const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  if (!isBrowser) {
    return true;
  }

  const storageService = inject(StorageService);
  const router = inject(Router);
  const user: CreateUserResponse | null = storageService.getUser();
  if (user !== null) {
    return true;
  }
  return router.createUrlTree(['login']);
};

export const loggedUserGuard: CanActivateFn = (route, state) => {
  const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  if (!isBrowser) return true;

  const user: CreateUserResponse | null = inject(StorageService).getUser();
  if (user === null)
    return true;

  return inject(Router).createUrlTree(['admin']);
}
