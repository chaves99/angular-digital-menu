import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SnackBarService, SpinnerComponent } from '../../core';
import { UserService } from '../../services';

@Component({
  selector: 'app-update-password',
  imports: [
    ReactiveFormsModule,
    SpinnerComponent
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

  isLoading = false;

  // add loading
  public onSubmit() {
    const { currentPassword, newPassword, confirmNewPassword } = this.formGroup.value;

    if (currentPassword && newPassword && confirmNewPassword) {

      if (newPassword === confirmNewPassword) {
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
          this.snackBarService.openError("Error ao atualizar senha!");
          this.isLoading = false;
        }
      });
    }
  }

}
