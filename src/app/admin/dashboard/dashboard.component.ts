import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { isFreeTierActive, openMenu } from '../../core';
import { DashboardService, StorageService, SubscriptionService } from '../../services';
import { DashboardResponse, SubscriptionResponse } from '../../services/payload';

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
  private readonly dashboardService = inject(DashboardService);
  private readonly router = inject(Router);

  isFreeTierActive = false;
  isDashboardLoading = false;

  subscription: SubscriptionResponse | null = null;
  dashboardData: DashboardResponse | null = null;


  ngOnInit(): void {
    this.subscriptionService.get().subscribe({
      next: sub => {
        this.subscription = sub;
        this.isFreeTierActive = isFreeTierActive(this.subscription);
      },
      error: () => {
      }
    });

    this.isDashboardLoading = true;
    this.dashboardService.get().subscribe({
      next: res => {
        this.isDashboardLoading = false;
        this.dashboardData = res;
      },
      error: () => {
        this.isDashboardLoading = false;
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
