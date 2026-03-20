import { DatePipe, isPlatformBrowser, NgClass } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ModalDialogService, ThemeService } from '../core';
import { UserService } from '../services';
import { CreateUserResponse } from '../services/payload';
import { StorageService } from '../services/storage.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    NgClass,
    DatePipe
  ],
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {

  private userService = inject(UserService);
  private storageService = inject(StorageService);
  private router = inject(Router);
  private themeService = inject(ThemeService);
  private dialogService = inject(ModalDialogService);
  private readonly platformId = inject(PLATFORM_ID);

  isDarkTheme = false;

  menuItemClass = "border-0 rounded list-group-item p-2 list-group-item-action";

  isFreeTier = false;

  public user: CreateUserResponse | null = null;

  ngOnInit(): void {
    this.themeService.setup();
    this.isDarkTheme = this.themeService.getTheme() === 'dark';

    if (isPlatformBrowser(this.platformId)) {
      this.userService.check().subscribe({
        next: (u) => {
          this.user = u;
          this.isFreeTier = u.subscription === 'FREE_TIER';
          this.storageService.storeUser(u);
        },
        error: res => {
          if (res instanceof HttpErrorResponse && res.status == 401) {
            this.logout();
          }
          if (res instanceof HttpErrorResponse && res.status == 500) {
            this.dialogService.open({
              message: "Houve um problema ao conectar com o servidor!",
            });
          }
        }
      });
    }
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

    const url = this.router.serializeUrl(this.router.createUrlTree(['customer-menu', this.user.establishmentUrl]));
    window.open(url, '_blank');
  }

  onThemeChange(): void {
    this.themeService.toggleTheme();
    this.isDarkTheme = this.themeService.getTheme() === 'dark';
  }
}
