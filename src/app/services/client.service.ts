import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../shared/models/user.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Método para mapear datos de la API a nuestro modelo Client
  mapToClient(apiClient: any): Client {
    return {
      id: apiClient.id.toString(),
      name: apiClient.nombre,
      email: apiClient.email,
      phone: apiClient.telefono || '',
      userType: 'client',
      company: apiClient.empresa || '',
      createdAt: new Date(apiClient.createdAt || new Date())
    };
  }

  // Método para mapear nuestro modelo a formato de API
  mapToApiClient(client: Client): any {
    return {
      nombre: client.name,
      email: client.email,
      telefono: client.phone || '',
      empresa: client.company || '',
      createdAt: client.createdAt.toISOString()
    };
  }

  getClients(): Observable<Client[]> {
    return this.http.get<any[]>(`${this.apiUrl}/clientes`).pipe(
      map(clients => clients.map(client => this.mapToClient(client)))
    );
  }

  getClientById(id: number): Observable<Client> {
    return this.http.get<any>(`${this.apiUrl}/clientes/${id}`).pipe(
      map(client => this.mapToClient(client))
    );
  }

  createClient(client: Client): Observable<Client> {
    const apiClient = this.mapToApiClient(client);
    return this.http.post<any>(`${this.apiUrl}/clientes`, apiClient).pipe(
      map(newClient => this.mapToClient(newClient))
    );
  }

  updateClient(id: number, client: Partial<Client>): Observable<Client> {
    // Convertir las propiedades del modelo a formato de API
    const apiUpdate: any = {};
    if (client.name) apiUpdate.nombre = client.name;
    if (client.email) apiUpdate.email = client.email;
    if (client.phone) apiUpdate.telefono = client.phone;
    if (client.company) apiUpdate.empresa = client.company;
    
    return this.http.patch<any>(`${this.apiUrl}/clientes/${id}`, apiUpdate).pipe(
      map(updatedClient => this.mapToClient(updatedClient))
    );
  }
}