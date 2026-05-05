import { CurrencyPipe, NgClass, NgStyle } from "@angular/common";
import { Component } from "@angular/core";
import { getImagesUrl, ModalComponent, ModalComponentFunction } from "../../../../core";
import { MenuCategoryResponse, MenuProductResponse } from "../../../../services/payload";
import { Theme } from "@features/customer-menu/customer-menu.component";

@Component({
  selector: 'app-customer-menu-details',
  templateUrl: './customer-menu-item-modal.component.html',
  imports: [CurrencyPipe, NgStyle, NgClass]
})
export class CustomerMenuItemModalComponent extends ModalComponent<ItemModalInput, void> {

  public getImageUrlLocal = getImagesUrl;

  state: ItemModalInput | null = null;

  private callback!: ModalComponentFunction<void>;

  constructor() {
    super();
  }

  override init(
    model: {
      data?: ItemModalInput | undefined;
      callbackFunc: ModalComponentFunction<void>;
    }): void {
      this.state = model.data ?? null;
      this.callback = model.callbackFunc;

  }

  public back(): void {
    this.callback();
  }
}

interface ItemModalInput {
  product: MenuProductResponse,
  category: MenuCategoryResponse
  theme: Theme
}
