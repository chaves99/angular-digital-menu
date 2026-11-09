import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, CdkDropListGroup, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgClass } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryResponse, CategoryService } from '@features/product';
import { ModalComponent, ModalDialogService, SnackBarService, SpinnerComponent, ThemeService } from 'app/core';
import { InputModalDialogComponent } from 'app/core/components/modal-dialog/modal-dialog-input.component';

@Component({
  selector: 'product-modal-category',
  templateUrl: './product-category-modal.html',
  imports: [
    NgClass,
    FormsModule,
    SpinnerComponent,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    CdkDropListGroup,
  ]
})
export class ProductCategoryModal extends ModalComponent<CategoryResponse[], any> {

  createInput = signal<string>('');

  createButtonActive = computed<boolean>(() => {
    const input = this.createInput();
    if (input && input.trim().length > 0) {
      return true;
    }
    return false;
  });

  private readonly categoryService = inject(CategoryService);
  private readonly modalDialogService = inject(ModalDialogService);
  private readonly snackBarService = inject(SnackBarService);
  readonly themeService = inject(ThemeService);

  public categories: CategoryResponse[] = [];
  public displayiedCategories: CategoryResponse[] = [];
  public shouldUpdateOrder = false;

  public isLoading = false;

  override initData(data?: CategoryResponse[]): void {
    if (data) {
      this.setResponse(data);
    }
  }

  protected override onClose(param?: any): void {
    super.onClose(this.categories);
  }

  onCreate() {
    const value = this.createInput();
    if (value) {
      const categoriesList: { name: string }[] = [];
      categoriesList.push({ name: value });
      this.isLoading = true;
      this.categoryService
        .create(categoriesList).subscribe({
          next: c => {
            this.setResponse(c)
            this.isLoading = false;
            this.createInput.set('');
          },
          error: () => {
            this.isLoading = false;
            this.snackBarService.openError("Erro ao buscar categorias!");
          }
        });
    }
  }

  onEdit(category: CategoryResponse): void {
    this.modalDialogService.open({
      type: InputModalDialogComponent,
      data: {
        fieldValue: category.name,
        fieldDescription: 'fieldDescription',
        inputType: 'text',
        message: 'message',
        modalTitle: 'Editar categoria',
        fieldPlaceholder: '',
        saveButtonText: 'Salvar'
      },
      callback: value => {
        if (value) {
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
      title: category.enabled ? "Inativar Categoria" : "Ativar Categoria",
      message: category.enabled ? `Inativar categoria "${category.name}"` : `Ativar categaria: "${category.name}"`,
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

  onUpdateOrder() {
    this.shouldUpdateOrder = false;
    const newList = this.displayiedCategories
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
        this.shouldUpdateOrder = true;
        this.snackBarService.openError("Erro ao atualizar ordem das categorias!");
      }
    });
  }

  public onDrop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.displayiedCategories, event.previousIndex, event.currentIndex);

    this.shouldUpdateOrder = !this.categories.every((cat, idx) => {
      const original = this.displayiedCategories[idx];
      return original.id === cat.id;
    })
  }

  private setResponse(res: CategoryResponse[]): void {
    this.categories = res;
    this.displayiedCategories = Object.assign([], res);
    // always when a request is successfully finished
    // should not have any difference in the sequences
    this.shouldUpdateOrder = false;
  }
}
