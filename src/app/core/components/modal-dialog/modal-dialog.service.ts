import { ComponentType, Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { ComponentRef, inject, Injectable } from "@angular/core";
import { InputModalData, InputModalDialogComponent } from "./modal-dialog-input.component";
import { ModalDialogComponent } from "./modal-dialog.component";
import { ModalComponent, ModalComponentFunction } from "./types";

@Injectable({ providedIn: 'root' })
export class ModalDialogService {

  private readonly overlay = inject(Overlay);
  private overlayRef: OverlayRef | null = null;

  openDefault(config: {
    message: string,
    subMessage?: string,
    title?: string,
    afterClose?: (v?: boolean) => void
  }) {
    const component = this.openComponent(ModalDialogComponent).instance;
    component.data = { ...config };

    component.onClose.subscribe((value) => {
      this.closeModal()
      if (config.afterClose !== undefined) {
        config.afterClose(value);
      }
    });
  }

  public openDefaultInput(params: {
    data: InputModalData,
    callback: ModalComponentFunction<string | null>
  }): void {
    const ref = this.openComponent(InputModalDialogComponent);
    const component = ref.instance;

    component.init({
      data: params.data,
      callbackFunc: out => {
        this.closeModal();
        if (params.callback) {
          params.callback(out);
        }
      }
    });
  }

  public open<IN, OUT>(params: {
    type: ComponentType<ModalComponent<IN, OUT>>,
    data?: IN,
    callback?: ModalComponentFunction<OUT>
  }): void {
    const ref = this.openComponent(params.type);
    const component = ref.instance;

    component.init({
      data: params.data,
      callbackFunc: out => {
        this.closeModal();
        if (params.callback) {
          params.callback(out);
        }
      }
    });
  }

  private openComponent<T>(component: ComponentType<T>): ComponentRef<T> {
    if (this.overlayRef !== null) {
      this.overlayRef.detach();
    }
    this.overlayRef = this.overlay.create();
    return this.overlayRef.attach(new ComponentPortal<T>(component));
  }

  private closeModal() {
    if (this.overlayRef !== null) {
      this.overlayRef.detach();
      this.overlayRef = null;
    }
  }

}


