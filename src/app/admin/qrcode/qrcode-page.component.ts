import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { StorageService } from '../../services';
import { CreateUserResponse } from '../../services/payload';
import { QRCodeComponent } from 'angularx-qrcode';
import { FormsModule } from '@angular/forms';

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

  localName: string | null = null;

  // QRCODE PROPERTIES
  backgroundColor = "#ffffff";
  foregroundColor = "#000000";
  qrcodeImage: File | undefined;
  qrcodeMargin: number = 1;

  user: CreateUserResponse | null = null;

  @ViewChild('qrCodeElement', { read: ElementRef })
  qrCodeElement!: ElementRef;

  ngOnInit(): void {
    this.user = this.storageService.getUser();
    if (this.user != null) {
      this.user.establishmentName

    }
  }

  onImageChange(event: any) {
    this.qrcodeImage = event.target.files[0];
  }

  saveAsImage() {
    const parentElement = this.qrCodeElement.nativeElement.querySelector('canvas').toDataURL('image/png')
    if (parentElement) {
      const blobData = this.convertBase64ToBlob(parentElement)
      const blob = new Blob([blobData], { type: 'image/png' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'angularx-qrcode' // naming file
      link.click()
    }
  }

  private convertBase64ToBlob(Base64Image: string) {
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
