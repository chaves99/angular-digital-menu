import { NgClass } from '@angular/common';
import { Component, DOCUMENT, inject, OnInit, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meta } from '@angular/platform-browser';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ThemeService } from '../core';

@Component({
  selector: 'app-initial-page',
  imports: [
    RouterLink,
    RouterOutlet,
    FormsModule,
    NgClass
  ],
  templateUrl: './page.component.html',
})
export class PageComponent implements OnInit {

  private readonly themeService = inject(ThemeService);
  private readonly meta = inject(Meta);
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);

  isDarkTheme = false;

  ngOnInit(): void {
    this.addStructuredData();

    this.themeService.setup();
    this.isDarkTheme = this.themeService.getTheme() === 'dark';
  }

  addStructuredData() {

    this.meta.addTags([
      { name: 'description', content: 'Menu Digital QR Code para restaurante, bares, padarias, etc...' },
      { name: 'keywords', content: 'Menu Digital, Cardápio digital, QR Code, qrcode' }
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

  onThemeChange(): void {
    this.themeService.toggleTheme();
    this.isDarkTheme = this.themeService.getTheme() === 'dark';
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

}
