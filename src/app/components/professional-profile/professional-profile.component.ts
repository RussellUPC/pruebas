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
    private snackBar: MatSnackBar
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
    // Simular carga de datos
    this.professional = this.mockProfessionals.find(p => p.id === id) || null;
    if (!this.professional) {
      this.router.navigate(['/search-consultants']);
    }
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
    if (this.ratingForm.valid) {
      const { rating, comment } = this.ratingForm.value;
      console.log('Nueva valoración:', { rating, comment, professionalId: this.professional?.id });
      
      this.snackBar.open('¡Valoración enviada exitosamente!', 'Cerrar', {
        duration: 3000
      });
      
      this.showRatingForm = false;
      this.ratingForm.reset();
    }
  }

  contactProfessional(): void {
    this.snackBar.open('Funcionalidad de contacto próximamente', 'Cerrar', {
      duration: 3000
    });
  }

  goBack(): void {
    this.router.navigate(['/search-consultants']);
  }
}