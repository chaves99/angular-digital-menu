import { NgClass, NgStyle } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ModalComponent } from 'app/core';
import { MenuResponse } from 'app/services/payload';

@Component({
  selector: 'more-info-menu-modal',
  templateUrl: './more-info-menu-modal.html',
  imports: [
    NgClass,
    NgStyle,
  ]
})
export class MoreInfoMenuModalComponent extends ModalComponent<MenuResponse, any> {

  menu!: MenuResponse;

  contactsCssClasses: string = "fs-6 text-reset text-decoration-none";

  modalContentStyle = signal<{}>({});

  override initData(data?: MenuResponse): void {
    this.menu = data!;
    this.modalContentStyle.set({
      'font-family': this.menu.customization.font,
      '--bs-modal-border-color': this.menu.customization.secondaryColor,
      '--bs-modal-color': this.menu.customization.secondaryColor,
      '--bs-modal-header-border-color':  this.menu.customization.secondaryColor,
      '--bs-modal-bg': this.menu.customization.mainColor
    });
  }

  existSchedule(): boolean {
    return this.menu !== undefined && this.menu.schedules.length > 0;
  }


  public existAddress(): boolean {
    return this.menu !== undefined &&
      ((this.menu.info.addressCode !== null && this.menu.info.addressCode.length > 0)
        || (this.menu.info.addressLine !== null && this.menu.info.addressLine.length > 0)
        || (this.menu.info.city !== null && this.menu.info.city.length > 0));
  }

  public existContacts(): boolean {
    return this.menu !== undefined
      && (this.menu.info.facebook !== null
        || this.menu.info.instagram !== null
        || this.menu.info.whatsapp !== null
        || this.menu.info.website !== null
        || this.menu.info.phone !== null);
  }
}
