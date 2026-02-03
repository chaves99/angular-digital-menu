import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ModalDialogService } from '../../../core';
import { CategoryService, ProductService } from '../../../services';
import { CategoryResponse, Pagination, ProductResponse } from '../../../services/payload';

@Component({
  selector: 'app-product-list',
  imports: [
    NgClass,
    RouterLink,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {

  private readonly categoryService = inject(CategoryService);
  private readonly productService = inject(ProductService);
  private readonly modalService = inject(ModalDialogService);

  isLoading = false;

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
    const storagedSizeSelectOption = localStorage.getItem(this.SIZE_SELECT_OPTION_STORAGE_KEY);
    if (storagedSizeSelectOption !== null) {
      this.sizeSelectOption = Number(storagedSizeSelectOption);
    }
    this.fetchProductList();
    this.categoryService.getAll().subscribe({
      next: res => this.categories = res
    });
  }

  selectChange() {
    localStorage.setItem(this.SIZE_SELECT_OPTION_STORAGE_KEY, this.sizeSelectOption.toString());
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
    }).subscribe(p => this.setProducts(p));
  }

  setProducts(response: Pagination<ProductResponse>): void {
    this.paginationResponse = response;
    this.displayProducts = response.content;
    this.isLoading = false;
  }

  updatePage(forword: boolean): void {
    if (forword) {
      if (this.page >= (this.paginationResponse!.totalPages - 1)) {
        return;
      }
      this.page++;
      this.fetchProductList();
    } else {
      if (this.page == 0) {
        return;
      }
      this.page--;
      this.fetchProductList();
    }
  }

  lastPage(): void {
    this.page = (this.paginationResponse!.totalPages - 1);
    this.fetchProductList();
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

  delete(product: ProductResponse) {
    this.modalService.open(
      {
        message: "Deseja deleta o produto: " + product.name + "?",
        title: "Confirmar",
        afterClose: confirm => {
          if (!confirm) return;
          this.productService.delete(product.id).subscribe({
            next: p => this.fetchProductList(),
            error: res => {
              console.log(res);
            }
          });
        }
      });
  }

  toggleActive(product: ProductResponse) {
    this.productService.toggleActive(product.id).subscribe({
      next: p => {
        product.active = !product.active;
      },
      error: res => {
        console.log(res);
      }
    });
  }
}
