import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../services';
import { CategoryResponse } from '../../services/payload';

@Component({
  selector: 'app-category',
  imports: [
    ReactiveFormsModule,
    DatePipe,
    CommonModule
  ],
  templateUrl: './category.component.html',
})
export class CategoryComponent implements OnInit {

  private readonly categoryService = inject(CategoryService);

  public categories: CategoryResponse[] = [];

  disableModalDisplay = 'none';
  disableCategorySelected: CategoryResponse | null = null;

  deleteModalDisplay = 'none';
  deleteCategorySelected: CategoryResponse | null = null;

  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(c => this.categories = c);
  }

  public onSubmit(): void {
    const categoriesList: { name: string }[] = [];
    if (this.formGroup.valid && this.formGroup.value.name) {
      categoriesList.push({ name: this.formGroup.value.name });
      this.categoryService
        .create(categoriesList)
        .subscribe(c => {
          this.categories = c;
          this.formGroup.reset();
        });
    }
  }

  public delete(): void {
    if (this.deleteCategorySelected) {
      this.categoryService.delete(this.deleteCategorySelected.id)
        .subscribe(c => {
          this.categories = c;
          this.closeDeleteModal();
        });
    }
  }

  public disable(): void {
    if (this.disableCategorySelected) {
      this.categoryService.disable(this.disableCategorySelected.id)
        .subscribe(c => {
          this.categories = c;
          this.closeDisableModal();
        });
    }
  }

  public openDisableModal(category: CategoryResponse): void {
    this.disableModalDisplay = 'block';
    this.disableCategorySelected = category;
  }

  public closeDisableModal(): void {
    this.disableModalDisplay = 'none';
    this.disableCategorySelected = null;
  }

  public openDeleteModal(category: CategoryResponse): void {
    this.deleteModalDisplay = 'block';
    this.deleteCategorySelected = category;
  }

  public closeDeleteModal(): void {
    this.deleteModalDisplay = 'none';
    this.deleteCategorySelected = null;
  }
}

