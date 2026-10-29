import { NgClass } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent, ModalComponentFunction } from './types';

@Component({
  selector: 'app-dialog-input',
  templateUrl: './modal-dialog-input.component.html',
  imports: [
    ReactiveFormsModule,
    NgClass
  ]
})
export class InputModalDialogComponent extends ModalComponent<InputModalData, string> implements AfterViewInit {

  @ViewChild('fieldInput')
  myInput!: ElementRef;

  data: InputModalData | null = null;

  formGroup = new FormGroup({
    value: new FormControl<string | null>(null)
  });
  isValid = true;

  ngAfterViewInit(): void {
    if (this.data !== null && this.data.fieldValue !== null) {
      this.formGroup.controls.value.patchValue(this.data.fieldValue);
    }
    this.myInput.nativeElement.focus();
  }

  override initData(data?: InputModalData): void {
    this.data = data ?? null;
  }

  onSubmit(): void {
    this.isValid = true;
    const value = this.formGroup.value.value;
    if (!value || value.length == 0) {
      this.isValid = false;
      return;
    }
    this.onClose(value);
  }

}

export interface InputModalData {
  modalTitle: string;
  saveButtonText: string;
  message: string;
  fieldDescription: string;
  fieldPlaceholder: string;
  fieldValue: string | null;
  inputType?: 'text' | 'password' | 'email';
}
