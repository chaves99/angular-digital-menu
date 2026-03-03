import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SnackBarService, SpinnerComponent } from '../../../core';
import { AddressService } from '../../../services';
import { AddressResponse } from '../../../services/payload';

@Component({
  selector: 'app-address',
  imports: [
    ReactiveFormsModule,
    SpinnerComponent
  ],
  templateUrl: './address.component.html',
})
export class AddressComponent implements OnInit {

  private readonly addressService = inject(AddressService);
  private readonly snackBarService = inject(SnackBarService);

  addresses: AddressResponse[] = [];
  isLoading = true;

  addressFormGroup = new FormGroup({
    code: new FormControl(),
    line: new FormControl(),
    city: new FormControl()
  });

  ngOnInit(): void {
    this.isLoading = true;
    this.addressService
      .getAll()
      .subscribe({
        next: a => {
          this.addressFormGroup.patchValue({
            city: a.city,
            code: a.code,
            line: a.line
          });
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.snackBarService.openError("Erro ao carregar dados!");
        }
      });
  }

  onSubmit() {
    const { code, line, city } = this.addressFormGroup.value;
    if (code !== undefined && line !== undefined && city !== undefined) {
      this.isLoading = true;
      this.addressService
        .create({ code: code, line: line, city: city })
        .subscribe({
          next: res => {
            this.isLoading = false;
            this.snackBarService.openSuccess("Dados atualizados com sucesso!");
          },
          error: res => {
            this.isLoading = false;
            this.snackBarService.openError("Erro ao atualizar endereço!");
          }
        });
    }
  }
}
