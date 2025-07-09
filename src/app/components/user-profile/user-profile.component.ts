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
import { AuthService } from '../../services/auth.service';
import { ClientService } from '../../services/client.service';
import { ProfessionalService } from '../../services/professional.service';
import { Client, Consultant } from '../../shared/models/user.model';

// Interfaz para el perfil de usuario unificado
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  userType: 'client' | 'consultant';
  avatar: string;
  joinDate: Date;
  bio: string; // Biografía del usuario (description para consultores)
  location: string; // Ubicación del usuario
  // Campos específicos para consultores
  specialties?: string[];
  experience?: number;
  hourlyRate?: number;
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
    avatar: 'https://via.placeholder.com/150x150',
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
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private clientService: ClientService,
    private professionalService: ProfessionalService
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
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.snackBar.open('No hay usuario autenticado', 'Cerrar', {
        duration: 3000
      });
      this.router.navigate(['/auth']);
      return;
    }

    if (currentUser.userType === 'client') {
      this.clientService.getClientById(parseInt(currentUser.id)).subscribe({
        next: (client) => {
          this.userProfile = {
            ...client,
            userType: 'client',
            avatar: client.avatar || 'https://via.placeholder.com/150x150',
            joinDate: new Date(client.createdAt || new Date()),
            bio: '', // Cliente no tiene bio, se inicializa vacía
            location: client.location || ''
          };
          this.updateFormValues();
        },
        error: (error) => {
          console.error('Error loading client profile:', error);
          this.snackBar.open('Error al cargar el perfil', 'Cerrar', {
            duration: 3000
          });
          // Usar datos de ejemplo como respaldo
          this.userProfile = this.mockUserProfile;
          this.updateFormValues();
        }
      });
    } else {
      this.professionalService.getProfessionalById(parseInt(currentUser.id)).subscribe({
        next: (professional) => {
          this.userProfile = {
            ...professional,
            userType: 'consultant',
            avatar: professional.avatar || 'https://via.placeholder.com/150x150',
            joinDate: new Date(professional.createdAt || new Date()),
            bio: professional.description || '', // Mapear description a bio
            location: professional.location || ''
          };
          this.updateFormValues();
        },
        error: (error) => {
          console.error('Error loading professional profile:', error);
          this.snackBar.open('Error al cargar el perfil', 'Cerrar', {
            duration: 3000
          });
          // Usar datos de ejemplo como respaldo
          this.userProfile = this.mockUserProfile;
          this.updateFormValues();
        }
      });
    }
  }

  updateFormValues(): void {
    this.profileForm.patchValue({
      name: this.userProfile.name,
      email: this.userProfile.email,
      phone: this.userProfile.phone || '',
      location: this.userProfile.location || '',
      bio: this.userProfile.bio || '',
      // Campos específicos para consultores
      specialties: this.userProfile.specialties || [],
      experience: this.userProfile.experience || 0,
      hourlyRate: this.userProfile.hourlyRate || 0
    });
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

      // Crear objeto actualizado con los datos del formulario
      const updatedProfile = {
        ...this.userProfile,
        ...formData
      };

      // Guardar en el servidor según el tipo de usuario
      if (updatedProfile.userType === 'client') {
        // Para clientes, necesitamos mapear los campos de UserProfile a Client
        const clientData: Partial<Client> = {
          id: updatedProfile.id,
          name: updatedProfile.name,
          email: updatedProfile.email,
          phone: updatedProfile.phone
        };

        this.clientService.updateClient(parseInt(updatedProfile.id), clientData).subscribe({
          next: (updatedClient) => {
            this.userProfile = {
              ...updatedClient,
              userType: 'client',
              avatar: updatedClient.avatar || this.userProfile.avatar,
              joinDate: this.userProfile.joinDate,
              bio: this.userProfile.bio,
              location: this.userProfile.location
            };

            this.snackBar.open('Perfil actualizado exitosamente', 'Cerrar', {
              duration: 3000
            });

            this.isEditing = false;
          },
          error: (error) => {
            console.error('Error updating client profile:', error);
            this.snackBar.open('Error al actualizar el perfil', 'Cerrar', {
              duration: 3000
            });
          }
        });
      } else {
        // Para consultores, necesitamos mapear los campos de UserProfile a Consultant
        const professionalData: Partial<Consultant> = {
          id: updatedProfile.id,
          name: updatedProfile.name,
          email: updatedProfile.email,
          phone: updatedProfile.phone,
          specialties: updatedProfile.specialties,
          experience: updatedProfile.experience,
          hourlyRate: updatedProfile.hourlyRate,
          description: updatedProfile.bio // Mapear bio a description
        };

        this.professionalService.updateProfessional(parseInt(updatedProfile.id), professionalData).subscribe({
          next: (updatedProfessional) => {
            this.userProfile = {
              ...updatedProfessional,
              userType: 'consultant',
              avatar: updatedProfessional.avatar || this.userProfile.avatar,
              joinDate: this.userProfile.joinDate,
              bio: updatedProfessional.description || '', // Mapear description a bio
              location: updatedProfessional.location || ''
            };

            this.snackBar.open('Perfil actualizado exitosamente', 'Cerrar', {
              duration: 3000
            });

            this.isEditing = false;
          },
          error: (error) => {
            console.error('Error updating professional profile:', error);
            this.snackBar.open('Error al actualizar el perfil', 'Cerrar', {
              duration: 3000
            });
          }
        });
      }
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
