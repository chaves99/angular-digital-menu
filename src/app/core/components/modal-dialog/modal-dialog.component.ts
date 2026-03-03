import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogRef,
} from '@angular/material/dialog';
import { ModalDialogData } from './modal-dialog.service';
import { ThemeService } from '../..';

@Component({
  selector: 'app-modal-dialog',
  imports: [
    MatDialogActions,
    NgClass
  ],
  templateUrl: './modal-dialog.component.html'
})
export class ModalDialogComponent implements OnInit {

  private readonly dialogRef = inject(MatDialogRef<ModalDialogComponent>);
  private readonly themeService = inject(ThemeService);

  data = inject<ModalDialogData>(MAT_DIALOG_DATA);

  ngOnInit(): void {
  }

  public isDark(): boolean {
    return this.themeService.getTheme() === 'dark';
  }

  close(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}

