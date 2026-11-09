import { Component } from '@angular/core';
import { ModalComponent } from '../modal-dialog/types';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'menu-example-options-modal',
  templateUrl: './menu-example-options-modal.html',
  imports: [
    RouterLink
  ]
})
export class MenuExampleOptionsModal extends ModalComponent<any, any> {

  override initData(data?: any): void {
  }

}
