import { DatePipe, Location, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { Observable } from 'rxjs';
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
    NgClass,
    SpinnerComponent
  ],
  templateUrl: './product-register.component.html'
})
export class ProductRegisterComponent implements OnInit {

  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly snackBarService = inject(SnackBarService);

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly location = inject(Location);

  public isLoading = false;
  public isCategoryOptionLoading = false;
  public isSavingLoading = false;

  public selectedImage: File | null = null;

  categories: CategoryResponse[] = [];

  productId: number | null = null;
  productResponse: ProductResponse | null = null;

  imageSafeUrl: SafeUrl | null = "https://itimenu-product-images.fly.storage.tigris.dev/user_11/product_16";

  private readonly fb = new FormBuilder();

  formGroup = this.fb.group({
    name: [''],
    description: [''],
    prices: this.fb.array([]),
    active: [true],
    categoryId: [0]
  });

  ngOnInit(): void {
    this.isCategoryOptionLoading = true;
    this.categoryService.getAll()
      .subscribe({
        next: c => {
          this.categories = c;
          this.isCategoryOptionLoading = false;
        },
        error: () => {
          this.isCategoryOptionLoading = false;
        }
      });
    this.activatedRoute.params.subscribe(params => {
      const stringProductId: string | null = params['id'];
      if (stringProductId !== null) {
        this.productId = Number(stringProductId);
        if (this.productId) {
          this.isLoading = true;
          this.productService.getById(this.productId).subscribe({
            next: res => {
              this.setFormValues(res);
              this.isLoading = false;
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

  public onImageChange(event: any): void {
    this.selectedImage = event.target.files[0];
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

      this.isSavingLoading = true;
      this.executeRequest(body).subscribe({
        next: res => {
          if (this.selectedImage !== null) {
            const formData = new FormData();
            if (this.selectedImage !== null && this.productId) {
              formData.append("product_image_file", this.selectedImage, this.selectedImage.name);
              this.productService.uploadImage(this.productId, formData).subscribe({
                next: res => {
                  this.isSavingLoading = false;
                  this.location.back();
                },
                error: res => {
                  this.isSavingLoading = false;
                }
              });
            }
          }
        },
        error: res => {
          this.isSavingLoading = false;
          this.snackBarService.openError("Erro ao cadastrar produto!"); // TODO message error
        }
      });
    } else {
      this.snackBarService.openError("Preencha todos os campos obrigatorios(*)");
    }
  }

  private executeRequest(body: CreateProductRequest): Observable<ProductResponse> {
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
