import { Component, DOCUMENT, inject, OnInit, Renderer2 } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { ModalDialogService } from './core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  private readonly meta = inject(Meta);
  private readonly renderer = inject(Renderer2);
  private readonly titleService = inject(Title);
  private readonly document = inject(DOCUMENT);
  private readonly modalService = inject(ModalDialogService);

  title = 'ItiMenu - Menu Digital com QR Code';

  constructor() {
    this.modalService.overlayRefs.subscribe(value => {
      if (value.length > 0) {
        this.renderer.addClass(this.document.body, 'modal-open');
        this.document.body.style.overflow = "hidden";
      } else {
        this.renderer.removeClass(this.document.body, 'modal-open');
        this.document.body.style.overflow = "";
      }
      this.document.body.style.cursor = "";
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.addStructuredData();
  }

  addStructuredData() {
    this.meta.addTags([
      { name: 'description', content: 'Menu Digital com QR Code para restaurante, bares, padarias, etc... Atualize preços e produtos em segundos.' },
      { name: 'keywords', content: 'Menu Digital, Cardápio digital, QR Code, qrcode, QR code para restaurante, menu rapido' }
    ]);

    this.meta.addTags([
      { property: 'og:title', content: 'ItiMenu - Menu Digital por QR Code' },
      { property: 'og:description', content: 'Crie seu cardápio digital por QR Code grátis' },
      { property: 'og:url', content: 'https://itimenu.app' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'ItiMenu - Seu Menu Digital por QR Code' },
      { property: 'og:locale', content: 'pt_BR' },
      { property: 'og:image', content: 'logo/full_logo_black_whitebg.png' },
      { property: 'og:image:type', content: 'image/png' },
    ]);

    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = `
    {
      "@context": "http://schema.org",
      "@type": "Organization",
      "name": "Menu Digital QR Code",
      "url": "https://itimenu.app",
      "description": "Crie cardápios digitais e atualize em um click."
    }`;
    this.renderer.appendChild(this.document.head, script);
  }
}
