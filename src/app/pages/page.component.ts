import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ThemeService } from '../core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

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

  isDarkTheme = false;

  ngOnInit(): void {
    this.themeService.setup();
    this.isDarkTheme = this.themeService.getTheme() === 'dark';
  }

  onThemeChange(): void {
    this.themeService.toggleTheme();
    this.isDarkTheme = this.themeService.getTheme() === 'dark';
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

}
