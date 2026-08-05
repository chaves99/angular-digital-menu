import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { CustomizationResponse, CustomizationService } from '@features/customization/customization.service';
import { ModalComponent, ModalComponentFunction, SnackBarService } from 'app/core';

@Component({
  selector: 'app-themes-modal',
  imports: [],
  templateUrl: './themes-modal.component.html',
})
export class ThemesModalComponent extends ModalComponent<CustomizationResponse[], CustomizationResponse> {

  private readonly customizationService = inject(CustomizationService);
  private readonly snackbarService = inject(SnackBarService);

  deletingLoadingIndex = -1;

  savedThemes: CustomizationResponse[] = [];
  builtinThemes: CustomizationResponse[] = [];

  callbackFunc!: ModalComponentFunction<CustomizationResponse>;

  override init(model: { data?: CustomizationResponse[]; callbackFunc: ModalComponentFunction<CustomizationResponse>; }): void {
    if (model.data) {
      this.setThemes(model.data);
    }
    this.callbackFunc = model.callbackFunc;
  }

  onClose(theme?: CustomizationResponse) {
    this.callbackFunc(theme);
  }

  onDelete(id: number, index: number): void {
    this.deletingLoadingIndex = index;
    this.customizationService.delete(id).subscribe({
      next: res => {
        this.deletingLoadingIndex = -1;
        this.snackbarService.openSuccess("Tema excluido!");
        this.setThemes(res);
      },
      error: (res) => {
        this.deletingLoadingIndex = -1;
        if (res instanceof HttpErrorResponse && res.status === 409) {
          this.snackbarService.openError("Você não pode excluir um tema ativo!");
        } else {
          this.snackbarService.openError("Erro ao excluir tema!");
        }
      }
    });
  }

  private setThemes(themes: CustomizationResponse[]): void {
    this.builtinThemes = themes.filter(t => t.builtin);
    this.savedThemes = themes.filter(t => !t.builtin);
  }

}



