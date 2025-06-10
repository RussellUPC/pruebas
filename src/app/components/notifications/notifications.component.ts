import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

interface Notification {
  id: string;
  type: 'message' | 'booking' | 'payment' | 'system' | 'reminder';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  actionText?: string;
  senderName?: string;
  senderAvatar?: string;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatChipsModule,
    MatDividerModule,
    MatMenuModule,
    MatTooltipModule
  ],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  selectedFilter: string = 'all';
  unreadCount: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadNotifications();
    this.updateUnreadCount();
  }

  loadNotifications(): void {
    // Simulamos datos de notificaciones
    this.notifications = [
      {
        id: '1',
        type: 'booking',
        title: 'Nueva cita programada',
        message: 'María García ha programado una consulta contigo para el 15 de enero a las 10:00 AM.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        read: false,
        priority: 'high',
        actionUrl: '/session-booking',
        actionText: 'Ver detalles',
        senderName: 'María García',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '2',
        type: 'message',
        title: 'Nuevo mensaje',
        message: 'Carlos López te ha enviado un mensaje sobre la consulta de marketing digital.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
        read: false,
        priority: 'medium',
        actionUrl: '/messages',
        actionText: 'Leer mensaje',
        senderName: 'Carlos López',
        senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '3',
        type: 'payment',
        title: 'Pago recibido',
        message: 'Has recibido un pago de 75€ por la consulta con Ana Martínez.',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 día atrás
        read: true,
        priority: 'medium',
        actionUrl: '/payments',
        actionText: 'Ver detalles',
        senderName: 'Ana Martínez'
      },
      {
        id: '4',
        type: 'reminder',
        title: 'Recordatorio de cita',
        message: 'Tienes una consulta programada mañana a las 2:00 PM con Pedro Sánchez.',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
        read: false,
        priority: 'high',
        actionUrl: '/calendar',
        actionText: 'Ver calendario',
        senderName: 'Sistema'
      },
      {
        id: '5',
        type: 'system',
        title: 'Actualización de perfil',
        message: 'Tu perfil ha sido actualizado exitosamente. Los cambios ya están visibles para los clientes.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 días atrás
        read: true,
        priority: 'low',
        senderName: 'Sistema'
      },
      {
        id: '6',
        type: 'booking',
        title: 'Cita cancelada',
        message: 'Laura Fernández ha cancelado la cita programada para el 12 de enero.',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 días atrás
        read: true,
        priority: 'medium',
        senderName: 'Laura Fernández'
      }
    ];

    this.filteredNotifications = [...this.notifications];
  }

  updateUnreadCount(): void {
    this.unreadCount = this.notifications.filter(n => !n.read).length;
  }

  filterNotifications(filter: string): void {
    this.selectedFilter = filter;
    
    switch (filter) {
      case 'unread':
        this.filteredNotifications = this.notifications.filter(n => !n.read);
        break;
      case 'messages':
        this.filteredNotifications = this.notifications.filter(n => n.type === 'message');
        break;
      case 'bookings':
        this.filteredNotifications = this.notifications.filter(n => n.type === 'booking');
        break;
      case 'payments':
        this.filteredNotifications = this.notifications.filter(n => n.type === 'payment');
        break;
      case 'system':
        this.filteredNotifications = this.notifications.filter(n => n.type === 'system' || n.type === 'reminder');
        break;
      default:
        this.filteredNotifications = [...this.notifications];
    }
  }

  markAsRead(notification: Notification): void {
    if (!notification.read) {
      notification.read = true;
      this.updateUnreadCount();
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.updateUnreadCount();
  }

  deleteNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.filterNotifications(this.selectedFilter);
    this.updateUnreadCount();
  }

  handleNotificationAction(notification: Notification): void {
    this.markAsRead(notification);
    if (notification.actionUrl) {
      this.router.navigate([notification.actionUrl]);
    }
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'message': return 'message';
      case 'booking': return 'event';
      case 'payment': return 'payment';
      case 'system': return 'settings';
      case 'reminder': return 'alarm';
      default: return 'notifications';
    }
  }

  getNotificationColor(type: string): string {
    switch (type) {
      case 'message': return '#2196F3';
      case 'booking': return '#4CAF50';
      case 'payment': return '#FF9800';
      case 'system': return '#9C27B0';
      case 'reminder': return '#F44336';
      default: return '#757575';
    }
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority}`;
  }

  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - timestamp.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `hace ${diffInMinutes} min`;
    } else if (diffInHours < 24) {
      return `hace ${diffInHours}h`;
    } else if (diffInDays < 7) {
      return `hace ${diffInDays}d`;
    } else {
      return timestamp.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short'
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/search-consultants']);
  }

  trackByNotificationId(index: number, notification: Notification): string {
    return notification.id;
  }
}