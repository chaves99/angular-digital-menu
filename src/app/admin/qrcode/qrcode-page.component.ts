import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QRCodeComponent } from 'angularx-qrcode';
import { SnackBarService } from '../../core';
import { EmailService, StorageService } from '../../services';
import { CreateUserResponse } from '../../services/payload';

@Component({
  selector: 'app-category',
  imports: [
    QRCodeComponent,
    FormsModule
  ],
  templateUrl: './qrcode-page.component.html',
})
export class QrcodePageComponent implements OnInit {

  private readonly storageService = inject(StorageService);
  private readonly emailService = inject(EmailService);
  private readonly snackbarService = inject(SnackBarService);

  localName: string | null = null;

  // QRCODE PROPERTIES
  backgroundColor = "#ffffff";
  foregroundColor = "#000000";
  qrcodeMargin: number = 1;

  user: CreateUserResponse | null = null;

  @ViewChild('qrCodeElement', { read: ElementRef })
  qrCodeElement!: ElementRef;

  ngOnInit(): void {
    this.user = this.storageService.getUser();
    if (this.user != null) {
      this.localName = `https://itimenu.app/${this.user.establishmentUrl}`;
    }
  }

  onSaveAsImage() {
    const parentElement = this.qrCodeElement.nativeElement.querySelector('canvas').toDataURL('image/png')
    if (parentElement) {
      const blobData = this.convertBase64ToBlob(parentElement)
      const blob = new Blob([blobData], { type: 'image/png' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = this.localName + '_qrcode' // naming file
      link.click()
    }
  }

  onSendEmail(): void {
    const parentElement = this.qrCodeElement.nativeElement.querySelector('canvas').toDataURL('image/png')
    if (parentElement) {
      const blobData = this.convertBase64ToBlob(parentElement)
      const blob = new Blob([blobData], { type: 'image/png' })
      const formData = new FormData();
      formData.append("qrcode_image", blob);
      this.emailService.sendQRcode(formData)
        .subscribe({
          next: () => {
            this.snackbarService.openSuccess("E-mail enviado. Chegara em alguns instantes.");
          },
          error: () => {
            this.snackbarService.openError("Erro ao enviar email!");
          }
        });
    }
  }

  reset(): void {
    this.backgroundColor = "#ffffff";
    this.foregroundColor = "#000000";
    this.qrcodeMargin = 1;
  }

  private convertBase64ToBlob(Base64Image: string): Blob {
    const parts = Base64Image.split(';base64,')
    const imageType = parts[0].split(':')[1]
    const decodedData = window.atob(parts[1])
    const uInt8Array = new Uint8Array(decodedData.length)
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i)
    }
    return new Blob([uInt8Array], { type: imageType })
  }
}
