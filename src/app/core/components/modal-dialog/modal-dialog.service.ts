import { ComponentType, Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { ComponentRef, inject, Injectable } from "@angular/core";
import { ModalDialogComponent } from "./modal-dialog.component";

@Injectable({ providedIn: 'root' })
export class ModalDialogService {

  private readonly overlay = inject(Overlay);
  private overlayRef: OverlayRef | null = null;

  open(config: {
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

  public openGeneric<IN, OUT>(params: {
    type: ComponentType<ModalComponent<IN, OUT>>,
    data?: IN,
    callback?: ModalComponentFunction<OUT>
  }): void {
    const ref = this.openComponent(params.type);
    const component = ref.instance;

    console.log("openGeneric");
    console.log(params);
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

export abstract class ModalComponent<IN, OUT> {

  abstract init(model: { data?: IN, callbackFunc: ModalComponentFunction<OUT> }): void;
}

export type ModalComponentFunction<OUT> = (r?: OUT) => void;

export interface ModalDialogData {
  message: string;
  subMessage?: string;
  title?: string;
}

