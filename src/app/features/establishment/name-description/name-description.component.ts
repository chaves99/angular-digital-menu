import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SnackBarService } from 'app/core';
import { StorageService, UserService } from 'app/services';

@Component({
  selector: 'app-name-description',
  templateUrl: './name-description.component.html',
  imports: [
    ReactiveFormsModule,
  ]
})
export class NameDescriptionComponent implements OnInit {

  private readonly userService = inject(UserService);
  private readonly snackbarService = inject(SnackBarService);
  private readonly storageService = inject(StorageService);


  formGroup = new FormGroup({
    name: new FormControl(),
    description: new FormControl(),
  });

  isLoading = false;

  ngOnInit(): void {
    const user = this.storageService.getUser();
    if (user !== null) {
      const { name, description } = this.formGroup.controls;
      name.setValue(user.establishmentName);
      description.setValue(user.establishmentDescription);
    }
  }

  onSubmit(): void {
    const { name, description } = this.formGroup.value;
    this.isLoading = true;
    this.userService.update({ establishmentName: name, description: description })
      .subscribe({
        next: (user) => {
          this.snackbarService.openSuccess("Descrição atualizada com sucesso!");
          this.storageService.storeUser(user);
          this.isLoading = false;
        },
        error: () => {
          this.snackbarService.openError("Erro ao atualizar!");
          this.isLoading = false;
        }
      });
  }
}
