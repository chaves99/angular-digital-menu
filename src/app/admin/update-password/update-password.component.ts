import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SnackBarService, SpinnerComponent } from '../../core';
import { UserService } from '../../services';
import { HttpErrorResponse } from '@angular/common/http';
import { ERROR_MESSAGES, ErrorDetailResponse } from '../../services/payload';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-update-password',
  imports: [
    ReactiveFormsModule,
    SpinnerComponent,
    NgClass
  ],
  templateUrl: './update-password.component.html'
})
export class UpdatePasswordComponent {

  private readonly userService = inject(UserService);
  private readonly snackBarService = inject(SnackBarService);

  formGroup = new FormGroup({
    currentPassword: new FormControl(''),
    newPassword: new FormControl(''),
    confirmNewPassword: new FormControl('')
  });

  isInvalidPassword = false;

  isLoading = false;

  public onSubmit() {
    this.isInvalidPassword = false;
    const { currentPassword, newPassword, confirmNewPassword } = this.formGroup.value;
    if (currentPassword && newPassword && confirmNewPassword) {
      if (newPassword !== confirmNewPassword) {
        return;
      }

      this.isLoading = true;
      this.userService.updatePassword(currentPassword, newPassword).subscribe({
        next: res => {
          this.snackBarService.openSuccess("Senha atualizada!");
          this.isLoading = false;
          this.formGroup.reset();
        },
        error: res => {
          if (res instanceof HttpErrorResponse) {
            const errorDetail: ErrorDetailResponse = res.error;
            if (errorDetail.message !== null)
              this.snackBarService.openError(ERROR_MESSAGES[errorDetail.message]);
            this.isInvalidPassword = true;
          } else {
            this.snackBarService.openError("Error ao atualizar senha!");
          }
          this.isLoading = false;
        }
      });
    }
  }

}
