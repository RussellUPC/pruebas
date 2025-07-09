export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  userType: 'client' | 'consultant';
  avatar?: string;
  createdAt: Date;
  location?: string; // Añadido para compatibilidad con UserProfile
}

export interface Consultant extends User {
  specialties: string[];
  experience: number;
  rating: number;
  hourlyRate: number;
  availability: boolean;
  description: string; // Equivalente a 'bio' en UserProfile
  certifications?: string[];
}

export interface Client extends User {}
