import { inject, Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ModalDialogComponent } from "./modal-dialog.component";

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

}

export interface ModalDialogData {
  message: string;
  subMessage?: string;
  title?: string;
  isConfirmation: boolean;
}
