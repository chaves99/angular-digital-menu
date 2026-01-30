import { inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SnackbarComponent } from "./snackbar.component";

@Injectable({ providedIn: 'root' })
export class SnackBarService {

  private static readonly DEFAULT_DURATION = 3000;

  private readonly snackBar = inject(MatSnackBar);

  public openSuccess(msg: string, duration?: number) {
    const ref = this.snackBar.openFromComponent(SnackbarComponent, {
      horizontalPosition: 'end',
      panelClass: ['bg-body-tertiary', 'border', 'border-2', 'rounded', 'border-success'],
      duration: duration !== undefined ? duration : SnackBarService.DEFAULT_DURATION,
      data: {
        message: msg,
        dismiss: () => ref.dismiss()
      }
    });
    return ref;
  }

  public openError(msg: string, duration?: number) {
    const ref = this.snackBar.openFromComponent(SnackbarComponent, {
      horizontalPosition: 'end',
      panelClass: ['bg-body-tertiary', 'border', 'border-2', 'rounded', 'border-danger'],
      duration: duration !== undefined ? duration : SnackBarService.DEFAULT_DURATION,
      data: {
        message: msg,
        dismiss: () => ref.dismiss()
      }
    });
    return ref;
  }
}
