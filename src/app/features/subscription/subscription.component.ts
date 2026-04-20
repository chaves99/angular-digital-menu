import { DatePipe, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { InfoButtonComponent, isFreeTierActive, ModalDialogService, PlansListComponent, SnackBarService, SpinnerComponent } from '../../core';
import { StorageService } from '../../services';
import { CreateUserResponse } from '../../services/payload';
import { SubscriptionDetailModalComponent } from './components/subscription-details-modal/subscription-detail-modal.component';
import { AvailablePlans, SubscriptionResponseItem, SubscriptionService } from './subscription.service';

@Component({
  selector: 'app-subscription',
  imports: [
    DatePipe,
    NgClass,
    SpinnerComponent,
    PlansListComponent,
    InfoButtonComponent
  ],
  templateUrl: './subscription.component.html'
})
export class SubscriptionComponent implements OnInit {

  private readonly subscriptionService = inject(SubscriptionService);
  private readonly snackbarService = inject(SnackBarService);
  private readonly storageService = inject(StorageService);
  private readonly modalService = inject(ModalDialogService);

  user!: CreateUserResponse | null;

  activeSubscription: SubscriptionResponseItem | null = null;
  subscriptionsHistory: SubscriptionResponseItem[] = [];
  availablePlans: AvailablePlans[] = [];

  isFreeTierActive = false;

  isLoading = false;
  isPlanButtonLoading = false;
  isMenuButtonLoading = false;

  ngOnInit(): void {
    this.user = this.storageService.getUser();
    this.isLoading = true;
    this.subscriptionService.get().subscribe({
      next: s => {
        this.isFreeTierActive = isFreeTierActive(s);
        this.activeSubscription = s.active;
        this.subscriptionsHistory = s.history;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackbarService.openError("Erro ao carregar assinatura! Tente mais tarde ou entre em contato com o suporte.");
      }
    });
    this.subscriptionService.getAvailablePlans().subscribe({
      next: plans => {
        this.availablePlans = plans;
      },
      error: () => {
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

  onOpenPlanPayment(priceId: string) {
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

  onChangePaymentMethod(id: string) {
    this.isMenuButtonLoading = true;
    this.subscriptionService.updatePaymentMethod(id).subscribe({
      next: url => {
        window.location.assign(url);
        this.isMenuButtonLoading = false;
      },
      error: () => {
        this.isMenuButtonLoading = false;
        this.snackbarService.openError("Erro ao abrir tela! Tente mais tarde ou entre em contato com o suporte.");
      }
    })
  }

  onGetDetail(id: string) {
    this.isMenuButtonLoading = true;
    this.subscriptionService.getDetails(id).subscribe({
      next: res => {
        this.modalService.open({
          type: SubscriptionDetailModalComponent,
          data: res,
        });
        this.isMenuButtonLoading = false;
      },
      error: () => {
        this.snackbarService.openError("Erro ao buscar detalhes! Tente mais tarde ou entre em contato com o suporte.");
        this.isMenuButtonLoading = false;
      }
    });
  }

  showBuyButton(): boolean {
    return this.activeSubscription === null;
  }
}
