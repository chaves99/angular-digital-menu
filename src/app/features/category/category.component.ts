import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDragPreview,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray
} from '@angular/cdk/drag-drop';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ModalDialogService, SnackBarService, SpinnerComponent } from '../../core';
import { InputModalDialogComponent } from './components/input/input-modal-dialog.component';
import { CategoryResponse, CategoryService } from './category.service';


@Component({
  selector: 'app-category',
  imports: [
    DatePipe,
    CommonModule,
    SpinnerComponent,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    CdkDropListGroup,
    CdkDragPreview,
    NgClass,
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

  public onCreateNewCategory(): void {
    this.modalDialogService.open({
      type: InputModalDialogComponent,
      callback: value => {
        if (value) {
          const categoriesList: { name: string }[] = [];
          categoriesList.push({ name: value });
          this.isLoading = true;
          this.categoryService
            .create(categoriesList).subscribe({
              next: c => {
                this.setResponse(c)
                this.isLoading = false;
              },
              error: () => {
                this.isLoading = false;
                this.snackBarService.openError("Erro ao buscar categorias!");
              }
            });
        }
      }
    });
  }

  public onDelete(category: CategoryResponse): void {
    this.modalDialogService.openDefault({
      title: "Excluir Categoria",
      message: `Deletar categoria "${category.name}"?`,
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
    this.modalDialogService.openDefault({
      title: category.enabled ? "Desabilitar Categoria" : "Habilitar Categoria",
      message: category.enabled ? `Desabilitar categoria "${category.name}"` : `Habilitar categaria: "${category.name}"`,
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
      error: () => {
        this.isLoading = false;
        this.snackBarService.openError("Erro ao desabilitar categoria!");
      }
    });
  }

  onEdit(category: CategoryResponse): void {
    this.modalDialogService.open({
      type: InputModalDialogComponent,
      data: category.name,
      callback: value => {
        if (value) {
          const categoriesList: { name: string }[] = [];
          categoriesList.push({ name: value });
          this.isLoading = true;
          this.categoryService
            .update(category.id, { name: value }).subscribe({
              next: c => {
                this.setResponse(c)
                this.isLoading = false;
              },
              error: () => {
                this.isLoading = false;
                this.snackBarService.openError("Erro ao atualizar categoria!");
              }
            });
        }
      }
    });
  }

}

