import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SnackBarService } from 'app/core';
import { StorageService, UserService } from 'app/services';

@Component({
  selector: 'app-wifi',
  imports: [ReactiveFormsModule],
  templateUrl: './wifi.component.html',
})
export class WifiComponent implements OnInit {

  private readonly storageService = inject(StorageService);
  private readonly userService = inject(UserService);
  private readonly snackbarService = inject(SnackBarService);

  isLoading = false;

  formGroup = new FormGroup({
    name: new FormControl(),
    password: new FormControl(),
  });


  ngOnInit(): void {
    const user = this.storageService.getUser();
    if (user !== null) {
      if (user.wifiName) {
        this.formGroup.controls.name.setValue(user.wifiName);
      }
      if (user.wifiPassword) {
        this.formGroup.controls.password.setValue(user.wifiPassword);
      }
    }
  }

  onSubmit(): void {
    this.isLoading = true;
    this.userService.updateWifi(this.formGroup.value).subscribe({
      next: res => {
        this.storageService.storeUser(res);
        this.snackbarService.openSuccess("Wi-fi atualizado com sucesso.");
        this.isLoading = false;
      },
      error: () => {
        this.snackbarService.openError("Erro ao salvar wi-fi!");
        this.isLoading = false;
      }
    });
  }
}
