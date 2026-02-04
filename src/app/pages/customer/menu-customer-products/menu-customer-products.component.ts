import { CurrencyPipe, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { afterEveryRender, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import { MenuService } from '../../../services';
import { ERROR_MESSAGES, ErrorDetailResponse, MenuCategoryResponse, MenuPriceResponse, MenuProductResponse, MenuResponse } from '../../../services/payload';

@Component({
  selector: 'app-customer-product-list',
  imports: [
    QRCodeComponent,
    CurrencyPipe,
    FormsModule,
    RouterLink
  ],
  templateUrl: './menu-customer-products.component.html',
})
export class MenuCustomerProductsComponent implements OnInit {

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly location = inject(Location);

  private readonly menuService = inject(MenuService);

  public menu?: MenuResponse;

  public menuCategories: MenuCategoryResponse[] = [];

  public isSearching: boolean = false;

  searchTerm?: string;

  errorMessage: string | null = null;

  @ViewChild('qrCodeElement', { read: ElementRef })
  qrCodeElement!: ElementRef;

  localName = "http://localhost:4200/customer-menu/";

  constructor() {
    afterEveryRender({
      read: () => {
        this.activatedRoute.fragment.subscribe(f => {
          if (f) {
            this.scrollTo(f);
            const newLocation = this.location.path(false);
            this.location.replaceState(newLocation);
          }
        });
      }
    });
  }

  ngOnInit(): void {
    document.documentElement.setAttribute('data-bs-theme', 'light');
    this.activatedRoute.params
      .subscribe(param => {
        const localName = param['localName'];
        this.localName += localName;
        this.menuService.get(localName)
          .subscribe({
            next: menu => {
              this.menu = menu;
              this.menuCategories = menu.categories;
            },
            error: res => {
              if (res && res instanceof HttpErrorResponse) {
                const errorDetail: ErrorDetailResponse = res.error;
                this.errorMessage = ERROR_MESSAGES[errorDetail.message];
                console.log(this.errorMessage);
              }
            }
          });
      });
  }

  public scrollTo(ref: string): void {
    const element = document.getElementById(ref);
    if (element) {
      element.scrollIntoView();
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

  public search() {
    if (this.menu && this.searchTerm !== undefined) {
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



  // QRCODE
  saveAsImage() {
    const parentElement = this.qrCodeElement.nativeElement.querySelector('canvas').toDataURL('image/png')
    if (parentElement) {
      const blobData = this.convertBase64ToBlob(parentElement)
      const blob = new Blob([blobData], { type: 'image/png' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'angularx-qrcode' // naming file
      link.click()
    }
  }

  private convertBase64ToBlob(Base64Image: string) {
    const parts = Base64Image.split(';base64,')
    const imageType = parts[0].split(':')[1]
    const decodedData = window.atob(parts[1])
    const uInt8Array = new Uint8Array(decodedData.length)
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i)
    }
    return new Blob([uInt8Array], { type: imageType })
  }
}
