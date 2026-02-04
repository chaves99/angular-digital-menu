import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalDialogService, SnackBarService, SpinnerComponent } from '../../core';
import { CategoryService } from '../../services';
import { CategoryResponse } from '../../services/payload';

@Component({
  selector: 'app-category',
  imports: [
    ReactiveFormsModule,
    DatePipe,
    CommonModule,
    SpinnerComponent
  ],
  templateUrl: './category.component.html',
})
export class CategoryComponent implements OnInit {

  private readonly categoryService = inject(CategoryService);
  private readonly modalDialogService = inject(ModalDialogService);
  private readonly snackBarService = inject(SnackBarService);

  public categories: CategoryResponse[] = [];
  public isLoading = false;

  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
    this.isLoading = true;
    this.categoryService.getAll().subscribe(c => {
      this.categories = c;
      this.isLoading = false;
    });
  }

  public onSubmit(): void {
    const categoriesList: { name: string }[] = [];
    if (this.formGroup.valid && this.formGroup.value.name) {
      categoriesList.push({ name: this.formGroup.value.name });
      this.isLoading = true;
      this.categoryService
        .create(categoriesList)
        .subscribe({
          next: c => {
            this.categories = c;
            this.formGroup.reset();
            this.isLoading = false;
          },
          error: res => {
            this.isLoading = false;
            this.snackBarService.openError("Erro ao buscar categorias!");
          }
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
          this.isLoading = true;
          this.categoryService.delete(category.id)
            .subscribe({
              next: c => {
                this.categories = c;
                this.isLoading = false;
              },
              error: res => {
                this.isLoading = false;
                this.snackBarService.openError("Erro ao deletar categoria!");
              }
            });
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
          this.isLoading = true;
          this.categoryService.disable(category.id)
            .subscribe({
              next: c => {
                this.categories = c;
                this.isLoading = false;
              },
              error: res => {
                this.isLoading = false;
                this.snackBarService.openError("Erro ao desabilitar categoria!");
              }
            });
        }
      }
    });
  }
}

