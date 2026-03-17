import { DatePipe, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SnackBarService, SpinnerComponent } from '../../core';
import { StorageService, SubscriptionService } from '../../services';
import { CreateUserResponse, SubscriptionResponse } from '../../services/payload';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-subscription',
  imports: [NgClass, DatePipe, SpinnerComponent],
  templateUrl: './subscription.component.html'
})
export class SubscriptionComponent implements OnInit {

  private readonly subscriptionService = inject(SubscriptionService);
  private readonly snackbarService = inject(SnackBarService);
  private readonly storageService = inject(StorageService);

  user!: CreateUserResponse | null;

  stripeUrl = environment.stripe_payment_plan_url;

  subscriptions: SubscriptionResponse[] = [];

  isLoading = false;

  ngOnInit(): void {
    this.user = this.storageService.getUser();
    this.isLoading = true;
    this.subscriptionService.get().subscribe({
      next: s => {
        console.log(s);
        this.subscriptions = s;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false }
    });
  }

  onCancel(id: string): void {
    if (this.subscriptions !== null) {
      this.isLoading = true;
      this.subscriptionService.cancel(id).subscribe({
        next: s => {
          this.isLoading = false;
          this.subscriptions = s;
        },
        error: () => {
          this.isLoading = false;
          this.snackbarService.openError("Erro ao cancelar assinatura! Tente mais tarde ou entre em contato com o suporte.");
        }
      });
    }
  }

  showBuyButton(): boolean {
    const nonFreeActiveSubs = this.subscriptions.filter(s => !s.freeTier && s.status === 'ACTIVE');
    return nonFreeActiveSubs.length === 0;
  }
}
