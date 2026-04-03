import { Component, inject, OnInit, signal } from '@angular/core';
import { disabled, email, form, FormField, required, validate } from '@angular/forms/signals';
import { EmailService, StorageService } from '../../services';
import { SnackBarService } from '../../core';

@Component({
  selector: 'app-contact',
  imports: [FormField],
  templateUrl: './send-message.component.html'
})
export class SendMessageComponent implements OnInit {

  private readonly storageService = inject(StorageService);
  private readonly emailService = inject(EmailService);
  private readonly snackbarService = inject(SnackBarService);

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
      return { kind: 'validation' }
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

    console.log("onSend: valid:" + this.form().valid);
      this.snackbarService.openError("Preencha todos os campos obrigatórios");
    if (!this.form().valid) {
      console.log("onSend");
      this.snackbarService.openError("Preencha todos os campos obrigatórios");
      return;
    }
    const { email, subject, message } = this.messageBody();
  }

}
