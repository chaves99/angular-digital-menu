import { inject, Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ModalDialogComponent } from "./modal-dialog.component";
import { InputModalDialogComponent } from "./input/input-modal-dialog.component";
import { ValidatorFn, Validators } from "@angular/forms";

@Injectable({ providedIn: 'root' })
export class ModalDialogService {

  private readonly matDialog = inject(MatDialog);

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
