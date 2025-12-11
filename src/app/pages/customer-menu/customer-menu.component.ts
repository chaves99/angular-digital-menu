import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-customer-menu',
  imports: [
    QRCodeComponent,
  ],
  templateUrl: './customer-menu.component.html'
})
export class CustomerMenuComponent implements OnInit {

  private readonly activatedRoute = inject(ActivatedRoute);

  @ViewChild('qrCodeElement', { read: ElementRef })
  qrCodeElement!: ElementRef;

  localName = "http://localhost:4200/customer-menu/";

  ngOnInit(): void {
    this.activatedRoute.params
      .subscribe(param => {
        const localName = param['localName'];
        this.localName += localName;
        console.log(localName);
      });
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
