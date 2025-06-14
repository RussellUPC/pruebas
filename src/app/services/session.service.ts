import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Session, Notification } from '../shared/models/session.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Sesiones
  getSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.apiUrl}/sesiones`);
  }

  getSessionById(id: number): Observable<Session> {
    return this.http.get<Session>(`${this.apiUrl}/sesiones/${id}`);
  }

  getSessionsByClientId(clientId: number): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.apiUrl}/sesiones?clienteId=${clientId}`);
  }

  getSessionsByProfessionalId(professionalId: number): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.apiUrl}/sesiones?profesionalId=${professionalId}`);
  }

  createSession(session: Session): Observable<Session> {
    return this.http.post<Session>(`${this.apiUrl}/sesiones`, session);
  }

  updateSession(id: number, session: Partial<Session>): Observable<Session> {
    return this.http.patch<Session>(`${this.apiUrl}/sesiones/${id}`, session);
  }

  // Notificaciones
  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/notificaciones`);
  }

  getNotificationById(id: number): Observable<Notification> {
    return this.http.get<Notification>(`${this.apiUrl}/notificaciones/${id}`);
  }

  getNotificationsByUserId(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/notificaciones?userId=${userId}`);
  }

  markNotificationAsRead(id: number): Observable<Notification> {
    return this.http.patch<Notification>(`${this.apiUrl}/notificaciones/${id}`, { leida: true });
  }

  createNotification(notification: Notification): Observable<Notification> {
    return this.http.post<Notification>(`${this.apiUrl}/notificaciones`, notification);
  }
}