import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CreateUserResponse } from '../services/payload';
import { StorageService } from '../services/storage.service';
import { ThemeService } from '../core';
import { UserService } from '../services';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { QRCodeComponent } from 'angularx-qrcode';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [
    QRCodeComponent,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    NgClass
  ],
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {

  private userService = inject(UserService);
  private storageService = inject(StorageService);
  private router = inject(Router);
  private themeService = inject(ThemeService);

  isDarkTheme = false;

  menuItemClass = "border-0 rounded list-group-item p-2 list-group-item-action";

  public user: CreateUserResponse | null = null;

  ngOnInit(): void {
    this.themeService.setup();
    this.isDarkTheme = this.themeService.getTheme() === 'dark';

    this.userService.check().subscribe({
      next: res => {
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
}
