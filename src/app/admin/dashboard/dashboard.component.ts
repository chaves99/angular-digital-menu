import { Component, inject, OnInit } from '@angular/core';
import { isFreeTierActive, openMenu } from '../../core';
import { StorageService, SubscriptionService } from '../../services';
import { SubscriptionResponse } from '../../services/payload';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    DatePipe
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

  private readonly subscriptionService = inject(SubscriptionService);
  private readonly storageService = inject(StorageService);
  private readonly router = inject(Router);

  isFreeTierActive = false;

  public subscription: SubscriptionResponse | null = null;

  ngOnInit(): void {
    this.subscriptionService.get().subscribe({
      next: sub => {
        this.subscription = sub;
        this.isFreeTierActive = isFreeTierActive(this.subscription);
      },
      error: () => {
      }
    });
  }

  onGoToMenu() {
    const user = this.storageService.getUser();
    if (user !== null) {
      openMenu(user.establishmentUrl, this.router);
    }
  }
}
