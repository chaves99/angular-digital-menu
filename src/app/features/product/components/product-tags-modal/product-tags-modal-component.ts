import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TagsService } from '@features/product/tags.service';
import {
  InfoButtonComponent,
  ModalComponent,
  ModalComponentFunction,
  ModalDialogService,
  SnackBarService,
  SpinnerComponent
} from 'app/core';

@Component({
  selector: 'app-product-tags-modal-component',
  templateUrl: './product-tags-modal-component.html',
  imports: [
    SpinnerComponent,
    FormsModule,
    InfoButtonComponent
  ]
})
export class ProductTagsModalComponent extends ModalComponent<any, any> {

  private readonly tagsService = inject(TagsService);
  private readonly snackbarService = inject(SnackBarService);
  private readonly modalService = inject(ModalDialogService);

  tagsResource = this.tagsService.tagsResource();

  createInput = '';
  tagsInfoDescription: string[] = [
    '',
    'As etiquetas nutricionais permitem destacar atributos alimentares específicos — como \"Vegano\", \"Sem glúten\" ou \"Rico em proteínas\" — diretamente no seu cardápio digital.',
    ''
  ];

  override initData(data?: any): void {
  }

  onCreate() {
    if (this.createInput && this.createInput.length > 0) {
      this.tagsService.create(this.createInput).subscribe({
        next: () => {
          this.createInput = '';
          this.tagsResource.reload();
        },
        error: () => {
          this.snackbarService.openError("Erro ao criar tag!");
        }
      });
    }
  }

  onDelete(id: number) {
    this.tagsService.delete(id).subscribe({
      next: () => {
        this.tagsResource.reload();
      },
      error: () => {
        this.snackbarService.openError("Erro ao deletar tag!");
      }
    });
  }

  onQuestionButtonClick() {
    this.modalService.openDefault({
      message: 'test',
      title: 'Title'
    });
  }

}
