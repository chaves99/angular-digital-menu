import { Injectable, signal, WritableSignal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ThemeService {

  readonly themeSignal: WritableSignal<'light' | 'dark'> = signal('light');

  public setup() {
    const dataTheme = localStorage.getItem('data-theme');
    if (dataTheme === null) {
      localStorage.setItem('data-theme', 'light')
      document.documentElement.setAttribute('data-bs-theme', 'light');
      this.themeSignal.set('light');
      return;
    }
    if (dataTheme === 'light' || dataTheme === 'dark') {
      this.themeSignal.set(dataTheme);
    }
    document.documentElement.setAttribute('data-bs-theme', dataTheme);
  }

  public getTheme(): 'light' | 'dark' {
    const dataTheme = localStorage.getItem('data-theme');
    if (dataTheme !== null
        && (dataTheme === 'light' || dataTheme === 'dark')) {
      return dataTheme;
    }
    this.setup();
    return this.getTheme();
  }

  public toggleTheme() {
    const dataTheme = localStorage.getItem('data-theme');
    if (dataTheme === null) {
      localStorage.setItem('data-theme', 'light')
      document.documentElement.setAttribute('data-bs-theme', 'light');
      this.themeSignal.set('light');
      return
    }
    if (dataTheme === 'light') {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      localStorage.setItem('data-theme', 'dark')
      this.themeSignal.set('dark');
    } else {
      localStorage.setItem('data-theme', 'light')
      document.documentElement.setAttribute('data-bs-theme', 'light');
      this.themeSignal.set('light');
    }
  }
}
