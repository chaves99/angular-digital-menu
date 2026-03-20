import { CurrencyPipe, NgOptimizedImage, ViewportScroller } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DOCUMENT, effect, ElementRef, inject, OnInit, Signal, viewChild, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, Scroll } from '@angular/router';
import { filter, map } from 'rxjs';
import { SpinnerComponent } from '../../../core';
import { MenuService } from '../../../services';
import { ERROR_MESSAGES, ErrorDetailResponse, MenuCategoryResponse, MenuPriceResponse, MenuProductResponse, MenuResponse } from '../../../services/payload';

@Component({
  selector: 'app-customer-product-list',
  imports: [
    CurrencyPipe,
    FormsModule,
    RouterLink,
    SpinnerComponent,
    NgOptimizedImage
  ],
  templateUrl: './menu-customer-products.component.html',
})
export class MenuCustomerProductsComponent implements OnInit {

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly document = inject(DOCUMENT);

  // used to scroll when get back from details
  // see https://angular.love/angular-scroll-position-restoration
  scrollingRef = viewChild<HTMLElement>('scrolling');

  private readonly menuService = inject(MenuService);

  public menu?: MenuResponse;

  public menuCategories: MenuCategoryResponse[] = [];

  public isLoading = false;

  // Variable to control clear filter button
  public isSearching: boolean = false;

  searchTerm?: string;

  errorMessage: string | null = null;

  @ViewChild('qrCodeElement', { read: ElementRef })
  qrCodeElement!: ElementRef;

  localName = "http://localhost:4200/customer-menu/";

  constructor() {
    const scrollingPosition: Signal<[number, number] | undefined> = toSignal(
      inject(Router).events.pipe(
        filter((event): event is Scroll => event instanceof Scroll),
        map((event: Scroll) => event.position || [0, 0])
      ),
    );
    effect(() => {
      if (this.scrollingRef() && scrollingPosition()) {
        this.viewportScroller.scrollToPosition(scrollingPosition()!);
      }
    });

  }

  ngOnInit(): void {
    this.document.documentElement.setAttribute('data-bs-theme', 'light');
    this.activatedRoute.params
      .subscribe(param => {
        const localName = param['localName'];
        this.localName += localName;
        this.isLoading = true;
        this.menuService.get(localName)
          .subscribe({
            next: menu => {
              this.menu = menu;
              this.menuCategories = menu.categories;
              this.isLoading = false;
            },
            error: res => {
              if (res && res instanceof HttpErrorResponse) {
                const errorDetail: ErrorDetailResponse = res.error;
                if (errorDetail.message !== null)
                  this.errorMessage = ERROR_MESSAGES[errorDetail.message];
              }
              this.isLoading = false;
            }
          });
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
    if (this.menu && this.searchTerm !== undefined && this.searchTerm.length > 0) {
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
    } else {
      this.isSearching = false;
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

  public openContactLink(link: string): void {
  }

  public openTelephone(): void {
  }

}
