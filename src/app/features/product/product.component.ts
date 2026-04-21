import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl } from '@angular/forms';
import { CategoryService, CategoryResponse } from '@features/category';
import { SpinnerComponent, ModalDialogService, SnackBarService } from 'app/core';
import { StorageService } from 'app/services';
import { Pagination } from 'app/services/payload';
import { ProductRegisterModalComponent } from './components/product-register-modal/product-register-modal.component';
import { ProductService, ProductResponse } from './product.service';

@Component({
  selector: 'app-product-list',
  imports: [
    NgClass,
    ReactiveFormsModule,
    FormsModule,
    SpinnerComponent
  ],
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {

  private readonly categoryService = inject(CategoryService);
  private readonly productService = inject(ProductService);
  private readonly modalService = inject(ModalDialogService);
  private readonly storageService = inject(StorageService);
  private readonly snackbarService = inject(SnackBarService);

  isLoading = false;
  isActiveButtonLoading: {
    productId: number, status: boolean
  } = { productId: -1, status: false };

  private readonly SIZE_SELECT_OPTION_STORAGE_KEY = "size.select.option.storage.key";

  page = 0;
  sizeSelectOption = 25;

  paginationResponse: Pagination<ProductResponse> | null = null;
  displayProducts: ProductResponse[] = [];
  categories: CategoryResponse[] = []

  formGroup = new FormGroup({
    name: new FormControl(''),
    categoryId: new FormControl<number | null>(0),
    active: new FormControl<null | boolean>(null),
  });

  ngOnInit(): void {
    const storagedSizeSelectOption = this.storageService.get(this.SIZE_SELECT_OPTION_STORAGE_KEY);
    if (storagedSizeSelectOption !== null && storagedSizeSelectOption.length > 0) {
      this.sizeSelectOption = Number(storagedSizeSelectOption);
    }
    this.fetchProductList();
    this.categoryService.getAll().subscribe({
      next: res => this.categories = res
    });
  }

  onEdit(product: ProductResponse | null) {
    this.modalService.open({
      type: ProductRegisterModalComponent,
      data: product,
      callback: reload => {
        if(reload) {
          this.fetchProductList();
        }
      }
    });
  }

  selectChange() {
    this.storageService.store(this.SIZE_SELECT_OPTION_STORAGE_KEY, this.sizeSelectOption.toString())
    this.page = 0;
    this.fetchProductList();
  }

  public fetchProductList() {
    const { name, categoryId, active } = this.formGroup.value;
    this.isLoading = true;
    this.productService.getAll({
      page: this.page,
      size: this.sizeSelectOption,
      name: name,
      categoryId: (categoryId == 0) ? null : categoryId,
      active: active
    }).subscribe({
      next: p => this.setProducts(p),
      error: () => {
        this.isLoading = false;
      }
    });
  }

  setProducts(response: Pagination<ProductResponse>): void {
    this.paginationResponse = response;
    this.displayProducts = response.content;
    this.isLoading = false;
  }

  forwardPage(): void {
    if (this.page >= this.getLastPage()) {
      return;
    }
    this.page++;
    this.fetchProductList();
  }

  previousPage(): void {
    if (this.page == 0) {
      return;
    }
    this.page--;
    this.fetchProductList();
  }

  lastPage(): void {
    this.page = this.getLastPage();
    this.fetchProductList();
  }

  getLastPage(): number {
    return (this.paginationResponse!.totalPages - 1);
  }

  firstPage(): void {
    this.page = 0;
    this.fetchProductList();
  }

  cleanFilter(callService: boolean): void {
    this.formGroup.reset();
    this.formGroup.controls.active.patchValue(null);
    if (callService) this.fetchProductList();
  }

  onDelete(product: ProductResponse) {
    this.modalService.openDefault(
      {
        message: "Deseja deleta o produto: " + product.name + "?",
        title: "Confirmar",
        afterClose: confirm => {
          if (!confirm) return;
          this.productService.delete(product.id).subscribe({
            next: () => this.fetchProductList(),
            error: () => {
              this.snackbarService.openError("Erro ao deletar produto!");
            }
          });
        }
      });
  }

  onToggleActive(product: ProductResponse) {
    this.isActiveButtonLoading = { productId: product.id, status: true };
    this.productService.toggleActive(product.id).subscribe({
      next: () => {
        product.active = !product.active;
        this.isActiveButtonLoading = { ...this.isActiveButtonLoading, status: false };
      },
      error: () => {
        const msg = product.active ? "ativar" : "inativar";
        this.snackbarService.openError(`Erro ao ${msg} produto!`);
        this.isActiveButtonLoading = { ...this.isActiveButtonLoading, status: false };
      }
    });
  }
}
