import { Component, OnInit, output } from '@angular/core';
import { ModalDialogData } from './types';

@Component({
  selector: 'app-modal-dialog',
  imports: [
  ],
  templateUrl: './modal-dialog.component.html',
  styles: `
  `
})
export class ModalDialogComponent implements OnInit {

  onClose = output<boolean>();

  data: ModalDialogData | null = null;

  ngOnInit(): void {
  }

  onCloseAction(): void {
    this.onClose.emit(false);
  }

  onConfirmAction(): void {
    this.onClose.emit(true);
  }
}

