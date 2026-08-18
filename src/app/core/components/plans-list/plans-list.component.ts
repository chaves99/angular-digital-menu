import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AvailablePlans, PlanPriceOption, PriceRecurringInterval, SubscriptionService } from '@features/subscription';
import { StorageService } from '../../../services';
import { CreateUserResponse } from '../../../services/payload';
import { SnackBarService } from '../snackbar/snackbar.service';
import { SpinnerComponent } from '../spinner/spinner.component';

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

  plansRecurringState = signal<PriceRecurringInterval>('MONTH');

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

  getPeriodText(price: PlanPriceOption): string {
    switch (price.recurring) {
      case 'DAY': return "Dia";
      case 'WEEK': return "Semana";
      case 'MONTH': return "Mês";
      case 'YEAR': return "Ano";
    }
  }

  getPeriodTextTitle(price: PlanPriceOption): string {
    switch (price.recurring) {
      case 'DAY': return "Diário";
      case 'WEEK': return "Semanal";
      case 'MONTH': return "Mensal";
      case 'YEAR': return "Anual";
    }
  }

  private openPlanPayment(priceId: string): void {
    this.isPlanButtonLoading = true;
    this.subscriptionService.getPlanUrl(priceId).subscribe({
      next: s => {
        this.isPlanButtonLoading = false;
        window.open(s, "_blank");
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

  public onRadioButtonRecurringChange(type: PriceRecurringInterval) {
    this.plansRecurringState.set(type);
  }

  public hasDiscount(price: PlanPriceOption): boolean {
    return price.savingValue !== undefined;
  }

  public getCurrentPrice(plan: AvailablePlans): PlanPriceOption[] {
    return plan.priceOptions.filter(p => p.recurring === this.plansRecurringState());
  }
}
