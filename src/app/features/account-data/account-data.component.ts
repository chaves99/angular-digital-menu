import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { getEstablishmentUrl, ModalDialogService, SnackBarService } from '../../core';
import { StorageService, UserService } from '../../services';
import { CreateUserResponse } from '../../services/payload';

@Component({
  selector: 'app-account-data',
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './account-data.component.html'
})
export class AccountDataComponent implements OnInit {

  private readonly userService = inject(UserService);
  private readonly storageService = inject(StorageService);
  private readonly snackbarService = inject(SnackBarService);
  private readonly modalService = inject(ModalDialogService);

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

  public onDeleteAccount(): void {
    this.modalService.openDefaultInput({
      data: {
        modalTitle: "Exclusão de conta.",
        message: "Digite sua senha para confirmar a exclusão da sua conta.",
        fieldLabel: "Senha: ",
        saveButtonText: "Confirmar",
        fieldPlaceholder: "Senha",
        fieldValue: null,
        fieldType: 'password'
      },
      callback: output => {
        if(output) {
        }
      }
    });
  }

}
