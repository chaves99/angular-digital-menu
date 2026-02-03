import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalDialogService } from '../../core';
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
  private readonly modalDialogService = inject(ModalDialogService);

  public categories: CategoryResponse[] = [];

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

  public delete(category: CategoryResponse): void {
    this.modalDialogService.open({
      title: "Excluir Categoria",
      message: `Deletar categoria "${category.name}"`,
      subMessage: "Isso irá deletar todos os produtos vinculados a esta categoria.",
      afterClose: confirm => {
        if (confirm) {
          this.categoryService.delete(category.id)
            .subscribe(c => this.categories = c);
        }
      }
    });
  }

  public disable(category: CategoryResponse): void {
    this.modalDialogService.open({
      title: "Desabilitar Categoria",
      message: `Desabilitar categoria "${category.name}"`,
      afterClose: confirm => {
        if (confirm) {
          this.categoryService.disable(category.id)
            .subscribe(c => this.categories = c);
        }
      }
    });
  }
}

