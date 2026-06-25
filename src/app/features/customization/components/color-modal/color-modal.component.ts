import { Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { CustomizationResponse } from '@features/customization/customization.service';
import { ModalComponent, ModalComponentFunction, ModalDialogService } from 'app/core';

@Component({
  selector: 'app-color-modal',
  imports: [FormField, FormRoot],
  templateUrl: './color-modal.component.html',
  providers: [ModalDialogService]
})
export class ColorModalComponent extends ModalComponent<CustomizationResponse, Theme> {

  callbackFunc!: ModalComponentFunction<Theme>;

  themeModel = signal({
    mainColor: '#ffffff',
    secondaryColor: '#ffffff',
    mode: ''
  });

  themeForm = form(this.themeModel, (sp) => {
    required(sp.mainColor);
    required(sp.secondaryColor);
    required(sp.mode);
  }, {
    submission: {
      action: async (field) => {
        const { mainColor, secondaryColor, mode } = field().value();
        if (mode === 'DARK' || mode === 'LIGHT') {
          const theme: Theme = {
            mainColor: mainColor,
            secondaryColor: secondaryColor,
            theme: mode,
          };
          this.callbackFunc(theme);
        }
      },
      onInvalid: (field) => {
        const firstError = field().errorSummary()[0];
        firstError?.fieldTree().focusBoundControl();
      }
    }
  });

  override init(model: { data?: CustomizationResponse | undefined; callbackFunc: ModalComponentFunction<Theme>; }): void {
    this.callbackFunc = model.callbackFunc;
    if (model.data) {
      this.themeModel.set({
        mainColor: model.data.mainColor,
        secondaryColor: model.data.secondaryColor,
        mode: model.data.theme
      });
    }
  }

  onClose() {
    this.callbackFunc();
  }

}

type Theme = { mainColor: string, secondaryColor: string, theme: 'DARK' | 'LIGHT' };

