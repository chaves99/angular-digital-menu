import { ComponentType, Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { ComponentRef, inject, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { InputModalData, InputModalDialogComponent } from "./modal-dialog-input.component";
import { ModalDialogComponent } from "./modal-dialog.component";
import { ModalComponent, ModalComponentFunction, ModalDialogData } from "./types";

@Injectable({ providedIn: 'root' })
export class ModalDialogService {

  private readonly overlay = inject(Overlay);

  overlayRefs = new BehaviorSubject<OverlayRef[]>([]);

  openDefault(config: {
    data: ModalDialogData,
    afterClose?: (v?: boolean) => void
  }) {
    const component = this.openComponent(ModalDialogComponent).instance;
    component.data = { ...config.data };

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
    const newOverlay: OverlayRef = this.overlay.create();
    const value = this.overlayRefs.getValue();
    value.push(newOverlay);
    this.overlayRefs.next(value);
    return newOverlay.attach(new ComponentPortal<T>(component));
  }

  private closeModal() {
    const refList = this.overlayRefs.getValue();
    const lastRef: OverlayRef | undefined = refList.pop();
    if (lastRef) {
      lastRef.detach();
    }
    this.overlayRefs.next(refList);
  }

}

