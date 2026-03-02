import { CurrencyPipe, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailState } from '../entities';

@Component({
  selector: 'app-customer-menu-detail',
  imports: [
    CurrencyPipe
  ],
  templateUrl: './customer-menu-detail.component.html',
})
export class CustomerMenuDetailComponent implements OnInit {

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router)

  private readonly location = inject(Location);

  state: ProductDetailState | null = null;

  constructor() {
    this.state = this.router.currentNavigation()?.extras.state as ProductDetailState;
    if (this.state === null || this.state === undefined) {
      this.router.navigate(['..'], { relativeTo: this.activatedRoute });
    }
  }

  ngOnInit(): void {
  }

  public back(): void {
    this.location.back();
  }

}
