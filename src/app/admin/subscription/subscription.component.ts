import { DatePipe, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SnackBarService, SpinnerComponent } from '../../core';
import { StorageService, SubscriptionService } from '../../services';
import { CreateUserResponse, SubscriptionResponse } from '../../services/payload';

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

  subscription: SubscriptionResponse | null = null;

  isLoading = false;

  ngOnInit(): void {
    this.user = this.storageService.getUser();
    this.isLoading = true;
    this.subscriptionService.get().subscribe({
      next: s => {
        console.log(s);
        this.subscription = s;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false }
    });
  }

  onCancel(): void {
    if (this.subscription !== null) {
      this.isLoading = true;
      this.subscriptionService.cancel(this.subscription.id).subscribe({
        next: s => {
          this.isLoading = false;
          this.subscription = s;
        },
        error: () => {
          this.isLoading = false;
          this.snackbarService.openError("Erro ao cancelar assinatura! Tente mais tarde ou entre em contato com o suporte.");
        }
      });
    }
  }

}
