import { NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { disabled, email, form, FormField, validate } from '@angular/forms/signals';
import { SnackBarService, ThemeService } from '../../core';
import { EmailService, StorageService } from '../../services';

@Component({
  selector: 'app-contact',
  imports: [FormField, NgClass],
  templateUrl: './send-message.component.html',
  styles: `
    :host {
      display: block;
      margin-top: 0px;
      padding: 0px;
    }
  `
})
export class SendMessageComponent implements OnInit {

  private readonly storageService = inject(StorageService);
  private readonly emailService = inject(EmailService);
  private readonly snackbarService = inject(SnackBarService);

  themeSignal = inject(ThemeService).themeSignal;

  messageBody = signal({
    email: '',
    subject: '',
    message: ''
  });

  user = signal(this.storageService.getUser());

  form = form(this.messageBody, schemaPath => {
    email(schemaPath.email, { message: "E-mail obrigatório!" })
    validate(schemaPath.message, ({ value }) => {
      if (value() !== null && value().length > 0) {
        return null;
      }
      return { kind: 'validation', message: "Mensagem é obrigatório!" };
    });

    const user = this.user();
    if (user !== null) {
      this.messageBody.set({
        email: user.email,
        subject: this.messageBody().subject,
        message: this.messageBody().message
      });
      disabled(schemaPath.email);
    }
  });

  isLoading = false;

  ngOnInit(): void {
  }

  onSend(): void {
    if (!this.form().valid()) {
      this.snackbarService.openError("Preencha todos os campos obrigatórios");
      return;
    }
    const values = this.messageBody();
    this.emailService.sendUserMessage({ ...values, userEmail: values.email }).subscribe({
      next: () => {
        this.snackbarService.openSuccess("Mensagem enviada!");
        const u = this.user();
        if (u !== null) {
          this.form().reset({ subject: '', message: '', email: u.email });
        } else {
          this.form().reset({ subject: '', message: '', email: '' });
        }
      },
      error: () => {
        this.snackbarService.openError("Erro ao enviar mensagem!");
      }
    });
  }

}
