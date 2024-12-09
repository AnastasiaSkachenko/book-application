import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ValidationError } from '../../interfaces/validation-error';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink,],
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition('void => *', [
        animate('500ms ease-in')
      ]),
    ])
  ]
})


export class AddBookComponent {
  authService = inject(AuthService);
  bookService = inject(BookService);
  matSnackBar = inject(MatSnackBar);
  fb = inject(FormBuilder);
  router = inject(Router);
  errors!: ValidationError[];
  isButtonHovered: boolean = false;
  today: string = new Date().toISOString().split('T')[0];

  onButtonMouseEnter(): void {
    this.isButtonHovered = true;
    }

  // Method to handle mouse leave event
  onButtonMouseLeave(): void {
    this.isButtonHovered = false;
  }


  addBookForm: FormGroup = this.fb.group({
    bookName: ['', Validators.required],
    author: ['', Validators.required],
    publishDate: [this.today, Validators.required],
  });

  addBook() {
    const formValue = this.addBookForm.value;

    // Capitalize book name and author before submitting
    formValue.bookName = this.capitalizeWords(formValue.bookName);
    formValue.author = this.capitalizeWords(formValue.author);

    this.bookService.addBook(formValue).subscribe({
      next: (response) => {
        console.log(response);

        this.matSnackBar.open(response.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
        });

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
      complete: () => console.log('Book add success')
    });
  }

  cancel(event: MouseEvent) {
    event.preventDefault(); // Prevent the form submission
    this.addBookForm.reset(); // Reset the form
    this.router.navigate(['/']); // Navigate to the homepage or another page
  }

  // Utility function to capitalize the first letter of each word in a string
  private capitalizeWords(str: string): string {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  }
}
