
import { ErrorHandler, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackBarService } from './components/snackbar/snackbar.service';

export class GlobalErrorHandler implements ErrorHandler {

  private readonly router = inject(Router);
  private readonly storageService = inject(StorageService);
  private readonly snackBarService = inject(SnackBarService);

  handleError(error: any) {
    console.log(error);

    if (error instanceof HttpErrorResponse && (error.status == 401 || error.status == 0)) {
      this.storageService.cleanUser();
      this.snackBarService.openError("Erro ao conectar no servidor");
      this.router.navigate(["/login"]);
    }
  }
}
