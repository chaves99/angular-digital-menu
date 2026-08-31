import { NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SnackBarService, ThemeService } from 'app/core';
import { UserService } from '../../services';
import { ERROR_MESSAGES, ErrorDetailResponse } from '../../services/payload';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    NgClass,
    RouterLink
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent {

  private readonly userService = inject(UserService);
  private readonly snackbarService = inject(SnackBarService);
  private readonly storageService = inject(StorageService);
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);
  public errorMessage: string | null = null;
  public termsOfServiceError = false;

  themeSignal = this.themeService.themeSignal;

  public isLoading = false;

  formGroup = new FormGroup({
    email: new FormControl('', Validators.email),
    password: new FormControl(),
    establishmentName: new FormControl(),
  });

  public isDark = computed<boolean>(() => {
    return this.themeService.themeSignal() === 'dark';
  });

  public onSubmit(): void {
    this.errorMessage = null;
    this.termsOfServiceError = false;
    const { email, password, establishmentName } = this.formGroup.value;

    if (email && password && establishmentName) {
      this.isLoading = true;
      this.userService.register(
        {
          email: email,
          password: password,
          establishmentName: establishmentName
        })
        .subscribe({
          next: response => {
            this.storageService.storeUser(response);
            this.router.navigateByUrl('admin');
            this.isLoading = false;
          },
          error: response => {
            this.isLoading = false;
            if (response instanceof HttpErrorResponse) {
              const errorDetail: ErrorDetailResponse = response.error;
              if (errorDetail.message !== null)
                this.errorMessage = ERROR_MESSAGES[errorDetail.message];
            }
          }
        });
    } else {
      this.snackbarService.openError("Preencha todos os campos!");
    }
  }

}
