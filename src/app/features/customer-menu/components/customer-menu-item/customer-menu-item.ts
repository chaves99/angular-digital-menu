import { CurrencyPipe, NgClass, NgStyle } from '@angular/common';
import { Component, input, OnInit, output } from '@angular/core';
import { CustomizationResponse } from '@features/customization/customization.service';
import { getImagesUrl } from 'app/core';
import { MenuProductResponse } from 'app/services/payload';

@Component({
  selector: 'customer-menu-item',
  templateUrl: 'customer-menu-item.html',
  imports: [
    NgStyle,
    NgClass,
    CurrencyPipe
  ]
})
export class CustomerMenuItem implements OnInit {

  product = input.required<MenuProductResponse>();
  themeInput = input.required<CustomizationResponse>();

  clickItem = output<MenuProductResponse>();

  readonly getImageUrl = getImagesUrl;

  ngOnInit(): void {
  }

  onOpenItem() {
    this.clickItem.emit(this.product());
  }
}
