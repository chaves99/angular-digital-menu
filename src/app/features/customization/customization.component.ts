import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomerMenuComponent } from '@features/customer-menu/customer-menu.component';
import { ModalDialogService, SnackBarService } from 'app/core';
import { StorageService } from 'app/services';
import { CreateUserResponse } from 'app/services/payload';
import { ColorModalComponent } from './components/color-modal/color-modal.component';
import { ThemesModalComponent } from './components/themes-modal/themes-modal.component';
import { CustomizationResponse, CustomizationService } from './customization.service';

@Component({
  selector: 'app-customization',
  templateUrl: './customization.component.html',
  imports: [
    FormsModule,
    CustomerMenuComponent
  ],
})
export class CustomizationComponent implements OnInit {

  private readonly customizationService = inject(CustomizationService);
  private readonly storageService = inject(StorageService);
  private readonly modalService = inject(ModalDialogService);
  private readonly snackbarService = inject(SnackBarService);

  user: CreateUserResponse | null = null;

  wasCustomThemeFormValidated = false;

  customThemes: CustomizationResponse[] = [];

  isSaving = false;
  isApplyingActive = false;

  selectedTheme = signal<CustomizationResponse>(
    {
      id: -1,
      name: 'Padrão Claro',
      theme: 'LIGHT',
      active: true,
      builtin: true,
      mainColor: '#fff',
      secondaryColor: '#e9ecef',
      font: ''
    }
  );

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
    this.customizationService.getAll().subscribe({
      next: res => {
        this.customThemes = res;
        const activeOne = this.customThemes.find(t => t.active);
        if (activeOne) {
          this.selectedTheme.set(activeOne);
        }
      }
    });
  }

  onSelectFont(font: string) {
    this.selectedTheme.update(t => {
      return {
        ...t,
        font: font
      };
    });
  }

  onApplyingActive(): void {
    const theme = this.selectedTheme();
    if (theme.id === -1) {
      this.snackbarService.openError("Erro! Você deve salvar o tema para poder usar", 4500);
      return;
    }
    this.isApplyingActive = true;
    this.customizationService.setActive(theme.id)
      .subscribe({
        next: res => {
          this.isApplyingActive = false;
          this.snackbarService.openSuccess("Seu tema foi aplicado!");
          this.customThemes = res;
        },
        error: () => {
          this.isApplyingActive = false;
          this.isSaving = false;
          this.snackbarService.openError("Erro ao usar tema!");
        }
      });
  }

  onSave(): void {
    this.modalService.openDefaultInput({
      data: {
        message: 'Nome do tema',
        modalTitle: 'Salvar tema',
        fieldLabel: 'Nome do tema:',
        fieldPlaceholder: '',
        fieldValue: null,
        saveButtonText: 'Salvar'
      },
      callback: value => {
        if (value) {
          const selectedTheme = this.selectedTheme();
          if (selectedTheme !== null) {
            this.isSaving = true;
            this.customizationService.create({ ...selectedTheme, name: value })
              .subscribe({
                next: res => {
                  this.isSaving = false;
                  this.snackbarService.openSuccess("Tema cadastrado com sucesso!");
                  this.customThemes.push(res);
                  this.selectedTheme.set(res);
                },
                error: () => {
                  this.isSaving = false;
                  this.snackbarService.openError("Erro ao cadastrar tema!");
                }
              });
          }
        }
      }
    });
  }

  onOpenColorModal() {
    this.modalService.open({
      type: ColorModalComponent,
      data: this.selectedTheme(),
      callback: data => {
        if (data && (data.theme === 'DARK' || data.theme === 'LIGHT')) {
          this.selectedTheme.update(c => {
            return { ...c, mainColor: data.mainColor, secondaryColor: data.secondaryColor, theme: data.theme, id: -1 };
          });
        }
      }
    });
  }

  onOpenThemesModal(): void {
    this.modalService.open({
      type: ThemesModalComponent,
      data: this.customThemes,
      callback: data => {
        if (data) {
          this.selectedTheme.set(data);
        }
      }
    });
  }
}

type FontTypeGroup = {
  type: string;
  fonts: string[]
};



