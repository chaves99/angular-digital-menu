import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogRef
} from '@angular/material/dialog';
import { InputModalDialogData, ThemeService } from '../../../';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-dialog',
  imports: [
    MatDialogActions,
    NgClass,
    ReactiveFormsModule
  ],
  templateUrl: './input-modal-dialog.component.html'
})
export class InputModalDialogComponent implements OnInit {

  private readonly dialogRef = inject(MatDialogRef<InputModalDialogComponent>);
  private readonly themeService = inject(ThemeService);

  data = inject<InputModalDialogData>(MAT_DIALOG_DATA);

  formGroup = new FormGroup({
    value: new FormControl()
  });
  isValid = true;

  ngOnInit(): void {
    if (this.data.inputValue) {
      this.formGroup.controls.value.patchValue(this.data.inputValue);
    }
    if (this.data.validators) {
      this.data.validators.forEach(validator => this.formGroup.controls.value.addValidators(validator));
    }
  }

  public isDark(): boolean {
    return this.themeService.getTheme() === 'dark';
  }

  onSubmit(): void {
    this.isValid = true;
    if(this.formGroup.invalid) {
      this.isValid = false;
      return;
    }
    this.dialogRef.close(this.formGroup.value.value);
  }

  close(): void {
    this.dialogRef.close();
  }

}
