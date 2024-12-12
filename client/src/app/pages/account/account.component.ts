import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';


@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  authService = inject(AuthService)
  currentTheme: 'light' | 'dark' = 'light';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.currentTheme = this.themeService.getTheme();
  }

  onThemeChange(theme: 'light' | 'dark'): void {
    this.currentTheme = theme;
    this.themeService.setTheme(theme);
  }
  accountDetail$ = this.authService.getDetail()
}
