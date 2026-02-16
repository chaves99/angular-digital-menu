import { NgClass } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ThemeService } from '../../core';
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

  private userService = inject(UserService);
  private storageService = inject(StorageService);
  private router = inject(Router);
  private themeService = inject(ThemeService);

  isLoading = false;

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
