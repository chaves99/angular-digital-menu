import { Component, ComponentRef, inject, inputBinding, OnInit, outputBinding, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent, SnackBarService } from '../../../core';
import { AddressService } from '../../../services';
import { AddressResponse } from '../../../services/payload';

@Component({
  selector: 'app-address',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './address.component.html',
})
export class AddressComponent implements OnInit {

  private viewContainer = inject(ViewContainerRef);

  private readonly addressService = inject(AddressService);
  private readonly snackBarService = inject(SnackBarService);

  private modalComponentRef: ComponentRef<ModalComponent> | null = null;

  addresses: AddressResponse[] = [];

  addressFormGroup = new FormGroup({
    code: new FormControl(),
    line: new FormControl(),
    city: new FormControl()
  });

  ngOnInit(): void {
    this.addressService
      .getAll()
      .subscribe(a => {
        this.addressFormGroup.patchValue({
          city: a.city,
          code: a.code,
          line: a.line
        });
      });
  }

  onSubmit() {
    const { code, line, city } = this.addressFormGroup.value;
    if (code !== undefined && line !== undefined && city !== undefined) {
      this.addressService
        .create({ code: code, line: line, city: city })
        .subscribe({
          next: res => {
            this.snackBarService.openSuccess("Dados atualizados com sucesso!");
          },
          error: res => {
            console.log("Erro ao atualizar endereço");
          }
        });
    }
  }

  openDeleteModal(id: number) {
    this.modalComponentRef = this.viewContainer
      .createComponent(ModalComponent, {
        bindings: [
          inputBinding('title', () => 'Excluir endereço'),
          inputBinding('message', () => 'Tem certeza de que deseja excluir o endereço?'),
          outputBinding('close', () => {
            if (this.modalComponentRef !== null) {
              this.modalComponentRef.destroy();
            }
          }),
          outputBinding('confirm', () => {
          }),
        ]
      });
  }

}
