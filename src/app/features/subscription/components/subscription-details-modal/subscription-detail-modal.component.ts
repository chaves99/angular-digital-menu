import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { SubscriptionDetails } from '@features/subscription/subscription.service';
import { ModalComponent, ModalComponentFunction } from 'app/core';

@Component({
  selector: 'app-custom-modal-dialog',
  imports: [
    DatePipe
  ],
  templateUrl: './subscription-detail-modal.component.html'
})
export class SubscriptionDetailModalComponent extends ModalComponent<SubscriptionDetails, void> {

  data: SubscriptionDetails | null = null;
  callback!: ModalComponentFunction<void>

  ngOnInit(): void {
  }

  override initData(data?: SubscriptionDetails): void {
    this.data = data ?? null;
  }

}
