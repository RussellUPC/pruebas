import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: 'client' | 'consultant';
  profileImage: string;
  bio: string;
  specialties?: string[];
  experience?: number;
  hourlyRate?: number;
  location: string;
  joinDate: Date;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatSnackBarModule,
    MatChipsModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditing = false;
  userProfile: UserProfile;

  // Datos de ejemplo del usuario actual
  mockUserProfile: UserProfile = {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan.perez@email.com',
    phone: '+34 123 456 789',
    userType: 'client',
    profileImage: 'https://via.placeholder.com/150x150',
    bio: 'Empresario con experiencia en startups tecnológicas. Busco asesoría en marketing digital y estrategia de negocios.',
    location: 'Madrid, España',
    joinDate: new Date('2023-01-15')
  };

  specialties = [
    'Tecnología',
    'Marketing',
    'Finanzas',
    'Recursos Humanos',
    'Legal',
    'Consultoría Empresarial',
    'Diseño',
    'Salud',
    'Educación'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.userProfile = this.mockUserProfile;
    
    this.profileForm = this.fb.group({
      name: [this.userProfile.name, [Validators.required]],
      email: [this.userProfile.email, [Validators.required, Validators.email]],
      phone: [this.userProfile.phone, [Validators.required]],
      bio: [this.userProfile.bio, [Validators.maxLength(500)]],
      location: [this.userProfile.location, [Validators.required]],
      userType: [this.userProfile.userType, [Validators.required]],
      specialties: [this.userProfile.specialties || []],
      experience: [this.userProfile.experience || 0],
      hourlyRate: [this.userProfile.hourlyRate || 0]
    });
  }

  ngOnInit(): void {
    // Simular carga de datos del usuario
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    // Aquí se cargarían los datos reales del usuario desde el backend
    console.log('Cargando perfil del usuario...');
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Restaurar valores originales si se cancela
      this.profileForm.patchValue({
        name: this.userProfile.name,
        email: this.userProfile.email,
        phone: this.userProfile.phone,
        bio: this.userProfile.bio,
        location: this.userProfile.location,
        userType: this.userProfile.userType,
        specialties: this.userProfile.specialties || [],
        experience: this.userProfile.experience || 0,
        hourlyRate: this.userProfile.hourlyRate || 0
      });
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      const formData = this.profileForm.value;
      
      // Actualizar el perfil local
      this.userProfile = {
        ...this.userProfile,
        ...formData
      };
      
      console.log('Guardando perfil:', this.userProfile);
      
      this.snackBar.open('Perfil actualizado exitosamente', 'Cerrar', {
        duration: 3000
      });
      
      this.isEditing = false;
    } else {
      this.snackBar.open('Por favor, completa todos los campos requeridos', 'Cerrar', {
        duration: 3000
      });
    }
  }

  changeProfileImage(): void {
    // Simular cambio de imagen de perfil
    this.snackBar.open('Funcionalidad de cambio de imagen próximamente', 'Cerrar', {
      duration: 3000
    });
  }

  goBack(): void {
    this.router.navigate(['/search-consultants']);
  }

  isConsultant(): boolean {
    return this.userProfile.userType === 'consultant';
  }

  getJoinDateFormatted(): string {
    return this.userProfile.joinDate.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}