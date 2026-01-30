import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CreateUserResponse } from '../services/payload';
import { StorageService } from '../services/storage.service';
import { ThemeService } from '../core';
import { UserService } from '../services';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FormsModule
  ],
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {

  private userService = inject(UserService);
  private storageService = inject(StorageService);
  private router = inject(Router);
  private themeService = inject(ThemeService);

  isDarkTheme = false;

  public user: CreateUserResponse | null = null;

  ngOnInit(): void {
    this.themeService.setup();
    this.isDarkTheme = this.themeService.getTheme() === 'dark';

    this.userService.check().subscribe({
      next: res => {
        this.themeService.setup();
        this.user = this.storageService.getUser();
      },
      error: res => {
        if(res instanceof HttpErrorResponse && res.status == 401) {
          this.logout();
        }
      }
    });
  }

  public logout(): void {
    this.storageService.cleanUser();
    this.router.navigate(["/login"])
  }

  public toggleTheme() {
    this.themeService.toggleTheme();
  }

  public goToMenu() {
    if (this.user === null) return;

    const url = this.router.serializeUrl(this.router.createUrlTree(['customer-menu', this.user.establishmentName]));
    window.open(url, '_blank');
  }

  onThemeChange(): void {
    this.themeService.toggleTheme();
    this.isDarkTheme = this.themeService.getTheme() === 'dark';
  }
  // public isDarkTheme(): boolean {
  //   return this.themeService.getTheme() === "dark";
  // }
}
