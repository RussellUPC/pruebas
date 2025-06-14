import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Availability {
  id: number;
  profesionalId: number;
  fechaInicio: string;
  fechaFin: string;
  disponible: boolean;
  clienteId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getAvailabilityByProfessionalId(professionalId: number): Observable<Availability[]> {
    return this.http.get<Availability[]>(`${this.apiUrl}/agenda?profesionalId=${professionalId}`);
  }

  getAvailableSlots(professionalId: number): Observable<Availability[]> {
    return this.http.get<Availability[]>(`${this.apiUrl}/agenda?profesionalId=${professionalId}&disponible=true`);
  }

  createAvailabilitySlot(slot: Availability): Observable<Availability> {
    return this.http.post<Availability>(`${this.apiUrl}/agenda`, slot);
  }

  updateAvailabilitySlot(id: number, slot: Partial<Availability>): Observable<Availability> {
    return this.http.patch<Availability>(`${this.apiUrl}/agenda/${id}`, slot);
  }

  bookSlot(id: number, clientId: number): Observable<Availability> {
    return this.http.patch<Availability>(`${this.apiUrl}/agenda/${id}`, {
      disponible: false,
      clienteId: clientId
    });
  }
}