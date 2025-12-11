import { Component, inject, OnInit, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AddressService } from '../../services';
import { AddressResponse } from '../../services/payload';
import { ModalComponent } from '../../core';

@Component({
  selector: 'app-address',
  imports: [
    ModalComponent,
    ReactiveFormsModule
  ],
  templateUrl: './address.component.html',
})
export class AddressComponent implements OnInit {

  private viewContainer = inject(ViewContainerRef);

  private readonly addressService = inject(AddressService);

  addresses: AddressResponse[] = [];

  addressFormGroup = new FormGroup({
    code: new FormControl(),
    line: new FormControl(),
    city: new FormControl()
  });

  ngOnInit(): void {
    // this.addressService.getAll().subscribe(a => this.addresses = a);
  }

  onSubmit() {
    console.log("submiting");
    this.viewContainer.createComponent(ModalComponent, {

    });
  }

  openDeleteModal(id: number) {
    console.log(id);
  }

}
