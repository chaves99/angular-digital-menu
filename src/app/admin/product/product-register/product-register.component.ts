import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CategoryService, PriceLayerService, ProductService } from '../../../services';
import {
  CategoryResponse,
  CreateProductRequest,
  PriceLayerResponse,
  PricesRequest,
  ProductResponse
} from '../../../services/payload';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-register',
  imports: [
    ReactiveFormsModule,
    CurrencyMaskModule,
    RouterLink
  ],
  templateUrl: './product-register.component.html'
})
export class ProductRegisterComponent implements OnInit {

  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly priceLayerService = inject(PriceLayerService);

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  priceLayers: PriceLayerResponse[] = [];

  categories: CategoryResponse[] = [];

  productId: number | null = null;

  private readonly fb = new FormBuilder();

  formGroup = this.fb.group({
    name: [''],
    description: [''],
    prices: this.fb.array([]),
    active: [true],
    categoryId: [0]
  });

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(c => this.categories = c);
    this.priceLayerService.getAll().subscribe(p => this.priceLayers = p);
    this.activatedRoute.params.subscribe(params => {
      const stringProductId: string | null = params['id'];
      if (stringProductId !== null) {
        this.productId = Number(stringProductId);
        if (this.productId) {
          this.productService.getById(this.productId).subscribe({
            next: res => this.setFormValues(res),
            error: res => {
            }
          })
        }
      }
    });
  }

  public onSubmit(): void {
    const { name, description, categoryId, prices } = this.formGroup.value;
    const active = this.formGroup.value.active as boolean;

    if (name && categoryId && prices) {
      const pricesRequest: PricesRequest[] = prices.map(p => {
        const p2 = p as { id: number | null, unit: string, value: number, layerId: number };
        return { id: p2.id, value: p2.value, unit: p2.unit, layerId: p2.layerId };
      });

      const body: CreateProductRequest = {
        name: name,
        description: description,
        prices: pricesRequest,
        active: active,
        categoryId: categoryId
      };

      this.executeRequest(body).subscribe({
        next: res => {
          this.location.back();
        },
        error: res => {
          console.log("Error creating product");
          console.log(res);
        }
      });

    }
  }

  private executeRequest(body: CreateProductRequest) {
    if (this.productId) {
      return this.productService.update(this.productId, body);
    } else {
      return this.productService.create(body);
    }
  }

  public deletePrice(index: number): void {
    this.prices.removeAt(index);
  }

  public get priceControls(): AbstractControl[] {
    return this.prices.controls;
  }

  public addPrice(): void {
    let priceFormGroup = this.fb.group({
      id: [],
      unit: [],
      value: [],
      layerId: []
    });
    this.prices.push(priceFormGroup);
  }

  getFormGroupAtIndex(index: number) {
    return (this.priceControls[index] as FormGroup);
  }

  public setFormValues(product: ProductResponse): void {
    const prices = product.prices.map(price => {
      this.addPrice();
      return { id: price.id, unit: price.unit, value: price.value, layerId: price.priceLayerId }
    });
    this.formGroup.patchValue({
      name: product.name,
      description: product.description,
      active: product.active,
      categoryId: product.categoryId
    });
    this.formGroup.controls.prices.patchValue(prices);
  }

  public get prices(): FormArray {
    return (this.formGroup.get("prices") as FormArray);
  }

}
