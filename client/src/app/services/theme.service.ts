import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeKey = 'theme';

  constructor() {
    const savedTheme = this.getTheme();
    this.setTheme(savedTheme);
  }

  setTheme(theme: 'light' | 'dark'): void {
    document.body.className = ''; // Reset any existing classes
    document.body.classList.add(theme);
    localStorage.setItem(this.themeKey, theme);
  }

  getTheme(): 'light' | 'dark' {
    const savedTheme = localStorage.getItem(this.themeKey);
    return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'light';
  }
}
