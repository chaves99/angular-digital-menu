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
    callback?: (v?: boolean) => void
  }) {
    this.open({
      type: ModalDialogComponent,
      ...config
    });
  }

  public openDefaultInput(params: {
    data: InputModalData,
    callback: ModalComponentFunction<string | null>
  }): void {
    this.open({
      type: InputModalDialogComponent,
      ...params
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
        if (params.callback) {
          params.callback(out);
        }
        this.closeModal();
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

