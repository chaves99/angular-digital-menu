import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalDialogService, SnackBarService } from '../../core';
import { StorageService, UserService } from '../../services';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './password-recovery.component.html',
})
export class PasswordRecoveryComponent implements OnInit {

  private readonly STORE_KEY = "recovery_attempt";

  private readonly userService = inject(UserService);
  private readonly snackbarService = inject(SnackBarService);
  private readonly storageService = inject(StorageService);
  private readonly modalDialogService = inject(ModalDialogService);

  private readonly router = inject(Router);

  public phase: 'EMAIL' | 'TOKEN' | 'PASSWORD' = 'EMAIL';

  isLoading = false;

  emailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });
  isInputEmailInvalid = false;

  tokenForm = new FormGroup({
    token: new FormControl('', [Validators.required])
  });
  isTokenInputInvalid = false;

  passwordForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
    passwordConfirm: new FormControl('', [Validators.required])
  });
  isPasswordInputInvalid = false;
  isPasswordConfirmInputInvalid = false;

  ngOnInit(): void {
    const attempt = this.getAttempt();
    if (attempt != null) {
      if (this.isValidAttemptDate(attempt.date)) {
        this.phase = 'TOKEN';
      } else {
        this.storageService.delete(this.STORE_KEY);
      }
    }
  }

  public onSubmitCreateRecoveryCode(): void {
    const email = this.emailForm.controls.email;
    this.isInputEmailInvalid = false;
    if (email.errors != null || email.value === null) {
      this.isInputEmailInvalid = true;
      return;
    }

    this.isLoading = true;
    this.userService.generateRecoveryToken(email.value).subscribe({
      next: res => {
        if (email.value === null)
          return;
        this.phase = 'TOKEN';
        this.isLoading = false;
        const attempt: RecoveryPasswordAttempt = { email: email.value, date: new Date(), token: null };
        this.storageService.store(this.STORE_KEY, JSON.stringify(attempt));
        email.reset();
      },
      error: res => {
        this.isLoading = false;
        this.snackbarService.openError("Erro ao gerar token!")
      }
    });
  }

  public onSubmitValidateToken(): void {
    const token = this.tokenForm.controls.token;
    if (!token.valid || token.value === null) {
      this.isTokenInputInvalid = true;
      return;
    }

    const recoveryAttemptString = this.storageService.get(this.STORE_KEY);
    if (recoveryAttemptString === null) {
      this.snackbarService.openError("Erro ao resetar senha, por favor tente mais tarde ou assione o suporte")
      return;
    }

    const recoveryAttempt: RecoveryPasswordAttempt = JSON.parse(recoveryAttemptString);

    if (!this.isValidAttemptDate(recoveryAttempt.date)) {
      this.snackbarService.openError("Tempo expirado! Tente novamente.")
    }

    this.userService.validateToken(recoveryAttempt.email, token.value).subscribe({
      next: res => {
        this.phase = 'PASSWORD';
        const attempt = this.getAttempt();
        if (attempt !== null) {
          const updatedAttempt: RecoveryPasswordAttempt = { ...attempt, token: token.value };
          this.storageService.store(this.STORE_KEY, JSON.stringify(updatedAttempt));
        }
        this.tokenForm.reset();
      },
      error: res => {
        this.tokenForm.reset();
        if (res instanceof HttpErrorResponse && res.status === 401) {
          this.snackbarService.openError("Invalido!.")
          return;
        }
        this.snackbarService.openError("Erro ao resetar senha, por favor tente mais tarde.")
      }
    })
  }

  tokenPhaseCancel() {
    this.storageService.delete(this.STORE_KEY);
    this.phase = 'EMAIL';
  }

  private isValidAttemptDate(dateString: Date): boolean {
    const date = new Date(dateString);

    const now: Date = new Date();

    return this.differenceInMinutes(now, date) < 5;
  }

  private differenceInMinutes(date1: Date, date2: Date): number {
    const diffInMilliseconds = Math.abs(date2.getTime() - date1.getTime());
    const diffInSeconds = diffInMilliseconds / 1000;
    const diffInMinutes = diffInSeconds / 60;
    return Math.round(diffInMinutes);
  }

  onSubmitPasswordReset(): void {
    this.isPasswordConfirmInputInvalid = false;
    if (!this.isPasswordConfirmValid()) {
      this.isPasswordConfirmInputInvalid = true;
      return;
    }

    const attemptData = this.getAttempt();
    if (attemptData === null || attemptData.token === null) {
        this.snackbarService.openError("Erro ao resetar senha, por favor tente mais tarde.")
        return;
    }

    this.isLoading = true;
    this.userService.resetPassword(this.passwordForm.value.password!, attemptData.token, attemptData.email)
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.modalDialogService.open({
              message: "Senha atualizada com sucesso!",
              afterClose: () => {
                this.router.navigateByUrl("/login");
              }
            })
          },
          error: () => {
            this.isLoading = false;
            this.snackbarService.openError("Erro ao resetar senha, por favor tente mais tarde.")
          }
        })
  }

  isPasswordConfirmValid() {
    const { password, passwordConfirm } = this.passwordForm.controls;

    if (!passwordConfirm.valid && passwordConfirm.value !== null && passwordConfirm.value.length > 0) {
      return false;
    }

    if (password.value !== passwordConfirm.value) {
      return false;
    }
    return true;
  }

  private getAttempt(): RecoveryPasswordAttempt | null {
    const emailAttempt = this.storageService.get(this.STORE_KEY);
    if (emailAttempt == null || emailAttempt == undefined || emailAttempt.length === 0) {
      return null;
    }
    const attempt: RecoveryPasswordAttempt = JSON.parse(emailAttempt);
    return attempt;
  }
}

interface RecoveryPasswordAttempt {
  email: string;
  date: Date;
  token: string | null;
}
