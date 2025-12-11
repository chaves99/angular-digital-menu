import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ERROR_MESSAGES, ErrorDetailResponse } from '../../services/payload';
import { StorageService } from '../../services/storage.service';
import { UserService } from '../../services';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent {

  private userService = inject(UserService);
  private storageService = inject(StorageService);
  private router = inject(Router);
  public errorMessage: string | null = null;

  formGroup = new FormGroup({
    email: new FormControl('', Validators.email),
    password: new FormControl(),
    establishmentName: new FormControl(),
  });

  public onSubmit(): void {
    this.errorMessage = null;
    const { email, password, establishmentName } = this.formGroup.value;
    if (email && password && establishmentName) {
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
          },
          error: response => {
            if (response instanceof HttpErrorResponse) {
              const errorDetail: ErrorDetailResponse = response.error;
              console.log(ERROR_MESSAGES[errorDetail.message]);
              this.errorMessage = ERROR_MESSAGES[errorDetail.message];
            }
          }
        });
    }

  }

}
