import { DOCUMENT, inject, Injectable, signal, WritableSignal } from "@angular/core";
import { StorageService } from "../services";

@Injectable({ providedIn: 'root' })
export class ThemeService {

  readonly themeSignal: WritableSignal<'light' | 'dark'> = signal('light');

  private readonly STORAGE_KEY = "theme";

  private readonly storageService = inject(StorageService);
  private readonly document = inject(DOCUMENT);

  public setup() {
    const dataTheme = this.storageService.get(this.STORAGE_KEY);
    if (dataTheme === null) {
      this.setLightTheme();
      return;
    }
    if (dataTheme === 'light' || dataTheme === 'dark') {
      this.themeSignal.set(dataTheme);
    }
    this.document.documentElement.setAttribute('data-bs-theme', dataTheme);
  }

  private setLightTheme() {
    this.storageService.store(this.STORAGE_KEY, 'light');
    this.document.documentElement.setAttribute('data-bs-theme', 'light');
    this.themeSignal.set('light');
  }

  public getTheme(): 'light' | 'dark' {
    const dataTheme = this.storageService.get(this.STORAGE_KEY);
    if (dataTheme !== null
      && (dataTheme === 'light' || dataTheme === 'dark')) {
      return dataTheme;
    }
    this.setLightTheme();
    return 'light';
  }

  public toggleTheme() {
    const dataTheme = this.storageService.get(this.STORAGE_KEY);
    if (dataTheme === null) {
      this.storageService.store(this.STORAGE_KEY, 'light');
      this.document.documentElement.setAttribute('data-bs-theme', 'light');
      this.themeSignal.set('light');
      return;
    }
    if (dataTheme === 'light') {
      this.document.documentElement.setAttribute('data-bs-theme', 'dark');
      this.storageService.store(this.STORAGE_KEY, 'dark');
      this.themeSignal.set('dark');
    } else {
      this.storageService.store(this.STORAGE_KEY, 'light');
      this.document.documentElement.setAttribute('data-bs-theme', 'light');
      this.themeSignal.set('light');
    }
  }
}
