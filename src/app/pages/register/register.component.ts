import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ERROR_MESSAGES, ErrorDetailResponse } from '../../services/payload';
import { StorageService } from '../../services/storage.service';
import { UserService } from '../../services';
import { NgClass } from '@angular/common';
import { SnackBarService } from 'app/core';

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

  private userService = inject(UserService);
  private readonly snackbarService = inject(SnackBarService);
  private storageService = inject(StorageService);
  private router = inject(Router);
  public errorMessage: string | null = null;

  public isLoading = false;

  formGroup = new FormGroup({
    email: new FormControl('', Validators.email),
    password: new FormControl(),
    establishmentName: new FormControl(),
    termsAndPrivaceAcceptance: new FormControl(false)
  });

  public onSubmit(): void {
    this.errorMessage = null;
    const { email, password, establishmentName, termsAndPrivaceAcceptance } = this.formGroup.value;

    if (!termsAndPrivaceAcceptance) {
      this.snackbarService.open("Você precisa aceitar os termos de serviço!");
      return;
    }


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
