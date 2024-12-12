import { Component, inject } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthService } from '../../services/auth.service';
import { QuoteService } from '../../services/quote.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { Quote } from '../../interfaces/quote';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-citats',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition('void => *', [
        animate('500ms ease-in')
      ]),
    ])
  ]
})
export class QuotesComponent {
  authService = inject(AuthService);
  quoteService = inject(QuoteService);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);

  quotes$: Observable<Quote[]>;

  constructor() {
    // Fetch quotes only if the user is authenticated
    this.quotes$ = this.authService.getUserDetail()
      ? this.quoteService.getQuotes().pipe(
          map(quotes => quotes.reverse())  // Reverse quotes array
        )
      : new Observable<any[]>();  // Empty observable when not authenticated
  }

  deleteQuote(quoteId: string): void {
    // Show a snack bar with a confirm action
    const snackBarRef = this.matSnackBar.open(
      'Är du säker på att du vill ta bort detta citat?',  // Translated message
      'Bekräfta',  // Action button text in Swedish
      { duration: 5000, horizontalPosition: 'center' }
    );

    // When the user clicks on 'Confirm', delete the quote
    snackBarRef.onAction().subscribe(() => {
      this.quoteService.deleteQuote(quoteId).subscribe({
        next: (response) => {
          console.log('Citat borttaget:', response);
          // Optionally show a success message after deletion
          this.matSnackBar.open('Citat borttaget framgångsrikt!', 'Stäng', {  // Translated message
            duration: 3000,
            horizontalPosition: 'center',
          });
          this.quotes$ = this.quoteService.getQuotes().pipe(
            map(quotes => quotes.reverse())  // Reverse quotes array again
          );
        },
        error: (err) => {
          console.error('Fel vid borttagning av citat:', err);  // Translated error message
          // Optionally handle errors (e.g., show an error message)
          this.matSnackBar.open('Fel vid borttagning av citat. Försök igen.', 'Stäng', {  // Translated message
            duration: 3000,
            horizontalPosition: 'center',
          });
        }
      });
    });
  }
}
