import { DatePipe, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { SnackBarService, SpinnerComponent } from '../../../core';
import { CategoryService, ProductService } from '../../../services';
import {
  CategoryResponse,
  CreateProductRequest,
  PricesRequest,
  ProductResponse
} from '../../../services/payload';

@Component({
  selector: 'app-product-register',
  imports: [
    ReactiveFormsModule,
    CurrencyMaskModule,
    DatePipe,
    SpinnerComponent
  ],
  templateUrl: './product-register.component.html'
})
export class ProductRegisterComponent implements OnInit {

  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly location = inject(Location);

  private readonly snackBarService = inject(SnackBarService);

  public isLoading = false;

  categories: CategoryResponse[] = [];

  productId: number | null = null;
  productResponse: ProductResponse | null = null;

  private readonly fb = new FormBuilder();

  formGroup = this.fb.group({
    name: [''],
    description: [''],
    prices: this.fb.array([]),
    active: [true],
    categoryId: [0]
  });

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const stringProductId: string | null = params['id'];
      if (stringProductId !== null) {
        this.productId = Number(stringProductId);
        if (this.productId) {
          this.isLoading = true;
          this.productService.getById(this.productId).subscribe({
            next: res => {
              this.setFormValues(res);

              this.categoryService.getAll()
                .subscribe({
                  next: c => {
                    this.categories = c;
                    this.isLoading = false;
                  },
                  error: () => {
                    this.isLoading = false;
                  }
                });
            },
            error: () => {
              this.productId = null;
              this.isLoading = false;
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
          this.snackBarService.openError("Erro ao cadastrar produto!"); // TODO message error
        }
      });
    } else {
      this.snackBarService.openError("Preencha todos os campos obrigatorios(*)");
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

  public getBack(): void {
    this.location.back();
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
    this.productResponse = product;
    const prices = product.prices.map(price => {
      this.addPrice();
      return { id: price.id, unit: price.unit, value: price.value }
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
