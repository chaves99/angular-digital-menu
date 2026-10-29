import { NgClass } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '../../../../core';

@Component({
  selector: 'app-modal-dialog',
  imports: [
    NgClass,
    ReactiveFormsModule
  ],
  templateUrl: './input-modal-dialog.component.html'
})
export class InputModalDialogComponent extends ModalComponent<string, string> implements AfterViewInit {

  @ViewChild('categoryInput')
  myInput!: ElementRef;

  data: string | null = null;

  formGroup = new FormGroup({
    value: new FormControl<string | null>(null)
  });
  isValid = true;

  ngAfterViewInit(): void {
    if (this.data !== null) {
      this.formGroup.controls.value.patchValue(this.data);
      this.myInput.nativeElement.focus();
    }
  }

  override initData(data?: string): void {
    this.data = data ?? null;
  }

  onSubmit(): void {
    this.isValid = true;
    const value = this.formGroup.value.value;
    if (!value || value.length == 0) {
      this.isValid = false;
      return;
    }
    super.onClose(value);
  }

}

export interface Output {
  confirm: boolean;
  value: string | null;
}
