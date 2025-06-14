import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consultant } from '../shared/models/user.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Método para mapear datos de la API a nuestro modelo Consultant
  mapToProfessional(apiProfessional: any): Consultant {
    return {
      id: apiProfessional.id.toString(),
      name: apiProfessional.nombre,
      email: apiProfessional.email,
      phone: apiProfessional.telefono || '',
      userType: 'consultant',
      specialties: apiProfessional.especialidad ? [apiProfessional.especialidad] : [],
      experience: apiProfessional.experiencia || 5, // Valor por defecto
      rating: apiProfessional.calificacion || 4.0, // Valor por defecto
      hourlyRate: apiProfessional.tarifa || 75, // Valor por defecto
      availability: apiProfessional.disponibilidad !== undefined ? apiProfessional.disponibilidad : true,
      description: apiProfessional.descripcion || 'Profesional disponible para consultas',
      createdAt: new Date(apiProfessional.createdAt || new Date())
    };
  }

  // Método para mapear nuestro modelo a formato de API
  mapToApiProfessional(professional: Consultant): any {
    return {
      nombre: professional.name,
      email: professional.email,
      telefono: professional.phone || '',
      especialidad: professional.specialties && professional.specialties.length > 0 ? professional.specialties[0] : '',
      experiencia: professional.experience,
      calificacion: professional.rating,
      tarifa: professional.hourlyRate,
      disponibilidad: professional.availability,
      descripcion: professional.description,
      createdAt: professional.createdAt.toISOString()
    };
  }

  getProfessionals(): Observable<Consultant[]> {
    return this.http.get<any[]>(`${this.apiUrl}/profesionales`).pipe(
      map(professionals => professionals.map(pro => this.mapToProfessional(pro)))
    );
  }

  getProfessionalById(id: number): Observable<Consultant> {
    return this.http.get<any>(`${this.apiUrl}/profesionales/${id}`).pipe(
      map(professional => this.mapToProfessional(professional))
    );
  }

  createProfessional(professional: Consultant): Observable<Consultant> {
    const apiProfessional = this.mapToApiProfessional(professional);
    return this.http.post<any>(`${this.apiUrl}/profesionales`, apiProfessional).pipe(
      map(newProfessional => this.mapToProfessional(newProfessional))
    );
  }

  updateProfessional(id: number, professional: Partial<Consultant>): Observable<Consultant> {
    // Convertir las propiedades del modelo a formato de API
    const apiUpdate: any = {};
    if (professional.name) apiUpdate.nombre = professional.name;
    if (professional.email) apiUpdate.email = professional.email;
    if (professional.phone) apiUpdate.telefono = professional.phone;
    if (professional.specialties) apiUpdate.especialidad = professional.specialties[0];
    if (professional.experience) apiUpdate.experiencia = professional.experience;
    if (professional.rating) apiUpdate.calificacion = professional.rating;
    if (professional.hourlyRate) apiUpdate.tarifa = professional.hourlyRate;
    if (professional.availability !== undefined) apiUpdate.disponibilidad = professional.availability;
    if (professional.description) apiUpdate.descripcion = professional.description;
    
    return this.http.patch<any>(`${this.apiUrl}/profesionales/${id}`, apiUpdate).pipe(
      map(updatedProfessional => this.mapToProfessional(updatedProfessional))
    );
  }

  updateAvailability(id: number, availability: boolean): Observable<Consultant> {
    return this.http.patch<any>(`${this.apiUrl}/profesionales/${id}`, { disponibilidad: availability }).pipe(
      map(updatedProfessional => this.mapToProfessional(updatedProfessional))
    );
  }
}