import { NgClass } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ModalDialogService, ThemeService } from '../../core';
import { StorageService, UserService } from '../../services';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    NgClass,
    RouterLink
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {

  private readonly userService = inject(UserService);
  private readonly storageService = inject(StorageService);
  private readonly router = inject(Router);
  private readonly themeService = inject(ThemeService);
  private readonly modalService = inject(ModalDialogService);

  isLoading = false;

  invalidEmail = false;

  public isDark = computed<boolean>(() => {
    return this.themeService.themeSignal() === 'dark';
  });

  public showError = false;

  validatingClasses: Record<string, boolean> = {};

  formGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor() {
  }

  public onSubmit(): void {
    this.invalidEmail = this.formGroup.controls.email.errors !== null;
    this.showError = false;
    if (this.formGroup.valid) {
      const { email, password } = this.formGroup.value;
      if (email && password) {
        this.isLoading = true;
        this.userService
          .login({ email: email, password: password })
          .subscribe({
            next: response => {
              this.storageService.storeUser(response);
              this.router.navigate(['/admin']);
              this.isLoading = false;
            },
            error: () => {
              this.showError = true;
              this.isLoading = false;
            }
          });
      }
    }
  }

}
