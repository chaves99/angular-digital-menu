import { CurrencyPipe, NgClass, NgStyle } from "@angular/common";
import { Component, ElementRef, inject, Renderer2, ViewChild } from "@angular/core";
import { CustomizationResponse } from "@features/customization/customization.service";
import { getImagesUrl, ModalComponent } from "../../../../core";
import { MenuCategoryResponse, MenuProductResponse } from "../../../../services/payload";

@Component({
  selector: 'app-customer-menu-details',
  templateUrl: './customer-menu-item-modal.component.html',
  imports: [CurrencyPipe, NgStyle, NgClass]
})
export class CustomerMenuItemModalComponent extends ModalComponent<ItemModalInput, void> {

  public getImageUrlLocal = getImagesUrl;

  state!: ItemModalInput;

  @ViewChild('parentDiv', { static: true }) parentDiv!: ElementRef;
  private readonly rederer = inject(Renderer2);

  override initData(data?: ItemModalInput): void {
    this.state = data!;

    // if (this.state?.theme.theme === "DARK") {
    //   this.rederer.setAttribute(this.parentDiv.nativeElement, 'data-bs-theme', 'dark');
    // } else {
    //   this.rederer.setAttribute(this.parentDiv.nativeElement, 'data-bs-theme', 'light');
    // }

  }
}

interface ItemModalInput {
  product: MenuProductResponse;
  category: MenuCategoryResponse;
  theme: CustomizationResponse;
}
