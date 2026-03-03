import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDragPreview,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray
}
  from
  '@angular/cdk/drag-drop';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
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
    SpinnerComponent,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    CdkDropListGroup,
    CdkDragPreview,
    NgClass
  ],
  templateUrl: './category.component.html',
})
export class CategoryComponent implements OnInit {

  private readonly categoryService = inject(CategoryService);
  private readonly modalDialogService = inject(ModalDialogService);
  private readonly snackBarService = inject(SnackBarService);

  public categories = signal<CategoryResponse[]>([]);
  public isLoading = false;
  public shouldUpdateOrder = false;

  private originalOrder = signal<CategoryResponse[]>([]);

  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required])
  });
  isNameInputValid = true;

  ngOnInit(): void {
    this.isLoading = true;
    this.categoryService.getAll().subscribe(c => {
      this.setResponse(c)
      this.isLoading = false;
    });
  }

  private setResponse(res: CategoryResponse[]): void {
    this.categories.set(res);
    this.originalOrder.set(Object.assign([], res));
    // always when a request is successfully finished
    // should not have any difference in the sequences
    this.shouldUpdateOrder = false;
  }

  public onSubmit(): void {
    this.isNameInputValid = true;
    console.log('submit');
    console.log(this.formGroup.invalid);
    console.log(this.formGroup.controls.name.invalid);
    if (this.formGroup.invalid) {
      this.isNameInputValid = false;
      return;
    }
    console.log("sending request");
    const categoriesList: { name: string, sequence: number }[] = [];
    if (this.formGroup.valid && this.formGroup.value.name) {
      categoriesList.push({ name: this.formGroup.value.name, sequence: 0 });
      this.isLoading = true;
      this.categoryService
        .create(categoriesList)
        .subscribe({
          next: c => {
            this.setResponse(c)
            this.formGroup.reset();
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
            this.snackBarService.openError("Erro ao buscar categorias!");
          }
        });
    }
  }

  public onDelete(category: CategoryResponse): void {
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
                this.setResponse(c)
                this.isLoading = false;
              },
              error: () => {
                this.isLoading = false;
                this.snackBarService.openError("Erro ao deletar categoria!");
              }
            });
        }
      }
    });
  }

  public onDisable(category: CategoryResponse): void {
    this.modalDialogService.open({
      title: "Desabilitar Categoria",
      message: `Desabilitar categoria "${category.name}"`,
      afterClose: confirm => {
        if (confirm) {
          this.isLoading = true;
          this.categoryService.disable(category.id)
            .subscribe({
              next: c => {
                this.setResponse(c)
                this.isLoading = false;
              },
              error: () => {
                this.isLoading = false;
                this.snackBarService.openError("Erro ao desabilitar categoria!");
              }
            });
        }
      }
    });
  }

  public onDrop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.categories(), event.previousIndex, event.currentIndex);

    this.shouldUpdateOrder = !this.categories().every((cat, idx) => {
      const original = this.originalOrder()[idx];
      return original.id === cat.id;
    })
  }

  onUpdateOrder() {
    const newList = this.categories()
      .map((category, index) => {
        return { id: category.id, sequence: (index + 1) };
      });
    this.isLoading = true;
    this.categoryService.updateSequece(newList).subscribe({
      next: c => {
        this.setResponse(c);
        this.isLoading = false;
      },
      error: res => {
        this.isLoading = false;
        this.snackBarService.openError("Erro ao desabilitar categoria!");
      }
    });
  }

}

