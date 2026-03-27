import { DatePipe, NgClass } from '@angular/common';
import { Component, DOCUMENT, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ThemeService } from '../../..';
import { SubscriptionDetails } from '../../../../services/payload';
import { ModalDialogComponent } from '../modal-dialog.component';

@Component({
  selector: 'app-custom-modal-dialog',
  imports: [
    NgClass,
    DatePipe
  ],
  templateUrl: './custom-modal-dialog.component.html'
})
export class CustomModalDialogComponent implements OnInit {

  private readonly dialogRef = inject(MatDialogRef<ModalDialogComponent>);
  private readonly themeService = inject(ThemeService);
  private readonly document = inject(DOCUMENT);

  data = inject<SubscriptionDetails>(MAT_DIALOG_DATA);

  ngOnInit(): void {
  }

  public isDark(): boolean {
    return this.themeService.getTheme() === 'dark';
  }

  close(): void {
    this.dialogRef.close();
  }

}
