import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AddressService } from '../../services';

@Component({
  selector: 'app-config',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './config.component.html',
})
export class ConfigComponent implements OnInit {

  addressFormGroup = new FormGroup({ list: new FormArray([]) });

  private readonly addressService = inject(AddressService);

  ngOnInit(): void {
    this.addAddress();
  }

  onSubmitAddress() {
  }

  public addAddress(): void {
    let addressFormGroup = new FormGroup({
      code: new FormControl(),
      line: new FormControl(),
      city: new FormControl
    });
    this.addressForm.push(addressFormGroup);
  }

  public get addressControls(): AbstractControl[] {
    return this.addressForm.controls;
  }

  getFormGroupAtIndex(index: number) {
    return (this.addressControls[index] as FormGroup);
  }

  public get addressForm(): FormArray {
    return (this.addressFormGroup.get("list") as FormArray);
  }
}
