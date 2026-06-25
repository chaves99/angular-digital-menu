import { Component, inject } from '@angular/core';
import { CreateUserResponse } from '../../../services/payload';
import { StorageService } from '../../../services';
import { CurrencyPipe } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Router, RouterLink } from '@angular/router';
import { SnackBarService } from '../snackbar/snackbar.service';
import { AvailablePlans, SubscriptionService } from '@features/subscription';

@Component({
  selector: 'app-plans-list',
  imports: [CurrencyPipe, SpinnerComponent, RouterLink],
  templateUrl: './plans-list.component.html',
})
export class PlansListComponent {

  private readonly router = inject(Router);
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly storageService = inject(StorageService);
  private readonly snackbarService = inject(SnackBarService);

  availablePlans: AvailablePlans[] = [];

  user: CreateUserResponse | null = null;

  screenPhase: 'LOADING' | 'ERROR' | 'DONE' = 'LOADING';
  isPlanButtonLoading = false;

  ngOnInit(): void {
    this.user = this.storageService.getUser();
    this.onLoadPlans();
  }

  onLoadPlans(): void {
    this.screenPhase = 'LOADING';
    this.subscriptionService.getAvailablePlans().subscribe({
      next: p => {
        this.screenPhase = 'DONE';
        this.availablePlans = p;
      },
      error: () => {
        this.screenPhase = 'ERROR';
      }
    });
  }

  getPeriodText(plan: AvailablePlans): string {
    switch (plan.recurringInterval) {
      case 'DAY': return "Dia";
      case 'WEEK': return "Semana";
      case 'MONTH': return "Mês";
      case 'YEAR': return "Ano";
    }
  }

  private openPlanPayment(priceId: string): void {
    this.isPlanButtonLoading = true;
    this.subscriptionService.getPlanUrl(priceId).subscribe({
      next: s => {
        this.isPlanButtonLoading = false;
        window.location.assign(s);
      },
      error: () => {
        this.isPlanButtonLoading = false;
        this.snackbarService.openError("Erro ao abrir assinatura! Tente mais tarde ou entre em contato com o suporte.");
      }
    });
  }

  public onAssign(planId: string): void {
    if (this.user === null) {
      this.router.navigateByUrl("/login", {
        state: {
          subscription: true
        }
      });
      return;
    }
    this.openPlanPayment(planId);
  }
}
