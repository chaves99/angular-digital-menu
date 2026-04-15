import { NgClass } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Navigation, Router, RouterLink } from '@angular/router';
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

  private readonly userService = inject(UserService);
  private readonly storageService = inject(StorageService);
  private readonly router = inject(Router);
  private readonly themeService = inject(ThemeService);

  isLoading = false;

  invalidEmail = false;

  public isDark = computed<boolean>(() => {
    return this.themeService.themeSignal() === 'dark';
  });

  public showError = false;

  private goToSubscription = false;

  validatingClasses: Record<string, boolean> = {};

  formGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor() {
    const navigation: Navigation | null = this.router.currentNavigation();
    if (navigation !== null && navigation.extras.state) {
      const state: any = navigation.extras.state;
      if (state.subscription) {
        this.goToSubscription = true;
      }
    }
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
              if(this.goToSubscription) {
                this.router.navigate(['/admin/subscription']);
              } else {
                this.router.navigate(['/admin']);
              }
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
