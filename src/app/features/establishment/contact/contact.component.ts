import { Component, inject, OnInit } from '@angular/core';
import { ContactResponse } from '../../../services/payload';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SnackBarService, SpinnerComponent } from '../../../core';
import { ContactService } from '../../../services';

@Component({
  selector: 'app-contact',
  imports: [
    ReactiveFormsModule,
    SpinnerComponent
  ],
  templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit {

  private readonly contactService = inject(ContactService);
  private readonly snackBarService = inject(SnackBarService);

  contact: ContactResponse | null = null;

  isLoading = false;

  form = new FormGroup({
    whatsapp: new FormControl(''),
    phone: new FormControl(''),
    facebook: new FormControl(''),
    instagram: new FormControl(''),
    website: new FormControl('')
  });

  ngOnInit(): void {
    this.isLoading = true;
    this.contactService.get().subscribe({
      next: res => {
        this.form.patchValue({
          whatsapp: res.whatsapp,
          phone: res.phone,
          facebook: res.facebook,
          instagram: res.instagram,
          website: res.website
        });
        this.isLoading = false;
      },
      error: res => {
        this.isLoading = false;
        this.snackBarService.openError("Erro ao carregar dados!");
      }
    });
  }

  onSubmit(): void {
    const { whatsapp, phone, facebook, instagram, website } = this.form.value;

    if (whatsapp !== undefined && phone !== undefined && facebook !== undefined
      && instagram !== undefined && website !== undefined) {
      this.isLoading = true;
      this.contactService.post({
        whatsapp: whatsapp,
        phone: phone,
        facebook: facebook,
        instagram: instagram,
        website: website
      }).subscribe({
        next: res => {
          this.snackBarService.openSuccess("Atualizado com sucesso!");
          this.isLoading = false;
        },
        error: res => {
          this.snackBarService.openError("Erro ao atualizar contatos!");
          this.isLoading = false;
        }
      });
    }
  }

}
