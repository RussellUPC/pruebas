import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Consultant } from '../../shared/models/user.model';
import { ProfessionalService } from '../../services/professional.service';

@Component({
  selector: 'app-search-consultants',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatToolbarModule,
    MatSliderModule,
    MatCheckboxModule
  ],
  templateUrl: './search-consultants.component.html',
  styleUrl: './search-consultants.component.scss'
})
export class SearchConsultantsComponent implements OnInit {
  searchForm: FormGroup;
  consultants: Consultant[] = [];
  filteredConsultants: Consultant[] = [];
  
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
    private professionalService: ProfessionalService
  ) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      specialty: [''],
      minRating: [0],
      maxRate: [200],
      availableOnly: [true]
    });
  }

  ngOnInit() {
    this.loadConsultants();
    
    // Subscribe to form changes for real-time filtering
    this.searchForm.valueChanges.subscribe(() => {
      this.filterConsultants();
    });
  }

  loadConsultants() {
    this.professionalService.getProfessionals().subscribe({
      next: (data) => {
        // Ahora el servicio ya maneja el mapeo de datos
        this.consultants = data;
        this.filteredConsultants = [...this.consultants];
      },
      error: (error) => {
        console.error('Error al cargar profesionales:', error);
        // Cargar datos de respaldo en caso de error
        this.loadBackupConsultants();
      }
    });
  }

  loadBackupConsultants() {
    // Datos de respaldo en caso de que falle la API
    this.consultants = [
      {
        id: '1',
        name: 'Dr. María González',
        email: 'maria@example.com',
        userType: 'consultant',
        specialties: ['Tecnología', 'Consultoría Empresarial'],
        experience: 8,
        rating: 4.8,
        hourlyRate: 75,
        availability: true,
        description: 'Especialista en transformación digital con más de 8 años de experiencia ayudando a empresas a modernizar sus procesos.',
        createdAt: new Date(),
        certifications: ['PMP', 'Scrum Master']
      },
      {
        id: '2',
        name: 'Ing. Carlos Rodríguez',
        email: 'carlos@example.com',
        userType: 'consultant',
        specialties: ['Marketing', 'Diseño'],
        experience: 5,
        rating: 4.6,
        hourlyRate: 60,
        availability: true,
        description: 'Experto en marketing digital y diseño UX/UI. He trabajado con startups y empresas Fortune 500.',
        createdAt: new Date()
      },
      {
        id: '3',
        name: 'Lic. Ana Martínez',
        email: 'ana@example.com',
        userType: 'consultant',
        specialties: ['Finanzas', 'Legal'],
        experience: 12,
        rating: 4.9,
        hourlyRate: 90,
        availability: false,
        description: 'Consultora financiera y legal con amplia experiencia en fusiones y adquisiciones.',
        createdAt: new Date()
      }
    ];
    this.filteredConsultants = [...this.consultants];
  }

  filterConsultants() {
    const formValue = this.searchForm.value;
    
    this.filteredConsultants = this.consultants.filter(consultant => {
      const matchesSearch = !formValue.searchTerm || 
        consultant.name.toLowerCase().includes(formValue.searchTerm.toLowerCase()) ||
        consultant.description.toLowerCase().includes(formValue.searchTerm.toLowerCase());
      
      const matchesSpecialty = !formValue.specialty || 
        consultant.specialties.includes(formValue.specialty);
      
      const matchesRating = consultant.rating >= formValue.minRating;
      
      const matchesRate = consultant.hourlyRate <= formValue.maxRate;
      
      const matchesAvailability = !formValue.availableOnly || consultant.availability;
      
      return matchesSearch && matchesSpecialty && matchesRating && matchesRate && matchesAvailability;
    });
  }

  selectConsultant(consultant: Consultant) {
    console.log('Selected consultant:', consultant);
    // Verificar si el consultor está disponible para reservar una sesión
    if (consultant.availability) {
      // Navegar a la página de reserva o perfil del profesional
      this.router.navigate(['/professional-profile', consultant.id]);
    } else {
      // Si no está disponible, solo mostrar el perfil
      this.router.navigate(['/professional-profile', consultant.id]);
    }
  }

  getRatingStars(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('star');
    }
    
    if (hasHalfStar) {
      stars.push('star_half');
    }
    
    while (stars.length < 5) {
      stars.push('star_border');
    }
    
    return stars;
  }
}