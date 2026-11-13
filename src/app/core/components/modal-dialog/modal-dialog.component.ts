import { Component, OnInit, output } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';
import { ModalComponent, ModalDialogData } from './types';

@Component({
  selector: 'app-modal-dialog',
  imports: [
    SpinnerComponent
  ],
  templateUrl: './modal-dialog.component.html',
})
export class ModalDialogComponent extends ModalComponent<ModalDialogData, boolean> {

  data: ModalDialogData | null = null;

  isImageLoading = true;

  override initData(data?: ModalDialogData): void {
    if (data) {
      this.data = data;
    }
  }

  onImageLoadFinish() {
    this.isImageLoading = false;
  }
}

