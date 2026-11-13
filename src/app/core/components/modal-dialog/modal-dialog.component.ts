import { Component, OnInit, output } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';
import { ModalDialogData } from './types';

@Component({
  selector: 'app-modal-dialog',
  imports: [
    SpinnerComponent
  ],
  templateUrl: './modal-dialog.component.html',
})
export class ModalDialogComponent implements OnInit {

  onClose = output<boolean>();

  data: ModalDialogData | null = null;

  isImageLoading = true;

  ngOnInit(): void {
  }

  onCloseAction(): void {
    this.onClose.emit(false);
  }

  onConfirmAction(): void {
    this.onClose.emit(true);
  }

  onImageLoadFinish() {
    this.isImageLoading = false;
  }
}

