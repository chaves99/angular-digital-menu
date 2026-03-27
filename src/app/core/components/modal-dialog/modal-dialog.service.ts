import { inject, Injectable } from "@angular/core";
import { ValidatorFn } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ThemeService } from "../../";
import { SubscriptionDetails } from "../../../services/payload";
import { CustomModalDialogComponent } from "./custom/custom-modal-dialog.component";
import { InputModalDialogComponent } from "./input/input-modal-dialog.component";
import { ModalDialogComponent } from "./modal-dialog.component";

@Injectable({ providedIn: 'root' })
export class ModalDialogService {

  private readonly matDialog = inject(MatDialog);
  private readonly themeService = inject(ThemeService);

  open(config: {
    message: string,
    subMessage?: string,
    title?: string,
    afterClose?: (v?: boolean) => void
  }) {
    const data: ModalDialogData = { ...config, isConfirmation: (config.afterClose !== undefined) };
    const ref = this.matDialog.open(ModalDialogComponent, {
      data: data,
    });
    ref.afterClosed().subscribe(value => {
      if (config.afterClose !== undefined) {
        config.afterClose(value)
      }
    });
  }

  openInput(data: InputModalDialogData) {
    const ref = this.matDialog.open(InputModalDialogComponent, {
      data: data,
      width: data.width
    });
    ref.afterClosed().subscribe(value => {
      if (data.onConfirm !== undefined && value) {
        data.onConfirm(value);
      }
    });
  }

  openCustom(config: {
    subscriptionDetail: SubscriptionDetails,
    afterClose?: () => void
  }) {
    const ref = this.matDialog.open(CustomModalDialogComponent, {
      data: config.subscriptionDetail,
      panelClass: ['']
    });
    ref.afterClosed().subscribe(() => {
      if (config.afterClose !== undefined) {
        config.afterClose()
      }
    });
  }

}

interface DefaultDialogProps {
  width?: string;
  height?: string;
}

export interface ModalDialogData extends DefaultDialogProps {
  message: string;
  subMessage?: string;
  title?: string;
  isConfirmation: boolean;
}

export interface InputModalDialogData extends DefaultDialogProps {
  message?: string;
  inputLabel?: string;
  inputValue?: string;
  inputPlaceholder?: string;
  validators?: ValidatorFn[];
  title?: string;
  confirmButtonText: string;
  onConfirm?: (value: any) => void;
}
