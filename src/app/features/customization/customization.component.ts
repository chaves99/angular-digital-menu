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
    this.fetchCustomization();
  }

  private fetchCustomization() {
    this.customizationService.getActive().subscribe({
      next: res => {
        this.selectedTheme.set(res);
      }
    })
  }

  onSelectFont(font: string) {
    this.selectedTheme.update(t => {
      return {
        ...t,
        id: -1,
        font: font
      };
    });
  }

  onSave(): void {
    if (this.selectedTheme().id === -1) {
      this.modalService.openDefaultInput({
        data: {
          message: 'Nome do tema',
          modalTitle: 'Salvar tema',
          fieldDescription: 'Nome do tema:',
          fieldPlaceholder: '',
          fieldValue: null,
          saveButtonText: 'Salvar'
        },
        callback: value => {
          if (value) {
            this.sendCustomizationRequest(value)
          }
        }
      });
    } else {
      this.sendCustomizationRequest(this.selectedTheme().name);
    }
  }

  public sendCustomizationRequest(name: string): void {
    const selectedTheme = this.selectedTheme();
    if (selectedTheme !== null) {
      this.isSaving = true;
      this.customizationService.create({ ...selectedTheme, name: name })
        .subscribe({
          next: res => {
            this.isSaving = false;
            this.snackbarService.openSuccess("Tema salvo com sucesso!");
            this.selectedTheme.set(res);
            this.fetchCustomization();
          },
          error: () => {
            this.isSaving = false;
            this.snackbarService.openError("Erro ao cadastrar tema!");
          }
        });
    }
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



