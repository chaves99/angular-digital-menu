import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { getEstablishmentUrl, SnackBarService } from '../../core';
import { StorageService, UserService } from '../../services';
import { CreateUserResponse } from '../../services/payload';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-account-data',
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './account-data.component.html'
})
export class AccountDataComponent implements OnInit {

  private readonly userService = inject(UserService);
  private readonly storageService = inject(StorageService);
  private readonly snackbarService = inject(SnackBarService);
  // private readonly navigator = inject(Navigator);

  newDescription: string | null = null;
  isLoadingDescCall = false;

  user: CreateUserResponse | null = null;

  ngOnInit(): void {
    this.user = this.storageService.getUser();
    if (this.user !== null) {
      this.newDescription = this.user.establishmentDescription;
    }
  }

  public getUrl(): string {
    return getEstablishmentUrl(this.user!.establishmentUrl);
  }

  public onCopyUrl(): void {
    console.log("onCopyUrl");
    navigator.clipboard.writeText(getEstablishmentUrl(this.user!.establishmentUrl));
    this.snackbarService.openSuccess("Copiado com sucesso!")
  }

  public onUpdateDescription(): void {
    if (this.newDescription !== null) {
      this.isLoadingDescCall = true;
      this.userService.updateDescription({ description: this.newDescription })
        .subscribe({
          next: (user) => {
            this.snackbarService.openSuccess("Descrição atualizada com sucesso!");
            this.storageService.storeUser(user);
            this.user = user;
            this.isLoadingDescCall = false;
          },
          error: () => {
            this.snackbarService.openError("Erro ao atualizar!");
            this.isLoadingDescCall = false;
          }
        });
    }
  }

  public hasDescriptionChange(): boolean {
    const currentDesc = this.user!.establishmentDescription;
    if (this.newDescription !== null && this.newDescription.trim() === "" && currentDesc === null) {
      return false;
    }
    return this.newDescription !== currentDesc;
  }

}
