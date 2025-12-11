import { NgStyle } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [
    NgStyle
  ],
  templateUrl: './modal.component.html'
})
export class ModalComponent {

  modalDisplay = 'block';

  title = input('');
  message = input('');

  close = output();
  confirm = output();

  onConfirm() {
    this.confirm.emit();
  }

  onClose() {
    this.close.emit();
  }

}
