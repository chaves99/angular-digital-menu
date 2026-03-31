import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ThemeService } from '../core';
import { StorageService } from '../services';
import { CreateUserResponse } from '../services/payload';

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
  private readonly storageService = inject(StorageService);

  user: CreateUserResponse | null = null;

  isDarkTheme = false;

  ngOnInit(): void {
    this.themeService.setup();
    this.isDarkTheme = this.themeService.getTheme() === 'dark';
    this.user = this.storageService.getUser();
  }

  onThemeChange(): void {
    this.themeService.toggleTheme();
    this.isDarkTheme = this.themeService.getTheme() === 'dark';
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  public logout(): void {
    this.storageService.cleanUser();
    this.user = null;
  }

}
