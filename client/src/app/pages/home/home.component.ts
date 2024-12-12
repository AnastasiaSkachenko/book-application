import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BookService } from '../../services/book.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookDetail } from '../../interfaces/bookDetail';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition('void => *', [
        animate('500ms ease-in')
      ]),
    ])
  ]

})
export class HomeComponent {
  authService = inject(AuthService);
  bookService = inject(BookService);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);

  books$: Observable<BookDetail[]>;

  constructor() {
    // Fetch books only if the user is authenticated
    this.books$ = this.authService.getUserDetail()
      ? this.bookService.getBooks().pipe(
          map(books => books.reverse())  // Reverse books array
        )
      : new Observable<any[]>();  // Empty observable when not authenticated
  }

  deleteBook(bookId: string): void {
    // Show a snack bar with a confirm action
    const snackBarRef = this.matSnackBar.open(
      'Är du säker på att du vill ta bort denna bok?', // Translated message
      'Bekräfta',  // Translated button text
      { duration: 5000, horizontalPosition: 'center' }
    );

    // When the user clicks on 'Confirm', delete the book
    snackBarRef.onAction().subscribe(() => {
      this.bookService.deleteBook(bookId).subscribe({
        next: (response) => {
          console.log('Boken borttagen:', response);  // Translated log message
          // Optionally show a success message after deletion
          this.matSnackBar.open('Boken har tagits bort framgångsrikt!', 'Stäng', {  // Translated message
            duration: 3000,
            horizontalPosition: 'center',
          });
          this.books$ = this.bookService.getBooks().pipe(
            map(books => books.reverse())  // Reverse books array again
          );
        },
        error: (err) => {
          console.error('Fel vid borttagning av bok:', err);  // Translated log message
          // Optionally handle errors (e.g., show an error message)
          this.matSnackBar.open('Fel vid borttagning av bok. Försök igen.', 'Stäng', {  // Translated message
            duration: 3000,
            horizontalPosition: 'center',
          });
        }
      });
    });
  }

  editBook(bookId: string): void {
    this.router.navigate(['/edit-book', bookId]);  // Navigating to edit-book page with book ID as a route parameter
  }
}
