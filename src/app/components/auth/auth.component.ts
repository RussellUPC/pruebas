import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

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
    MatSnackBarModule,
    MatSelectModule
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
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      userType: ['client', [Validators.required]]
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (user) => {
          console.log('Login successful:', user);
          this.snackBar.open('¡Inicio de sesión exitoso!', 'Cerrar', {
            duration: 3000
          });
          // Navegar a la búsqueda de consultores después del login
          setTimeout(() => {
            this.router.navigate(['/search-consultants']);
          }, 1000);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.snackBar.open('Error al iniciar sesión: ' + error.message, 'Cerrar', {
            duration: 5000
          });
        }
      });
    }
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      const { name, email, password, userType } = this.registerForm.value;
      let newUser: any;

      if (userType === 'consultant') {
        newUser = {
          name,
          email,
          phone: this.registerForm.value.phone || '',
          userType,
          specialties: [],
          experience: 0,
          rating: 0,
          hourlyRate: 0,
          availability: true,
          description: '',
          createdAt: new Date()
        };
      } else {
        newUser = {
          name,
          email,
          phone: this.registerForm.value.phone || '',
          userType,
          createdAt: new Date()
        };
      }

      this.authService.register(newUser, password).subscribe({
        next: (user) => {
          console.log('Registration successful:', user);
          this.snackBar.open('¡Registro exitoso!', 'Cerrar', {
            duration: 3000
          });
          // Navegar a la búsqueda de consultores después del registro
          setTimeout(() => {
            this.router.navigate(['/search-consultants']);
          }, 1000);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.snackBar.open('Error al registrarse: ' + error.message, 'Cerrar', {
            duration: 5000
          });
        }
      });
    }
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onUserTypeChange(userType: string): void {
    if (userType === 'consultant') {
      this.registerForm.addControl('phone', this.fb.control('', Validators.required));
      this.registerForm.addControl('specialties', this.fb.control('', Validators.required));
      this.registerForm.addControl('experience', this.fb.control('', Validators.required));
      this.registerForm.addControl('hourlyRate', this.fb.control('', Validators.required));
      this.registerForm.addControl('description', this.fb.control('', Validators.required));
    } else {
      this.registerForm.addControl('phone', this.fb.control('', Validators.required));
    }
  }
}
