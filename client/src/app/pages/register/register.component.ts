import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule for NgIf
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidationError } from '../../interfaces/validation-error';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatInputModule, MatIconModule, ReactiveFormsModule, RouterLink, CommonModule], // Add CommonModule here
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'], // Fix typo: `styleUrl` to `styleUrls`
})

export class RegisterComponent {
  authService = inject(AuthService)
  matSnackBar = inject(MatSnackBar)
  fb = inject(FormBuilder);
  router = inject(Router);
  errors!:ValidationError[]

  // Initialize the form group directly in the class
  registerForm: FormGroup = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      fullName: ['', Validators.required],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: this.passwordMatchValidator,
    }
  );

  confirmPasswordHide: boolean = true;
  passwordHide: boolean = true;

  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  register() {
    this.authService.register(this.registerForm.value).subscribe({
      next: (response)=> {
        console.log(response)

        this.matSnackBar.open(response.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
        })

        this.router.navigate(['/login'])
      },
      error:(err:HttpErrorResponse) => {
        this.errors = err!.error
        if (err!.status == 400) {
          this.matSnackBar.open('Validations error', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',

          })
        }
      },
      complete: () => console.log('register success')
    })
  }
}
