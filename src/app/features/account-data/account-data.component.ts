import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { getEstablishmentUrl, ModalDialogService, SnackBarService } from '../../core';
import { StorageService, UserService } from '../../services';
import { CreateUserResponse } from '../../services/payload';

@Component({
  selector: 'app-account-data',
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './account-data.component.html'
})
export class AccountDataComponent implements OnInit {

  private readonly router = inject(Router);

  private readonly userService = inject(UserService);
  private readonly storageService = inject(StorageService);
  private readonly snackbarService = inject(SnackBarService);
  private readonly modalService = inject(ModalDialogService);

  newDescription: string | null = null;
  isLoadingDescCall = false;
  isLoadingDeleteAccount = false;

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
        message: 'Após confirmar, todos os seus dados serão excluidos permanentemente.',
        fieldPlaceholder: '',
        inputType: 'password',
        saveButtonText: 'Excluir',
        modalTitle: 'Excluir Conta',
        fieldDescription: 'Senha: ',
        fieldValue: null,
      },
      callback: out => {
        if (out != null) {
          this.userService.deleteAccount(out).subscribe({
            next: () => {
              this.modalService.openDefault({
                message: "Conta excluida com sucesso!",
                afterClose: () => {
                  this.storageService.cleanUser();
                  this.router.navigateByUrl('/');
                },
              });
            },
            error: () => {
              this.snackbarService.openError("Erro ao excluir conta, tente novamente mais tarde.");
            }
          });
        }
      }
    });
  }

}
