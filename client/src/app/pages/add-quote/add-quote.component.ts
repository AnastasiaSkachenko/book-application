import { Component, inject } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthService } from '../../services/auth.service';
import { QuoteService } from '../../services/quote.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ValidationError } from '../../interfaces/validation-error';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-quote',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink,],
  templateUrl: './add-quote.component.html',
  styleUrls: ['./add-quote.component.css'], // Fixed styleUrl to styleUrls
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition('void => *', [
        animate('500ms ease-in')
      ]),
    ])
  ]
})

export class AddQuoteComponent {
  authService = inject(AuthService);
  quoteService = inject(QuoteService);
  matSnackBar = inject(MatSnackBar);
  fb = inject(FormBuilder);
  router = inject(Router);
  errors!: ValidationError[];
  isButtonHovered: boolean = false;

  onButtonMouseEnter(): void {
    this.isButtonHovered = true;
  }

  // Method to handle mouse leave event
  onButtonMouseLeave(): void {
    this.isButtonHovered = false;
  }

  addQuoteForm: FormGroup = this.fb.group({
    citatText: ['', Validators.required],
    author: ['', Validators.required],
  });

  addQuote() {
    const formValue = this.addQuoteForm.value;

    // Capitalize the quote text and author before submitting
    formValue.citatText = this.capitalizeWords(formValue.citatText);
    formValue.author = this.capitalizeWords(formValue.author);

    this.quoteService.addQuote(formValue).subscribe({
      next: (response) => {
        console.log(response);

        this.matSnackBar.open(response.message, 'Stäng', {  // Translated 'Close' to 'Stäng'
          duration: 5000,
          horizontalPosition: 'center',
        });

        this.router.navigate(['/quotes']);
      },
      error: (err: HttpErrorResponse) => {
        this.errors = err!.error;
        if (err!.status == 400) {
          this.matSnackBar.open('Valideringsfel', 'Stäng', {  // Translated 'Validation error' to 'Valideringsfel'
            duration: 5000,
            horizontalPosition: 'center',
          });
        }
      },
      complete: () => console.log('Citat tillagt framgångsrikt')  // Translated 'Quote add success' to 'Citat tillagt framgångsrikt'
    });
  }

  cancel(event: MouseEvent) {
    event.preventDefault(); // Prevent the form submission
    this.addQuoteForm.reset(); // Reset the form
    this.router.navigate(['/quotes']); // Navigate to the quotes page or another page
  }

  // Utility function to capitalize the first letter of each word in a string
  private capitalizeWords(str: string): string {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  }
}
