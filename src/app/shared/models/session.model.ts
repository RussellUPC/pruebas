export interface Session {
  id: string;
  clientId: string;
  consultantId: string;
  title: string;
  description: string;
  scheduledDate: Date;
  duration: number; // in minutes
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  meetingLink?: string;
  notes?: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: Date;
  relatedEntityId?: string;
  relatedEntityType?: string;
}

export interface Availability {
  id: string;
  profesionalId: string; // ID del profesional/consultor
  fechaInicio: string; // Fecha y hora de inicio
  fechaFin: string; // Fecha y hora de fin
  disponible: boolean; // Si el horario está disponible
  clienteId?: string; // ID del cliente que reservó (opcional)
}