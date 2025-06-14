import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProfessionalService } from '../../services/professional.service';
import { SessionService } from '../../services/session.service';

interface Professional {
  id: number;
  name: string;
  specialties: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  description: string;
  education: string[];
  certifications: string[];
  languages: string[];
  availability: string;
  profileImage: string;
}

@Component({
  selector: 'app-professional-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './professional-profile.component.html',
  styleUrl: './professional-profile.component.scss'
})
export class ProfessionalProfileComponent implements OnInit {
  professional: Professional | null = null;
  ratingForm: FormGroup;
  showRatingForm = false;

  // Datos de ejemplo
  mockProfessionals: Professional[] = [
    {
      id: 1,
      name: 'Dr. María González',
      specialties: ['Marketing Digital', 'Estrategia de Negocios', 'E-commerce'],
      experience: 8,
      rating: 4.8,
      reviewCount: 127,
      hourlyRate: 75,
      description: 'Especialista en marketing digital con más de 8 años de experiencia ayudando a empresas a crecer en el mundo digital. He trabajado con startups y empresas Fortune 500.',
      education: ['MBA - Universidad de Barcelona', 'Licenciatura en Marketing - Universidad Complutense'],
      certifications: ['Google Ads Certified', 'Facebook Blueprint', 'HubSpot Inbound Marketing'],
      languages: ['Español', 'Inglés', 'Francés'],
      availability: 'Disponible',
      profileImage: 'https://via.placeholder.com/200x200'
    },
    {
      id: 2,
      name: 'Ing. Carlos Rodríguez',
      specialties: ['Desarrollo de Software', 'Arquitectura de Sistemas', 'DevOps'],
      experience: 12,
      rating: 4.9,
      reviewCount: 89,
      hourlyRate: 95,
      description: 'Arquitecto de software senior con experiencia en sistemas distribuidos y tecnologías cloud. Especializado en transformación digital.',
      education: ['Maestría en Ciencias de la Computación - MIT', 'Ingeniería en Sistemas - UNAM'],
      certifications: ['AWS Solutions Architect', 'Kubernetes Certified', 'Scrum Master'],
      languages: ['Español', 'Inglés'],
      availability: 'Ocupado hasta el 15 de Enero',
      profileImage: 'https://via.placeholder.com/200x200'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private professionalService: ProfessionalService,
    private sessionService: SessionService
  ) {
    this.ratingForm = this.fb.group({
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProfessional(parseInt(id));
    }
  }

  loadProfessional(id: number): void {
    this.professionalService.getProfessionalById(id).subscribe({
      next: (professional) => {
        if (professional) {
          // Transformar los datos del profesional al formato que espera el componente
          this.professional = {
            id: parseInt(professional.id),
            name: professional.name,
            specialties: professional.specialties || [],
            experience: professional.experience || 0,
            rating: professional.rating || 4.0,
            reviewCount: 0, // Este campo no existe en el modelo Consultant
            hourlyRate: professional.hourlyRate || 0,
            description: professional.description || '',
            education: [], // Este campo no existe en el modelo Consultant
            certifications: professional.certifications || [],
            languages: [], // Este campo no existe en el modelo Consultant
            availability: professional.availability ? 'Disponible' : 'No disponible',
            profileImage: professional.avatar || 'https://via.placeholder.com/200x200' // Usar el campo avatar del modelo User
          };
        } else {
          this.snackBar.open('Profesional no encontrado', 'Cerrar', {
            duration: 3000
          });
          this.router.navigate(['/search-consultants']);
        }
      },
      error: (error) => {
        console.error('Error loading professional:', error);
        this.snackBar.open('Error al cargar el perfil del profesional', 'Cerrar', {
          duration: 3000
        });
        
        // Usar datos de ejemplo como respaldo
        this.professional = this.mockProfessionals.find(p => p.id === id) || null;
        if (!this.professional) {
          this.router.navigate(['/search-consultants']);
        }
      }
    });
  }

  getStarArray(rating: number): boolean[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating);
    }
    return stars;
  }

  toggleRatingForm(): void {
    this.showRatingForm = !this.showRatingForm;
  }

  submitRating(): void {
    if (this.ratingForm.valid && this.professional) {
      const { rating, comment } = this.ratingForm.value;
      
      const reviewData = {
        professionalId: this.professional.id.toString(),
        rating: parseInt(rating),
        comment: comment,
        date: new Date().toISOString()
      };
      
      // En un sistema real, esto enviaría la valoración al backend
      // Por ahora, simulamos una respuesta exitosa
      setTimeout(() => {
        // Actualizar la valoración en la interfaz
        if (this.professional) {
          const newRating = (this.professional.rating * this.professional.reviewCount + parseInt(rating)) / 
                          (this.professional.reviewCount + 1);
          
          this.professional.rating = parseFloat(newRating.toFixed(1));
          this.professional.reviewCount += 1;
        }
        
        this.snackBar.open('¡Valoración enviada exitosamente!', 'Cerrar', {
          duration: 3000
        });
        
        this.showRatingForm = false;
        this.ratingForm.reset();
      }, 500);
    }
  }

  contactProfessional(): void {
    if (this.professional) {
      // Aquí se implementaría la lógica para crear una sesión o iniciar un chat
      // Por ahora, mostramos un mensaje informativo
      this.snackBar.open('Iniciando contacto con ' + this.professional.name, 'Cerrar', {
        duration: 3000
      });
      
      // En una implementación real, se crearía una sesión y se redigiría al chat
      // this.sessionService.createSession({
      //   professionalId: this.professional.id.toString(),
      //   clientId: 'current-user-id',
      //   date: new Date().toISOString(),
      //   status: 'pending'
      // }).subscribe(...);
    }
  }

  goBack(): void {
    this.router.navigate(['/search-consultants']);
  }
}