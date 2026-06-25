import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { inject, Injectable } from "@angular/core";
import { SnackBarComponent, SnackBarType } from "./snackbar.component";

@Injectable({ providedIn: 'root' })
export class SnackBarService {

  private static readonly DEFAULT_DURATION = 3000;

  private readonly overlay = inject(Overlay);

  private overlayRef: OverlayRef | null = null;
  // private componentRef: ComponentRef<> | null = null;

  public openSuccess(msg: string, duration?: number) {
    this.open(msg, 'SUCCESS', duration);
  }

  public openError(msg: string, duration?: number) {
    this.open(msg, 'ERROR', duration);
  }

  public open(msg: string, type: SnackBarType = 'DEFAULT', durationMili?: number) {
    if (this.overlayRef !== null) {
      this.overlayRef.detach();
    }

    this.overlayRef = this.overlay.create();

    const componentRef = this.overlayRef.attach(new ComponentPortal<SnackBarComponent>(SnackBarComponent));
    componentRef.instance.data = { message: msg, type: type };
    componentRef.instance.onClose.subscribe(() => this.closeToast());
    setTimeout(
      () => this.closeToast(),
      durationMili !== undefined ? durationMili : SnackBarService.DEFAULT_DURATION
    );
  }

  private closeToast() {
    if (this.overlayRef !== null) {
      this.overlayRef.detach();
      this.overlayRef = null;
    }
  }
}
