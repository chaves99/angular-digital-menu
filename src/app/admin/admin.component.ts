import { isPlatformBrowser, NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { isFreeTierActive, ModalDialogService, ThemeService } from '../core';
import { SubscriptionService, UserService } from '../services';
import { CreateUserResponse, SubscriptionResponse } from '../services/payload';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-admin',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    NgClass,
  ],
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {

  private readonly userService = inject(UserService);
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly storageService = inject(StorageService);
  private readonly router = inject(Router);
  private readonly themeService = inject(ThemeService);
  private readonly dialogService = inject(ModalDialogService);
  private readonly platformId = inject(PLATFORM_ID);

  isDarkTheme = false;

  menuItemClass = "border-0 border-bottom list-group-item py-3 px-3 list-group-item-action";

  isFreeTierActive = false;

  public user: CreateUserResponse | null = null;
  public subscription: SubscriptionResponse | null = null;

  ngOnInit(): void {
    this.themeService.setup();
    this.isDarkTheme = this.themeService.getTheme() === 'dark';

    if (isPlatformBrowser(this.platformId)) {
      this.userService.check().subscribe({
        next: (u) => {
          this.user = u;
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

      this.subscriptionService.get().subscribe({
        next: sub => {
          this.subscription = sub;
          this.isFreeTierActive = isFreeTierActive(this.subscription);
        },
        error: () => {
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
