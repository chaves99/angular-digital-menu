import { NgClass } from '@angular/common';
import { Component, output } from '@angular/core';

@Component({
  selector: 'toast',
  imports: [NgClass],
  template: `
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div [ngClass]="data.success ? 'border-success' : 'border-danger'" class="toast border show" >
        <div class="toast-header">
          @if (data.success) {
            <strong class="me-auto text-success"><i class="bi bi-check2-all"></i></strong>
          } @else {
            <strong class="me-auto text-danger"><i class="bi bi-exclamation-triangle"></i></strong>
          }
          <button type="button" class="btn-close" (click)="onInternalClose()"></button>
        </div>
        <div class="toast-body">
          {{ data !== null ? data.message : ''  }}
        </div>
      </div>
    </div>
  `
})
export class SnackBarComponent {

  onClose = output();

  data: {
    success: boolean;
    message: string;
  } = {
      message: '',
      success: true
    };

  public onInternalClose(): void {
    this.onClose.emit();
  }
}
