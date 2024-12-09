import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BookService } from '../../services/book.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidationError } from '../../interfaces/validation-error';
import { HttpErrorResponse } from '@angular/common/http';
import { Book } from '../../interfaces/book';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-edit-book',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition('void => *', [
        animate('500ms ease-in')
      ]),
    ])
  ]

})
export class EditBookComponent implements OnInit {
  authService = inject(AuthService);
  bookService = inject(BookService);
  matSnackBar = inject(MatSnackBar);
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);  // Inject ActivatedRoute to access route parameters

  errors!: ValidationError[];

  today: string = new Date().toISOString().split('T')[0];

  // Define the form group for book details
  editBookForm: FormGroup = this.fb.group({
    bookName: ['', Validators.required],
    author: ['', Validators.required],
    publishDate: [this.today, Validators.required],
  });

  bookId!: string;  // Variable to hold the book ID
  book!: Book;  // Variable to hold the book details

  ngOnInit() {
    // Get the book ID from the route parameters
    this.route.paramMap.subscribe(params => {
      this.bookId = params.get('id')!;  // Assuming the route has an 'id' parameter

      // Fetch the book details by ID
      this.fetchBookDetails();
    });
  }

  // Method to fetch book details
  fetchBookDetails() {
    this.bookService.getBook(this.bookId).subscribe({
      next: (book) => {
        this.book = book;

        // Populate the form with the book details
        this.editBookForm.patchValue({
          bookName: this.book.bookName,
          author: this.book.author,
          publishDate: this.book.publishDate
        });
      },
      error: (err) => {
        console.error('Error fetching book details:', err);
        this.matSnackBar.open('Error fetching book details', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
        });
      }
    });
  }

  // Method to update the book
  updateBook() {
    const formValue = this.editBookForm.value;

    // Capitalize book name and author before submitting
    formValue.bookName = this.capitalizeWords(formValue.bookName);
    formValue.author = this.capitalizeWords(formValue.author);

    this.bookService.putBook(formValue, this.bookId).subscribe({
      next: (response) => {
        console.log(response);

        this.matSnackBar.open(response.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
        });

        // Navigate back to the homepage after the book is updated
        this.router.navigate(['/']);
      },
      error: (err: HttpErrorResponse) => {
        this.errors = err!.error;
        if (err!.status == 400) {
          this.matSnackBar.open('Validation error', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
          });
        }
      },
      complete: () => console.log('Book update success')
    });
  }

  // Method to cancel and navigate back to the homepage
  cancel(event: MouseEvent) {
    event.preventDefault(); // Prevent the form submission
    this.editBookForm.reset(); // Reset the form
    this.router.navigate(['/']); // Navigate to the homepage or another page
  }

  // Utility function to capitalize the first letter of each word in a string
  private capitalizeWords(str: string): string {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  }
}
