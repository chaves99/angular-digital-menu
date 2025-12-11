import { DatePipe, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services';
import { ProductResponse } from '../../../services/payload';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  imports: [
    DatePipe,
    NgClass,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {

  private readonly productService = inject(ProductService);

  baseProducts: ProductResponse[] = [];
  displayProducts: ProductResponse[] = [];
  categories: { id: number, name: string }[] = [];

  ;

  formGroup = new FormGroup({
    name: new FormControl(''),
    categoryId: new FormControl(0),
    status: new FormControl<'both' | 'active' | 'inactive'>('both'),
  });

  ngOnInit(): void {
    this.productService.getAll().subscribe(p => this.setProducts(p));
  }

  setProducts(products: ProductResponse[]): void {
    this.baseProducts = products;
    this.displayProducts = products;
    products.forEach(p => {
      if (!this.categories.find(c => c.id === p.categoryId)) {
        this.categories.push({ id: p.categoryId, name: p.categoryName });
      }
    })
  }

  cleanFilter(): void {
    this.formGroup.reset();
    this.formGroup.controls.status.patchValue('both');
    this.onSubmit();
  }

  onSubmit(): void {
    this.displayProducts = [];
    this.baseProducts.forEach(prod => {
      if (this.validFilterCategory(prod)
        && this.validFilterName(prod)
        && this.validFilterStatus(prod)) {
        console.log(`add product: ${prod}`);
        this.displayProducts.push(prod);
      }
    });
    console.log(this.displayProducts);
  }

  private validFilterStatus(product: ProductResponse): boolean {
    const status = this.formGroup.value.status;
    if (status !== 'both') {
      if (product.active) {
        return status === 'active';
      } else {
        return status === 'inactive';
      }
    }
    return true;
  }

  private validFilterCategory(product: ProductResponse): boolean {
    const categoryId: number = Number(this.formGroup.value.categoryId);
    if (categoryId > 0) {
      return (product.categoryId === categoryId);
    }
    return true;
  }

  private validFilterName(product: ProductResponse): boolean {
    const name = this.formGroup.value.name;
    if (name && name.length > 0) {
      if (!product.name.toLocaleLowerCase().includes(name.toLocaleLowerCase())) {
        return false
      }
    }
    return true;
  }

  delete(product: ProductResponse) {
    this.productService.delete(product.id).subscribe({
      next: p => this.setProducts(p),
      error: res => {
        console.log(res);
      }
    });
  }

  toggleActive(product: ProductResponse) {
    this.productService.toggleActive(product.id).subscribe({
      next: p => this.setProducts(p),
      error: res => {
        console.log(res);
      }
    });
  }

}
