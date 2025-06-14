import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { User, Client, Consultant } from '../shared/models/user.model';
import { ProfessionalService } from './professional.service';
import { ClientService } from './client.service';

interface AuthResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private currentUser: User | null = null;
  private token: string | null = null;

  constructor(
    private http: HttpClient,
    private professionalService: ProfessionalService,
    private clientService: ClientService
  ) {
    // Recuperar usuario y token del localStorage al iniciar el servicio
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');
    
    if (userJson && token) {
      this.currentUser = JSON.parse(userJson);
      this.token = token;
    }
  }

  login(email: string, password: string): Observable<User> {
    // En una API real, enviaríamos las credenciales al servidor
    // Para nuestra API falsa, simularemos la autenticación buscando el usuario por email
    
    // Primero buscamos en profesionales
    return this.http.get<any[]>(`${this.apiUrl}/profesionales?email=${email}`).pipe(
      switchMap(professionals => {
        if (professionals.length > 0) {
          // Simulamos validación de contraseña (en una API real esto se haría en el servidor)
          const apiProfessional = professionals[0];
          const user = this.professionalService['mapToProfessional'](apiProfessional);
          this.setCurrentUser(user, 'fake-token-123');
          return of(user);
        }
        
        // Si no encontramos en profesionales, buscamos en clientes
        return this.http.get<any[]>(`${this.apiUrl}/clientes?email=${email}`).pipe(
          map(clients => {
            if (clients.length > 0) {
              const apiClient = clients[0];
              const user = this.clientService['mapToClient'](apiClient);
              this.setCurrentUser(user, 'fake-token-456');
              return user;
            }
            throw new Error('Usuario o contraseña incorrectos');
          })
        );
      }),
      catchError(error => {
        return throwError(() => new Error('Error de autenticación: ' + error.message));
      })
    );
  }

  register(user: Partial<User>, password: string): Observable<User> {
    // En una API real, el servidor manejaría la creación del usuario y el hash de la contraseña
    // Para nuestra API falsa, simplemente crearemos el usuario
    
    if (user.userType === 'consultant') {
      // Convertir el usuario parcial a un Consultant completo
      const consultant: Consultant = {
        id: '',
        name: user.name || '',
        email: user.email || '',
        phone: user.phone,
        userType: 'consultant',
        createdAt: new Date(),
        specialties: [],
        experience: 0,
        rating: 0,
        hourlyRate: 0,
        availability: true,
        description: ''
      };
      
      // Usar el servicio de profesionales para crear el usuario
      const apiProfessional = this.professionalService['mapToApiProfessional'](consultant);
      return this.http.post<any>(`${this.apiUrl}/profesionales`, apiProfessional).pipe(
        map(newApiProfessional => {
          const newUser = this.professionalService['mapToProfessional'](newApiProfessional);
          this.setCurrentUser(newUser, 'fake-token-789');
          return newUser;
        })
      );
    } else {
      // Convertir el usuario parcial a un Client completo
      const client: Client = {
        id: '',
        name: user.name || '',
        email: user.email || '',
        phone: user.phone,
        userType: 'client',
        createdAt: new Date()
      };
      
      // Usar el servicio de clientes para crear el usuario
      const apiClient = this.clientService['mapToApiClient'](client);
      return this.http.post<any>(`${this.apiUrl}/clientes`, apiClient).pipe(
        map(newApiClient => {
          const newUser = this.clientService['mapToClient'](newApiClient);
          this.setCurrentUser(newUser, 'fake-token-012');
          return newUser;
        })
      );
    }
  }

  logout(): void {
    this.currentUser = null;
    this.token = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  getToken(): string | null {
    return this.token;
  }

  private setCurrentUser(user: User, token: string): void {
    this.currentUser = user;
    this.token = token;
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', token);
  }
}