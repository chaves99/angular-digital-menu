
import { ErrorHandler, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { HttpErrorResponse } from '@angular/common/http';

export class GlobalErrorHandler implements ErrorHandler {

  private readonly router = inject(Router);
  private readonly storageService = inject(StorageService);

  handleError(error: any) {
    console.error("GlobalErrorHandler");

    if (error instanceof HttpErrorResponse && error.status == 401) {
      console.log("redirecting to login");
      this.storageService.cleanUser();
      this.router.navigate(["/login"]);
    }
  }
}
