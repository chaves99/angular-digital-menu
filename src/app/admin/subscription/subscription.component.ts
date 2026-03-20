import { DatePipe, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SnackBarService, SpinnerComponent } from '../../core';
import { StorageService, SubscriptionService } from '../../services';
import { CreateUserResponse, SubscriptionResponseItem } from '../../services/payload';

@Component({
  selector: 'app-subscription',
  imports: [DatePipe, NgClass, SpinnerComponent],
  templateUrl: './subscription.component.html'
})
export class SubscriptionComponent implements OnInit {

  private readonly subscriptionService = inject(SubscriptionService);
  private readonly snackbarService = inject(SnackBarService);
  private readonly storageService = inject(StorageService);

  user!: CreateUserResponse | null;

  activeSubscription: SubscriptionResponseItem | null = null;

  subscriptionsHistory: SubscriptionResponseItem[] = [];

  isLoading = false;

  isPlanButtonLoading = false;

  ngOnInit(): void {
    this.user = this.storageService.getUser();
    this.isLoading = true;
    this.subscriptionService.get().subscribe({
      next: s => {
        this.activeSubscription = s.active;
        this.subscriptionsHistory = s.history;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackbarService.openError("Erro ao carregar assinatura! Tente mais tarde ou entre em contato com o suporte.");
      }
    });
  }

  onCancel(id: string): void {
    if (this.subscriptionsHistory !== null) {
      this.isLoading = true;
      this.subscriptionService.cancel(id).subscribe({
        next: s => {
          this.isLoading = false;
          this.activeSubscription = s.active;
          this.subscriptionsHistory = s.history;
        },
        error: () => {
          this.isLoading = false;
          this.snackbarService.openError("Erro ao cancelar assinatura! Tente mais tarde ou entre em contato com o suporte.");
        }
      });
    }
  }

  onOpenPlanPayment() {
    this.isPlanButtonLoading = true;
    this.subscriptionService.getPlanUrl().subscribe({
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

  onChangePaymentMethod(id: string) {
    this.isLoading = true;
    this.subscriptionService.updatePaymentMethod(id).subscribe({
      next: url => {
        this.isLoading = false;
        window.location.assign(url);
      },
      error: () => {
        this.isLoading = false;
        this.snackbarService.openError("Erro ao cancelar assinatura! Tente mais tarde ou entre em contato com o suporte.");
      }
    })
  }

  showBuyButton(): boolean {
    return this.activeSubscription === null;
  }
}
