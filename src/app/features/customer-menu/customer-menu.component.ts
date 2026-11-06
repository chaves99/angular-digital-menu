import { NgClass, NgStyle } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, DOCUMENT, inject, input, linkedSignal, model, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CustomizationResponse } from '@features/customization/customization.service';
import { getImagesUrl, ModalDialogService, SpinnerComponent, WINDOW } from '../../core';
import { MenuService } from '../../services';
import { ERROR_MESSAGES, ErrorDetailResponse, MenuCategoryResponse, MenuPriceResponse, MenuProductResponse, MenuResponse } from '../../services/payload';
import { CustomerMenuItemDetailModalComponent } from './components/customer-menu-item-detail-modal/customer-menu-item-detail-modal.component';
import { CustomerMenuItem } from './components/customer-menu-item/customer-menu-item';
import { MoreInfoMenuModalComponent } from './components/more-info-menu-modal/more-info-menu-modal';

@Component({
  selector: 'app-customer-menu',
  templateUrl: 'customer-menu.component.html',
  styleUrl: './customer-menu.component.scss',
  imports: [
    NgClass,
    NgStyle,
    FormsModule,
    SpinnerComponent,
    CustomerMenuItem
  ]
})
export class CustomerMenuComponent implements OnInit {

  scrollUpButtonHidden = true;

  // Used in the customization page
  // to render the proper user menu
  urlCustomerInput = input<string | null>(null);

  themeInput = model<CustomizationResponse>(
    {
      id: -1,
      name: 'Padrão Claro',
      theme: 'LIGHT',
      active: true,
      builtin: true,
      mainColor: '#fff',
      secondaryColor: '#e9ecef',
      font: '',
    }
  );

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly document = inject(DOCUMENT);
  window = inject(WINDOW);
  private readonly modalService = inject(ModalDialogService);

  contactsCssClasses: string = "fs-6 text-reset text-decoration-none";

  private readonly menuService = inject(MenuService);

  public menu = signal<MenuResponse | null>(null);

  public newProducts = linkedSignal<MenuProductResponse[]>(() => {
    return this.menu()?.newProducts ?? [];
  });

  public bestSellingProducts = linkedSignal<MenuProductResponse[]>(() => {
    return this.menu()?.bestSelling ?? [];
  });

  public menuCategories: MenuCategoryResponse[] = [];

  public isLoading = false;

  public getImageUrlLocal = getImagesUrl;

  // Variable to control clear filter button
  public isSearching: boolean = false;

  searchTerm?: string;

  errorMessage: string | null = null;

  bestSellingStyle = computed(() => {
    return {
      '--bs-border-color': this.themeInput().secondaryColor
    };
  });

  footerStyle = computed(() => {
    return {
      '--bs-border-color': this.themeInput().secondaryColor
    };
  })

  tagStyle = computed(() => {
    return {
      '--bs-border-color': this.themeInput().secondaryColor,
    };
  });

  searchFormStyle = computed(() => {
    return {
      '--bs-focus-ring-color': this.themeInput().secondaryColor,
      'border': `1px solid ${this.themeInput().secondaryColor}`
    };
  });

  moreInfoAccordionStyle = computed(() => {
    return {
      '--bs-accordion-btn-bg': this.themeInput().secondaryColor,
      '--bs-accordion-btn-active-bg': this.themeInput().secondaryColor,
      '--bs-accordion-btn-focus-box-shadow': this.themeInput().secondaryColor,
      '--bs-accordion-btn-focus-border-color': this.themeInput().secondaryColor,
      '--bs-accordion-btn-color': this.themeInput().theme === 'LIGHT' ? 'black' : 'white',

      '--bs-accordion-border-color': this.themeInput().secondaryColor,

      '--bs-accordion-active-bg': this.themeInput().secondaryColor,
      '--bs-accordion-active-bg-color': this.themeInput().secondaryColor,
      '--bs-accordion-active-color': this.themeInput().theme === 'LIGHT' ? 'black' : 'white',
    }
  });

  ngOnInit(): void {
    const urlCustomer = this.urlCustomerInput();
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
          this.menu.set(menu);
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
    const menu = this.menu();
    if (menu) {
      const newList: MenuCategoryResponse[] = [];
      const term = this.searchTerm!.toLocaleLowerCase();

      menu.categories.filter(cat => {
        const productList: MenuProductResponse[] = [];
        cat.products.filter(prod => {
          if (prod.description.toLocaleLowerCase().includes(term)
            || prod.name.toLocaleLowerCase().includes(term)) {
            productList.push(prod);
          }
        });
        if (productList.length > 0) {
          newList.push({ ...cat, products: productList })
        }
      });

      const bestSellingFilteredList: MenuProductResponse[] = [];
      menu.bestSelling.forEach(prod => {
          if (prod.description.toLocaleLowerCase().includes(term)
            || prod.name.toLocaleLowerCase().includes(term)) {
            bestSellingFilteredList.push(prod);
          }
      });

      const newProductFilteredList: MenuProductResponse[] = [];

      menu.newProducts.forEach(prod => {
          if (prod.description.toLocaleLowerCase().includes(term)
            || prod.name.toLocaleLowerCase().includes(term)) {
            newProductFilteredList.push(prod);
          }
      });

      this.menuCategories = newList;
      this.isSearching = true;
      this.bestSellingProducts.set(bestSellingFilteredList);
      this.newProducts.set(newProductFilteredList);
    }
  }

  public cleanSearch() {
    const menu = this.menu();
    if (menu) {
      this.menuCategories = menu.categories;
      this.isSearching = false;
      this.searchTerm = "";
      this.bestSellingProducts.set(menu.bestSelling);
      this.newProducts.set(menu.newProducts);
    }
  }

  existSchedule(): boolean {
    const menu = this.menu();
    return menu !== null && menu.schedules.length > 0;
  }


  public existAddress(): boolean {
    const menu = this.menu();
    return menu !== null &&
      ((menu.info.addressCode !== null && menu.info.addressCode.length > 0)
        || (menu.info.addressLine !== null && menu.info.addressLine.length > 0)
        || (menu.info.city !== null && menu.info.city.length > 0));
  }

  public existContacts(): boolean {
    const menu = this.menu();
    return menu !== undefined
      && menu !== null
      && (menu.info.facebook !== null
        || menu.info.instagram !== null
        || menu.info.whatsapp !== null
        || menu.info.website !== null
        || menu.info.phone !== null);
  }

  onOpenItem(product: MenuProductResponse) {
    this.modalService.open({
      type: CustomerMenuItemDetailModalComponent,
      data: { product: product, theme: this.themeInput() }
    });
  }

  onOpenMoreInfoModal() {
    const newMenu: MenuResponse = { ...this.menu()!, customization: this.themeInput() };
    this.modalService.open({
      type: MoreInfoMenuModalComponent,
      data: newMenu
    });
  }

  shouldShowMoreInfoButton(): boolean {
    return this.existContacts() || this.existAddress() || this.existSchedule();
  }
}
