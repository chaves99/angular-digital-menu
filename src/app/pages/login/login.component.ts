import { Component, computed, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService, UserService } from '../../services';
import { ThemeService } from '../../core';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {

  private userService = inject(UserService);
  private storageService = inject(StorageService);
  private router = inject(Router);
  private themeService = inject(ThemeService);

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
    console.log(this.isDark());
  }

  public onSubmit(): void {
    // this.isDark = this.themeService.getTheme() === "dark";
    this.showError = false;
    if (this.formGroup.valid) {
      const { email, password } = this.formGroup.value;
      if (email && password) {
        this.userService
          .login({ email: email, password: password })
          .subscribe({
            next: response => {
              this.storageService.storeUser(response);
              this.router.navigate(['/admin']);
            },
            error: () => this.showError = true,
          });
      }
    }
  }

}
