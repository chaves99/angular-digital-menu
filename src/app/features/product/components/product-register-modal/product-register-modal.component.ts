import { DatePipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CategoryResponse, CategoryService } from '@features/category';
import { CreateProductRequest, PricesRequest, ProductResponse, ProductService } from '@features/product/product.service';
import { getImagesUrl, ModalComponent, ModalComponentFunction, SnackBarService } from 'app/core';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-register-modal',
  imports: [
    ReactiveFormsModule,
    CurrencyMaskModule,
    DatePipe,
    NgClass
  ],
  templateUrl: './product-register-modal.component.html',
})
export class ProductRegisterModalComponent extends ModalComponent<ProductResponse, boolean> {

  productResponse: ProductResponse | null = null;
  callbackFunc!: ModalComponentFunction<boolean>;

  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly compressImageService = inject(NgxImageCompressService);

  public getImageUrlLocal = getImagesUrl;

  public isLoading = false;
  public isCategoryOptionLoading = false;
  public isSavingLoading = false;
  public isDeleteImageLoading = false;

  public selectedImage: File | null = null;
  public selectedImageBlob: Blob | null = null;

  categories: CategoryResponse[] = [];

  private readonly fb = new FormBuilder();

  formGroup = this.fb.group({
    name: [''],
    description: [''],
    prices: this.fb.array([]),
    active: [true],
    categoryId: [0]
  });

  override init(model: { data?: ProductResponse; callbackFunc: ModalComponentFunction<boolean>; }): void {
    if (model.data) {
      this.productResponse = model.data;
      this.setFormValues(this.productResponse);
    }
    this.isCategoryOptionLoading = true;
    this.categoryService.getAll().subscribe({
      next: c => {
        this.categories = c;
        this.isCategoryOptionLoading = false;
      },
      error: () => this.isCategoryOptionLoading = false
    });
    this.callbackFunc = model.callbackFunc;
  }

  onClose(reload?: boolean): void {
    this.callbackFunc(reload);
  }

  public onImageChange(event: any): void {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event: any) => {
      if (event.target !== null) {
        const r = event.target.result;
        this.compressImageService.compressFile(r, -1)
          .then(compressed => {
            this.selectedImageBlob = this.base64ToBlob(compressed);
          });
      }
    };
    reader.readAsDataURL(file);
  }

  base64ToBlob(base64: string) {
    const byteString = atob(base64.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  }

  public onSubmit(): void {
    const { name, description, categoryId, prices } = this.formGroup.value;
    const active = this.formGroup.value.active as boolean;

    if (name && categoryId && prices) {
      const pricesRequest: PricesRequest[] = prices.map(p => {
        const p2 = p as { id: number | null, unit: string, value: number };
        return { id: p2.id, value: p2.value, unit: p2.unit };
      }).filter(p => p.value !== null);

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
          if (this.selectedImageBlob !== null) {
            const formData = new FormData();
            formData.append("product_image_file", this.selectedImageBlob);
            this.productService.uploadImage(res.id, formData).subscribe({
              next: () => {
                this.isSavingLoading = false;
                this.onClose(true);
              },
              error: () => {
                this.isSavingLoading = false;
                this.snackBarService.openError("Erro ao salvar imagem!");
              }
            });
          } else {
            this.isSavingLoading = false;
            this.onClose(true);
          }

        },
        error: () => {
          this.isSavingLoading = false;
          this.snackBarService.openError("Erro ao cadastrar produto!"); // TODO message error
        }
      });
    } else {
      this.snackBarService.openError("Preencha todos os campos obrigatorios(*)");
    }
  }

  public onDeleteImage() {
    if (this.productResponse !== null) {
      this.isDeleteImageLoading = true;
      this.productService.deleteImage(this.productResponse.id).subscribe({
        next: prod => {
          this.isDeleteImageLoading = false;
          this.setFormValues(prod);
          this.snackBarService.openSuccess("Imagem excluida.");
        },
        error: () => {
          this.snackBarService.openError("Erro ao excluir imagem!");
          this.isDeleteImageLoading = false;
        }
      });
    }
  }

  private executeRequest(body: CreateProductRequest): Observable<ProductResponse> {
    if (this.productResponse) {
      return this.productService.update(this.productResponse.id, body);
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
