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
  relatedSessionId?: string;
}

export interface Availability {
  id: string;
  consultantId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isActive: boolean;
}