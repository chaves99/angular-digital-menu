import { CurrencyPipe, NgClass, NgStyle } from "@angular/common";
import { Component, ElementRef, inject, Renderer2, ViewChild } from "@angular/core";
import { getImagesUrl, ModalComponent, ModalComponentFunction } from "../../../../core";
import { MenuCategoryResponse, MenuProductResponse } from "../../../../services/payload";
import { CustomizationResponse } from "@features/customization/customization.service";

@Component({
  selector: 'app-customer-menu-details',
  templateUrl: './customer-menu-item-modal.component.html',
  imports: [CurrencyPipe, NgStyle, NgClass]
})
export class CustomerMenuItemModalComponent extends ModalComponent<ItemModalInput, void> {

  public getImageUrlLocal = getImagesUrl;

  state: ItemModalInput | null = null;

  @ViewChild('parentDiv', { static: true }) parentDiv!: ElementRef;
  private readonly rederer = inject(Renderer2);

  private callback!: ModalComponentFunction<void>;

  override init(
    model: {
      data?: ItemModalInput | undefined;
      callbackFunc: ModalComponentFunction<void>;
    }): void {
    this.state = model.data ?? null;
    this.callback = model.callbackFunc;

    if (this.state?.theme.theme === "DARK") {
      this.rederer.setAttribute(this.parentDiv.nativeElement, 'data-bs-theme', 'dark');
    } else {
      this.rederer.setAttribute(this.parentDiv.nativeElement, 'data-bs-theme', 'light');
    }

  }

  public back(): void {
    this.callback();
  }
}

interface ItemModalInput {
  product: MenuProductResponse;
  category: MenuCategoryResponse;
  theme: CustomizationResponse;
}
