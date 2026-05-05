import { Component, inject, OnInit, signal } from '@angular/core';
import { CustomerMenuComponent, Theme } from '@features/customer-menu/customer-menu.component';
import { CustomizationService } from './customization.service';
import { StorageService } from 'app/services';
import { CreateUserResponse } from 'app/services/payload';
import { form, FormField, FormRoot } from '@angular/forms/signals';

@Component({
  selector: 'app-customization',
  templateUrl: './customization.component.html',
  imports: [CustomerMenuComponent, FormField, FormRoot],
})
export class CustomizationComponent implements OnInit {

  private readonly customizationService = inject(CustomizationService);
  private readonly storageService = inject(StorageService);

  user: CreateUserResponse | null = null;

  customThemeForm = form(
    signal({ type: '', mainColor: '', secondaryColor: '' }),
    {
      submission: {
        action: async (field) => {
          console.log(field().value());
          const { mainColor, secondaryColor, type } = field().value();
          this.selectedTheme = {
            font: this.selectedTheme.font,
            mainColor: mainColor,
            secondaryColor: secondaryColor,
            type: type as 'DARK' | 'LIGHT'
          };
        }
      }
    }
  );

  themesDefault: Theme[] = [
    // dark
    {
      name: 'Padrão Escuro',
      type: 'DARK',
      mainColor: '#343a40',
      secondaryColor: '#495057',
      font: null
    },
    // light
    {
      name: 'Padrão Claro',
      type: 'LIGHT',
      mainColor: '#fff',
      secondaryColor: '#e9ecef',
      font: null
    }
  ];
  selectedTheme: Theme = this.themesDefault[0];

  fonts: FontTypeGroup[] = [
    {
      type: 'sans-serif',
      fonts: [
        "Google Sans",
        "Noto Sans",
        "Raleway",
        "Ubuntu",
        "Work Sans",
        "Quicksand",
        "Outfit",
        "Bebas Neue",
        "Stack Sans Notch",
        "Limelight"
      ]
    },
    {
      type: 'serif',
      fonts: [
        "Playfair Display",
        "Merriweather",
        "Lora",
        "Cinzel Decorative",
        "Gravitas One",
        "Crimson Text"
      ]
    },
    {
      type: 'cursive',
      fonts: [
        "Playwrite NO",
        "Playwrite DE SAS",
        "UnifrakturMaguntia",
        "Ephesis",
        "Cause",
        "Mea Culpa",
        "Monsieur La Doulaise"
      ]
    },
    {
      type: 'system-ui',
      fonts: [
        "Stardos Stencil"
      ]
    }
  ];

  ngOnInit(): void {
    this.user = this.storageService.getUser();
  }

  onSetNewTheme(theme: Theme) {
    this.selectedTheme = { ...theme, font: this.selectedTheme.font };
  }

  onSelectFont(font: string) {
    this.selectedTheme = { ...this.selectedTheme, font: font };
  }
}

type FontTypeGroup = {
  type: string;
  fonts: string[]
};



