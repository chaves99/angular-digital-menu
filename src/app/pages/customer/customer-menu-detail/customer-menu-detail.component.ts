import { CurrencyPipe, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MenuService } from '../../../services';
import { ProductDetailState } from '../entities';

@Component({
  selector: 'app-customer-menu-detail',
  imports: [
    RouterLink,
    CurrencyPipe
  ],
  templateUrl: './customer-menu-detail.component.html',
})
export class CustomerMenuDetailComponent implements OnInit {

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router)

  private readonly menuService = inject(MenuService);

  private readonly location = inject(Location);

  state: ProductDetailState | null = null;

  constructor() {
    this.state = this.router.currentNavigation()?.extras.state as ProductDetailState;
    if (this.state === null || this.state === undefined) {
      this.router.navigate(['..'], { relativeTo: this.activatedRoute });
    }
  }

  ngOnInit(): void {
    document.documentElement.setAttribute('data-bs-theme', 'light');
    this.activatedRoute.params
      .subscribe(param => {
        const localName = param['localName'];
        // this.menuService.getDetail(localName, productId).subscribe({
        //   next: res => {
        //     console.log(res);
        //   },
        //   error: res => {
        //     console.log("error inside CustomerMenuDetailComponent");
        //     console.log(res);
        //   }
        // })
      });

  }

  public back(): void {
    this.location.back();
  }

}
