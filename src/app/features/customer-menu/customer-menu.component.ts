import { CurrencyPipe, NgClass, NgOptimizedImage, NgStyle } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DOCUMENT, inject, input, model, OnInit, viewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CustomizationResponse } from '@features/customization/customization.service';
import { getImagesUrl, ModalDialogService, SpinnerComponent } from '../../core';
import { MenuService } from '../../services';
import { ERROR_MESSAGES, ErrorDetailResponse, MenuCategoryResponse, MenuPriceResponse, MenuProductResponse, MenuResponse } from '../../services/payload';
import { CustomerMenuItemModalComponent } from './components/customer-menu-item/customer-menu-item-modal.component';

@Component({
  selector: 'app-customer-menu',
  templateUrl: 'customer-menu.component.html',
  styleUrl: './customer-menu.component.scss',
  imports: [
    CurrencyPipe,
    NgClass,
    NgStyle,
    FormsModule,
    NgOptimizedImage,
    SpinnerComponent
  ],
})
export class CustomerMenuComponent implements OnInit {

  urlCustomer = input<string | null>(null);
  themeInput = model<CustomizationResponse>(
    {
      id: -1,
      name: 'Padrão Claro',
      theme: 'LIGHT',
      active: true,
      builtin: true,
      mainColor: '#fff',
      secondaryColor: '#e9ecef',
      font: ''
    }
  );

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly document = inject(DOCUMENT);
  private readonly modalService = inject(ModalDialogService);

  lineSeparator = viewChildren<HTMLElement>('lineSeparator');

  contactsCssClasses: string = "fs-6 text-reset text-decoration-none";

  private readonly menuService = inject(MenuService);

  public menu?: MenuResponse;

  public menuCategories: MenuCategoryResponse[] = [];

  public isLoading = false;

  public getImageUrlLocal = getImagesUrl;

  // Variable to control clear filter button
  public isSearching: boolean = false;

  searchTerm?: string;

  errorMessage: string | null = null;

  constructor() {
  }

  ngOnInit(): void {
    const urlCustomer = this.urlCustomer();
    if (urlCustomer !== null) {
      this.loadMenu(urlCustomer);
    } else {
      this.activatedRoute.params
        .subscribe(param => {
          const urlCode = param['localName'];
          this.loadMenu(urlCode);
        });
    }
  }

  private loadMenu(urlCode: string): void {
    this.isLoading = true;
    this.menuService.get(urlCode)
      .subscribe({
        next: menu => {
          this.menu = menu;
          this.menuCategories = menu.categories;
          this.isLoading = false;
          if (menu.customization) {
            this.themeInput.set(menu.customization);
          }

        },
        error: res => {
          this.isLoading = false;
          if (res && res instanceof HttpErrorResponse) {
            const errorDetail: ErrorDetailResponse = res.error;
            if (errorDetail !== null && errorDetail.message !== null) {
              this.errorMessage = ERROR_MESSAGES[errorDetail.message];
            } else {
              this.errorMessage = "Erro ao carregar menu!";
            }
          }
        }
      });
  }

  public scrollTo(ref: string): void {
    const element = this.document.getElementById(ref);
    if (element) {
      element.scrollIntoView({ block: 'center' });
    }
  }

  public getLowestPrice(prices: MenuPriceResponse[]): MenuPriceResponse {
    let lowest = prices[0];
    prices.forEach(p => {
      if (p.value < lowest.value) {
        lowest = p;
      }
    });
    return lowest;
  }

  public onSearch() {
    if (this.searchTerm === undefined) {
      return;
    }

    if (this.searchTerm.trim() === "") {
      this.cleanSearch();
      return;
    }


    if (this.menu) {
      const newList: MenuCategoryResponse[] = [];
      this.menu.categories.filter(cat => {
        const productList: MenuProductResponse[] = [];
        cat.products.filter(prod => {
          const term = this.searchTerm!.toLocaleLowerCase();
          if (prod.description.toLocaleLowerCase().includes(term)
            || prod.name.toLocaleLowerCase().includes(term)) {
            productList.push(prod);
          }
        });
        if (productList.length > 0) {
          newList.push({ ...cat, products: productList })
        }
      });
      this.menuCategories = newList;
      this.isSearching = true;
    }
  }

  existSchedule(): boolean {
    return this.menu !== undefined && this.menu.schedules.length > 0;
  }

  public cleanSearch() {
    if (this.menu) {
      this.menuCategories = this.menu.categories;
      this.isSearching = false;
      this.searchTerm = "";
    }
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

  onOpenItem(product: MenuProductResponse, category: MenuCategoryResponse) {
    this.modalService.open({
      type: CustomerMenuItemModalComponent,
      data: { product: product, category: category, theme: this.themeInput() }
    });
  }

  public openContactLink(link: string): void {
  }

  public openTelephone(): void {
  }
}
