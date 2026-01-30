import { Component, inject, OnInit } from '@angular/core';
import { ContactService } from '../../../services/contact.service';
import { ContactResponse } from '../../../services/payload';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SnackBarService } from '../../../core';

@Component({
  selector: 'app-contact',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit {

  private readonly contactService = inject(ContactService);
  private readonly snackBarService = inject(SnackBarService);

  contact: ContactResponse | null = null;

  form = new FormGroup({
    whatsapp: new FormControl(''),
    phone: new FormControl(''),
    facebook: new FormControl(''),
    instagram: new FormControl(''),
    website: new FormControl('')
  });

  ngOnInit(): void {
    this.contactService.get().subscribe({
      next: res => {
        this.form.patchValue({
          whatsapp: res.whatsapp,
          phone: res.phone,
          facebook: res.facebook,
          instagram: res.instagram,
          website: res.website
        });
      },
      error: res => {
        console.log("Handling error locally");
        console.log(res);
      }
    });
  }

  onSubmit(): void {
    const { whatsapp, phone, facebook, instagram, website } = this.form.value;

    if (whatsapp !== undefined && phone !== undefined && facebook !== undefined
      && instagram !== undefined && website !== undefined) {
      this.contactService.post({
        whatsapp: whatsapp,
        phone: phone,
        facebook: facebook,
        instagram: instagram,
        website: website
      }).subscribe({
        next: res => {
          this.snackBarService.openSuccess("Atualizado com sucesso!");
        },
        error: res => {
          this.snackBarService.openError("Erro ao atualizar contatos!");
        }
      });
    }
  }

}
