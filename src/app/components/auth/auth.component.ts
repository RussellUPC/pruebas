import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  hidePassword = true;
  isLoginMode = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      console.log('Login:', this.loginForm.value);
      this.snackBar.open('¡Inicio de sesión exitoso!', 'Cerrar', {
        duration: 3000
      });
      // Navegar a la búsqueda de consultores después del login
      setTimeout(() => {
        this.router.navigate(['/search-consultants']);
      }, 1000);
    }
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      console.log('Register:', this.registerForm.value);
      this.snackBar.open('¡Registro exitoso!', 'Cerrar', {
        duration: 3000
      });
      // Navegar a la búsqueda de consultores después del registro
      setTimeout(() => {
        this.router.navigate(['/search-consultants']);
      }, 1000);
    }
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }
}